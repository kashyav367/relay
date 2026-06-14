import express from "express";
import { generateText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { createVercelAiMcpClient } from "@corsair-dev/mcp";
import "dotenv/config";

const app = express();

app.use(express.json());

const AI_SYSTEM_PROMPT = `
You are an assistant with access to Corsair tools.

If the user asks about:
- emails
- inbox
- drafts
- sending emails
- calendar events
- meetings
- schedules

Then ALWAYS use the available Corsair tools first.

Rules:
1. Inspect available tools.
2. Use the relevant Gmail or Calendar tool.
3. Return actual tool results.
4. Do NOT ask which provider is being used if Gmail/Calendar tools are available.
5. Prefer tool execution over guessing.
6. Complete the task fully before responding.
`;

app.post("/prompt", async (req, res) => {
  try {
    const { prompt } = req.body;

    const mcpClient = await createVercelAiMcpClient({
      url: "http://localhost:3001/mcp",
      headers: {
        Authorization: `Bearer TEST`,
      },
    });

    const tools = await mcpClient.tools();

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      tools,
      system: AI_SYSTEM_PROMPT,
      prompt,
      stopWhen: stepCountIs(10),

      onStepFinish: ({
        stepNumber,
        toolCalls,
        toolResults,
        text: stepText,
      }) => {
        console.log(`\n===== STEP ${stepNumber} =====`);

        toolCalls?.forEach((call) => {
          console.log(
            "TOOL CALL:",
            call.toolName,
            JSON.stringify(call.input, null, 2),
          );
        });

        toolResults?.forEach((result) => {
          console.log(
            "TOOL RESULT:",
            JSON.stringify(result.output, null, 2),
          );
        });

        if (stepText) {
          console.log("TEXT:", stepText);
        }
      },
    });

    await mcpClient.close();

    res.json({
      success: true,
      message: text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: String(error),
    });
  }
});

app.listen(4000, () => {
  console.log("🚀 Agent Server running on port 4000");
});