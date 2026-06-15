import { generateText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { createVercelAiMcpClient } from "@corsair-dev/mcp";
import "dotenv/config";

const DEFAULT_MCP_URL = "http://localhost:3001/mcp";

const AI_SYSTEM_PROMPT = `
You are an assistant with access to Corsair tools.

Rules:
1. Call list_operations first.
2. Call get_schema when needed.
3. Use Gmail and Calendar tools directly.
4. Never generate JavaScript code.
5. Never use run_script for Gmail or Calendar operations.
6. Return actual tool results.
7. If no tool is needed, answer normally.
`;

export const sendAIPrompt = async (
  userPrompt: string,
  tenantId: string,
  mcpURL: string = DEFAULT_MCP_URL,
): Promise<string> => {
  const mcpClient = await createVercelAiMcpClient({
    url: mcpURL,
    headers: {
      Authorization: `Bearer ${tenantId}`,
    },
  });

  const tools = await mcpClient.tools();

  const { text } = await generateText({
   model: google("gemini-flash-lite-latest"),
    tools,
    system: AI_SYSTEM_PROMPT,
    prompt: userPrompt,
    stopWhen: stepCountIs(20),

    onStepFinish: ({
      stepNumber,
      toolCalls,
      toolResults,
      text: stepText,
    }) => {
      console.log(`\n===== STEP ${stepNumber} =====`);

      toolCalls?.forEach((call) =>
        console.log(
          "TOOL CALL:",
          call.toolName,
          JSON.stringify(call.input, null, 2),
        ),
      );

      toolResults?.forEach((result) =>
        console.log(
          "TOOL RESULT:",
          JSON.stringify(result.output, null, 2),
        ),
      );

      if (stepText) {
        console.log("TEXT:", stepText);
      }
    },
  });

  await mcpClient.close();

  return text.toString();
};