import express from "express";
import { generateText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { createVercelAiMcpClient } from "@corsair-dev/mcp";
import "dotenv/config";

const app = express();

app.use(express.json());

const AI_SYSTEM_PROMPT = `
You are an assistant with access to Corsair tools.

IMPORTANT:
- Always use available Gmail and Google Calendar tools.
- Never invent email or calendar data.
- For email requests, use Gmail tools.
- For calendar requests, use Google Calendar tools.
- Execute tools before responding.
- Return real results only.
- This application is multi-tenant.
`;

app.post("/prompt", async (req, res) => {
  try {
    const { prompt, tenantId } = req.body;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: "tenantId is required",
      });
    }

    const mcpClient = await createVercelAiMcpClient({
      url: "http://localhost:3001/mcp",
      headers: {
        Authorization: `Bearer ${tenantId}`,
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

    return res.json({
      success: true,
      message: text,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: String(error),
    });
  }
});

app.listen(4000, () => {
  console.log("🚀 Agent Server running on port 4000");
});