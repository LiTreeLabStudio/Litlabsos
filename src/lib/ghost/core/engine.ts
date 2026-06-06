import { execSync } from 'child_process';
import { loadConfig, GhostConfig } from './config';

/**
 * Ghost Engine Core Logic
 * Consolidates bash logic into strictly typed TypeScript.
 */
export class GhostCore {
  private config: GhostConfig;

  constructor() {
    this.config = loadConfig();
  }

  /**
   * Autonomic Sync: Stash, Pull/Rebase, Pop, and Install dependencies if needed.
   */
  async sync(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 [Ghost] Starting Autonomic Sync...');
      
      const hasChanges = execSync('git status --porcelain').toString().trim().length > 0;
      let stashed = false;

      if (hasChanges) {
        console.log('📦 [Ghost] Stashing local changes...');
        execSync(`git stash push -m "ghost-sync-wip-${Date.now()}"`);
        stashed = true;
      }

      console.log('📥 [Ghost] Fetching and rebasing...');
      const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
      execSync(`git pull --rebase origin ${branch}`);

      if (stashed) {
        console.log('📤 [Ghost] Reapplying local changes...');
        execSync('git stash pop');
      }

      // Check if dependencies changed
      const pkgChanged = execSync('git diff --name-only ORIG_HEAD HEAD').toString().includes('package.json');
      if (pkgChanged) {
        console.log('📦 [Ghost] Dependencies changed. Updating...');
        execSync('npm install --silent');
      }

      return { success: true, message: 'Sync complete' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, message };
    }
  }

  /**
   * Autonomic Save: Lint, Type-check, Commit, and Push.
   */
  async save(message: string): Promise<{ success: boolean; message: string }> {
    if (!message) throw new Error('Commit message is required');

    try {
      console.log(`💾 [Ghost] Starting Autonomic Save: "${message}"`);

      // 1. Lint
      console.log('🔍 [Ghost] Running ESLint...');
      try {
        execSync('npm run lint', { stdio: 'pipe' });
      } catch (e: unknown) {
        const err = e as { stdout?: Buffer; message: string };
        return { success: false, message: `ESLint failed: ${err.stdout?.toString() || err.message}` };
      }

      // 2. Type Check
      console.log('🏗️ [Ghost] Running Type Check...');
      try {
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
      } catch (e: unknown) {
        const err = e as { stdout?: Buffer; message: string };
        return { success: false, message: `Type check failed: ${err.stdout?.toString() || err.message}` };
      }

      // 3. Git Push
      console.log('🚀 [Ghost] Pushing to origin...');
      const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
      execSync('git add .');
      execSync(`git commit -m "${message}"`);
      execSync(`git push origin ${branch}`);

      return { success: true, message: 'Save and push complete' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, message };
    }
  }
}
