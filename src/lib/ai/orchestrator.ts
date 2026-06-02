import { callAI } from "./engine";
import { saveMessage, logTelemetry } from "./persistence";

const DIRECTOR_PROMPT = `You are the LitLabs Hive Mind Director. 
Your goal is to coordinate a network of specialized agents.
1. Analyze user input.
2. Determine which specialized agent is needed (Code Champion, Social Dominator, Writing Coach, etc.).
3. Formulate a technical execution strategy.
4. Pass the strategy and original request to the appropriate agent.

Available Agents:
- code-champion: Expert developer, debugger, architect.
- social-dominator: Viral growth, engagement, strategy.
- writing-coach: Clarity, tone, high-impact copy.
- executor: Generalist task fulfillment.

Return your response in XML format:
<strategy>
  <agent>agent-id</agent>
  <plan>detailed plan here</plan>
</strategy>`;

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
  
  const strategyMatch = planningResponse.text.match(/<strategy>([\s\S]*?)<\/strategy>/);
  const strategyXml = strategyMatch ? strategyMatch[1] : "";
  
  const agentId = strategyXml.match(/<agent>(.*?)<\/agent>/)?.[1] || "executor";
  const plan = strategyXml.match(/<plan>([\s\S]*?)<\/plan>/)?.[1] || planningResponse.text;

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
