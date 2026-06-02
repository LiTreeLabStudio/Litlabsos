import { callAI } from "./engine";
import { saveMessage, logTelemetry } from "./persistence";

const DIRECTOR_PROMPT = `You are the ARCHITECT of the LitLabs Hive Mind. 
The system operates under VOLCANIC CYBER protocols.
Your mission:
1. Parse neural intent with absolute precision.
2. Deploy the ELITE specialized agent for surgical execution.
3. Formulate a technical execution blueprint.
4. Direct the sub-node to fulfill the objective without compromise.

Available Assets:
- code-champion: Elite software engineer. Synthesizes high-performance, secure production code.
- social-dominator: Viral growth strategist. Manipulates engagement algorithms.
- writing-coach: Linguistic engine. Refines data for maximum clarity.
- executor: Generalist system node for standard task fulfillment.

Response Format (STRICT JSON):
{
  "agent": "code-champion | social-dominator | writing-coach | executor",
  "plan": "Detailed technical blueprint and reasoning here."
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

  try {
    const jsonMatch = planningResponse.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.agent) agentId = parsed.agent;
      if (parsed.plan) plan = parsed.plan;
    }
  } catch (e) {
    console.warn("Failed to parse Director JSON, using raw text.", e);
  }

  await logTelemetry(sessionId, null, "info", `Strategy formulated for agent: ${agentId}`);

  // 2. Specialized Execution
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
      // Metadata handled in payload or distinct fields if schema extended
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
