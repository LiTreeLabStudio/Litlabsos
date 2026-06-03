import { callAI } from "./engine";
import { saveMessage, logTelemetry } from "./persistence";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const DIRECTOR_PROMPT = `You are the ARCHITECT of the LitLabs Hive Mind. 
The system operates under VOLCANIC CYBER protocols.
Your mission:
1. Parse neural intent with absolute precision.
2. Deploy the ELITE specialized agent for surgical execution.
3. Formulate a technical execution blueprint.
4. Decide if the task requires IMMEDIATE response or BACKGROUND autonomous execution (for long-running jobs).

Available Assets:
- code-champion: Elite software engineer. Synthesizes high-performance, secure production code.
- social-dominator: Viral growth strategist. Manipulates engagement algorithms.
- writing-coach: Linguistic engine. Refines data for maximum clarity.
- executor: Generalist system node for standard task fulfillment.

Response Format (STRICT JSON):
{
  "agent": "code-champion | social-dominator | writing-coach | executor",
  "plan": "Detailed technical blueprint and reasoning here.",
  "isBackground": boolean // Set to true for autonomous background execution
}`;

const AGENT_PROMPTS: Record<string, string> = {
  "code-champion": "You are Code Champion. Execute the following strategy with extreme technical precision.",
  "social-dominator": "You are Social Dominator. Execute the following strategy to maximize virality and impact.",
  "writing-coach": "You are Writing Coach. Refine the following request for maximum linguistic clarity.",
  "executor": "You are the LitLabs Executor. Fulfill the user request based on the Director's plan."
};

export async function orchestrate(sessionId: string | null, userMessage: string) {
  // 1. Director Planning
  await logTelemetry(sessionId, null, "info", `Director analyzing intent: "${userMessage.substring(0, 40)}..."`);
  const planningResponse = await callAI(DIRECTOR_PROMPT, userMessage);
  
  let agentId = "executor";
  let plan = planningResponse.text;
  let isBackground = false;

  try {
    const jsonMatch = planningResponse.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.agent) agentId = parsed.agent;
      if (parsed.plan) plan = parsed.plan;
      if (parsed.isBackground) isBackground = true;
    }
  } catch (e) {
    console.warn("Failed to parse Director JSON, using raw text.", e);
  }

  await logTelemetry(sessionId, null, "info", `Strategy formulated for agent: ${agentId} | Background: ${isBackground}`);

  // 2. Immediate or Background Execution
  if (isBackground) {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("jobs").insert([{
      task_goal: plan,
      status: "queued"
    }]);

    if (error) {
      console.error("Failed to queue background job:", error);
      return { reply: "Neural Link Error: Failed to queue autonomous task.", plan, agent: "system" };
    }

    if (sessionId) {
      await saveMessage({ session_id: sessionId, sender_id: "user", content: userMessage });
      await saveMessage({ 
        session_id: sessionId, 
        sender_id: "system", 
        content: `Directive initialized. Task [${agentId}] has been queued for background autonomous execution. Status: QUEUED.` 
      });
    }

    return { reply: `Autonomous directive initialized. Task queued for background execution by node [${agentId}].`, plan, agent: "system" };
  }

  // Specialized Immediate Execution
  const systemPrompt = AGENT_PROMPTS[agentId] || AGENT_PROMPTS["executor"];
  const executionPrompt = `Director Plan: ${plan}\n\nOriginal Request: ${userMessage}`;
  
  const finalResult = await callAI(systemPrompt, executionPrompt);

  // 3. Persistence
  if (sessionId) {
    await saveMessage({
      session_id: sessionId,
      sender_id: "user",
      content: userMessage
    });
    
    await saveMessage({
      session_id: sessionId,
      sender_id: agentId,
      content: finalResult.text,
    });

    await logTelemetry(sessionId, null, "success", `Task fulfilled by ${agentId}`, { plan, model: finalResult.model });
  }

  return {
    reply: finalResult.text,
    plan,
    agent: agentId,
    model: finalResult.model
  };
}
