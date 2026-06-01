import os
import sys
import json
from google import genai
from google.genai import types

def generate_agent_instruction(user_prompt: str) -> str:
    """
    Sends a payload to Gemini to generate structured commands 
    for the local Executor agents.
    """
    # 1. Initialize the client. It automatically picks up GEMINI_API_KEY from your environment.
    # Note: Client initialization without args expects GEMINI_API_KEY env var
    try:
        client = genai.Client()
    except Exception as e:
        return f"Client Initialization Error: {e}"
    
    # 2. Configure system instructions to enforce your tech/bot aesthetic and persona
    # Check if we should enforce JSON output
    is_json = "json" in user_prompt.lower()
    
    config = types.GenerateContentConfig(
        system_instruction=(
            "You are the Core Director for LiTTreeLabstudios. "
            "Output clear, actionable instructions for the local Executor bots. "
            "If JSON is requested, strictly follow the schema provided."
        ),
        temperature=0.7,
        response_mime_type="application/json" if is_json else "text/plain"
    )
    
    try:
        # 3. Call the recommended model for multimodal/coding tasks
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config=config
        )
        
        # 4. Return the text result
        return response.text
        
    except Exception as e:
        return f"Gemini API Error: {e}"

if __name__ == "__main__":
    # Check if prompt is provided as argument
    if len(sys.argv) > 1:
        prompt = sys.argv[1]
    else:
        # Fallback to stdin or default
        prompt = sys.stdin.read().strip() if not sys.stdin.isatty() else "Status check: Hive Mind operational?"

    if not prompt:
        print("Error: No prompt provided.")
        sys.exit(1)

    result = generate_agent_instruction(prompt)
    print(result)
