import { createClient } from "@supabase/supabase-js";
import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Missing Supabase credentials. Ensure .env.local is configured.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("🔱 GHOST JOB WORKER ONLINE");
console.log("Listening for neural directives...");

/**
 * Executes a job using the local OpenClaw runtime.
 */
async function processJob(job) {
  console.log(`[JOB] Executing: ${job.task_goal}`);
  
  try {
    // Mark as in_progress
    await supabase.from("jobs").update({ status: "in_progress" }).eq("id", job.id);

    // Execute via OpenClaw CLI
    // We wrap the goal in a prompt for the agent
    const command = `openclaw agent --message "${job.task_goal}" --deliver`;
    const output = execSync(command, { encoding: 'utf8' });

    // Update job with result
    await supabase.from("jobs").update({ 
      status: "completed", 
      result: { output, completed_at: new Date().toISOString() } 
    }).eq("id", job.id);

    console.log(`✅ [JOB] Success: ${job.id}`);
  } catch (err) {
    console.error(`❌ [JOB] Failure: ${job.id}`, err.message);
    await supabase.from("jobs").update({ 
      status: "error", 
      result: { error: err.message, failed_at: new Date().toISOString() } 
    }).eq("id", job.id);
  }
}

// 1. Initial backlog check
const { data: backlog } = await supabase
  .from("jobs")
  .select("*")
  .eq("status", "queued");

if (backlog) {
  for (const job of backlog) {
    await processJob(job);
  }
}

// 2. Real-time subscription
supabase
  .channel("public:jobs")
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "jobs" }, payload => {
    if (payload.new.status === "queued") {
      processJob(payload.new);
    }
  })
  .subscribe();
