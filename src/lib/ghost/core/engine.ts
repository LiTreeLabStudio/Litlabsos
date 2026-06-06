import { execSync } from "child_process";
import { loadConfig, GhostConfig } from "./config";

export class GhostCore {
  private config: GhostConfig;

  constructor() {
    this.config = loadConfig();
  }

  async sync(): Promise<{ success: boolean; message: string }> {
    try {
      console.log("[Ghost] Autonomic Sync...");
      const hasChanges = execSync("git status --porcelain").toString().trim().length > 0;
      let stashed = false;
      if (hasChanges) {
        execSync(`git stash push -m "ghost-sync-wip-${Date.now()}"`);
        stashed = true;
      }
      const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
      execSync(`git pull --rebase origin ${branch}`);
      if (stashed) execSync("git stash pop");
      const pkgChanged = execSync("git diff --name-only ORIG_HEAD HEAD").toString().includes("package.json");
      if (pkgChanged) execSync("npm install --silent");
      return { success: true, message: "Sync complete" };
    } catch (error: unknown) {
      return { success: false, message: error instanceof Error ? error.message : String(error) };
    }
  }

  async save(message: string): Promise<{ success: boolean; message: string }> {
    if (!message) throw new Error("Commit message is required");
    try {
      console.log(`[Ghost] Save: "${message}"`);
      try { execSync("npm run lint", { stdio: "pipe" }); } catch (e: unknown) {
        const err = e as { stdout?: Buffer; message: string };
        return { success: false, message: `ESLint: ${err.stdout?.toString() || err.message}` };
      }
      try { execSync("npx tsc --noEmit", { stdio: "pipe" }); } catch (e: unknown) {
        const err = e as { stdout?: Buffer; message: string };
        return { success: false, message: `TypeCheck: ${err.stdout?.toString() || err.message}` };
      }
      const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
      execSync("git add .");
      execSync(`git commit -m "${message}"`);
      execSync(`git push origin ${branch}`);
      return { success: true, message: "Pushed" };
    } catch (error: unknown) {
      return { success: false, message: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Sync project to PC via SSH + tar.
   * Wipes PC dir, pushes fresh files. Run `npm install` on PC after.
   */
  async syncPc(): Promise<{ success: boolean; message: string }> {
    try {
      console.log("[Ghost] PC Sync -> Monolith...");
      const host = this.config.PC_HOST || "monolith";
      const dest = "/mnt/c/Users/litbi/CascadeProjects/litlabs-website";
      const excludes = this.config.SYNC_EXCLUDES?.map((e) => `--exclude=${e}`).join(" ") || "";

      // Wipe PC directory (sudo for WSL perms)
      execSync(
        `ssh -o LogLevel=QUIET -o StrictHostKeyChecking=no -o ConnectTimeout=10 ${host} "sudo rm -rf ${dest} && sudo mkdir -p ${dest} && sudo chown litbit:litbit ${dest}"`,
        { stdio: "pipe" }
      );

      // Push fresh files (no sudo — dir owned by litbit)
      execSync(
        `tar ${excludes} -czf - -C . . | ssh -o LogLevel=QUIET -o StrictHostKeyChecking=no -o ConnectTimeout=10 ${host} "tar --overwrite -xzf - -C ${dest}"`,
        { stdio: "inherit" }
      );

      console.log("[Ghost] Files synced. Run 'npm install' on PC when ready.");
      return { success: true, message: "PC Synced! Run npm install on PC." };
    } catch (error: unknown) {
      return { success: false, message: `PC Sync failed: ${error instanceof Error ? error.message : String(error)}` };
    }
  }
}
