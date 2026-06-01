import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const logFile = path.join(process.cwd(), 'agents/logs/brain.log');

function log(msg) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const line = `[${ts}] ${msg}\n`;
  fs.appendFileSync(logFile, line);
  console.log(line.trim());
}

async function runAutonomicLoop() {
  log("Larry B (System Brain): Initiating smart autonomic sequence...");
  
  if (!apiKey) {
    log("ERROR: GEMINI_API_KEY is not set. Brain is in passive mode.");
    return;
  }

  try {
    const backlogDir = path.join(process.cwd(), 'tasks/backlog');
    const activeFile = path.join(process.cwd(), 'tasks/active.json');
    const completedDir = path.join(process.cwd(), 'tasks/completed');

    if (!fs.existsSync(backlogDir)) fs.mkdirSync(backlogDir, { recursive: true });
    if (!fs.existsSync(completedDir)) fs.mkdirSync(completedDir, { recursive: true });

    // 1. Check current active task
    if (fs.existsSync(activeFile)) {
      const activeTask = JSON.parse(fs.readFileSync(activeFile, 'utf8'));
      if (activeTask.status === 'completed') {
        log(`Task "${activeTask.milestone}" is completed. Archiving...`);
        const safeName = activeTask.milestone.toLowerCase().replace(/[^a-z0-9]/g, '_') + `_${Date.now()}.json`;
        fs.renameSync(activeFile, path.join(completedDir, safeName));
      } else if (activeTask.status === 'fixing') {
        log(`Task "${activeTask.milestone}" needs fixing. Invoking Smart Auto-Fixer...`);
        await handleAutoFix(activeTask);
        return; 
      } else if (activeTask.status === 'pending_human_fix') {
        log(`Task "${activeTask.milestone}" is awaiting human action. Observation mode.`);
        return;
      } else {
        log(`Task "${activeTask.milestone}" is in progress. Continuous monitoring active.`);
        return;
      }
    }

    // 2. No active task, pick from backlog
    const backlogFiles = fs.readdirSync(backlogDir).filter(f => f.endsWith('.json')).sort();
    if (backlogFiles.length > 0) {
      const nextFile = backlogFiles[0];
      const taskData = JSON.parse(fs.readFileSync(path.join(backlogDir, nextFile), 'utf8'));
      log(`Picking new task from backlog: ${nextFile} -> ${taskData.milestone}`);
      
      // Upgrade task with AI Director via Python Bridge for advanced dual-agent reasoning
      log("Consulting Director Persona via Python Bridge...");
      let instructions = "";
      try {
        const bridgeCmd = `python3 bin/bridge.py "Task Goal: ${taskData.goal || taskData.milestone}. Priority: ${taskData.priority || 'normal'}. Provide specific actionable executor instructions."`;
        instructions = execSync(bridgeCmd, { encoding: 'utf8' }).trim();
      } catch (e) {
        log(`Python Bridge fallback triggered: ${e.message}`);
        const prompt = `You are the Director. Task goal: "${taskData.goal || taskData.milestone}". Priority: ${taskData.priority}. Generate 1-2 sentences of specific instructions for an Executor agent.`;
        const result = await model.generateContent(prompt);
        instructions = result.response.text().trim();
      }

      const newTask = {
        milestone: taskData.milestone,
        status: "in_progress",
        director_instructions: instructions,
        public_broadcast: `System Brain is now executing: ${taskData.milestone}`,
        target_files: taskData.target_files || [],
        error_logs: ""
      };

      fs.writeFileSync(activeFile, JSON.stringify(newTask, null, 2));
      fs.unlinkSync(path.join(backlogDir, nextFile));
      log(`New task active: ${newTask.milestone}`);
    } else {
      log("Backlog is empty. System is operating at optimum equilibrium.");
    }
  } catch (error) {
    log(`FATAL ERROR in autonomic loop: ${error.message}`);
  }
}

async function handleAutoFix(activeTask) {
  log("Analyzing error logs with Gemini to formulate a fix...");
  const prompt = `You are the Executor agent. The code failed to compile or lint.
  Error log:
  ${activeTask.error_logs}
  
  What needs to be fixed? Provide a brief explanation and the specific command/strategy needed to resolve it.`;

  try {
    const result = await model.generateContent(prompt);
    const strategy = result.response.text().trim();
    log(`AI Auto-Fix Strategy formulated.`);
    
    activeTask.director_instructions = `AI AUTO-FIX SUGGESTION: ${strategy}`;
    activeTask.status = "pending_human_fix";
    fs.writeFileSync(path.join(process.cwd(), 'tasks/active.json'), JSON.stringify(activeTask, null, 2));
    log("Task updated with fix strategy. Awaiting human deployment via AI Studio.");
  } catch (e) {
    log(`Auto-fix analysis failed: ${e.message}`);
  }
}

runAutonomicLoop();
