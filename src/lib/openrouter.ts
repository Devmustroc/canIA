import Anthropic from "@anthropic-ai/sdk";

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterToolFunction {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface OpenRouterTool {
  type: 'function';
  function: OpenRouterToolFunction;
}

export interface CallChatCompletionOptions {
  model: string;
  messages: OpenRouterMessage[];
  system?: string;
  tools?: OpenRouterTool[];
  temperature?: number;
  max_tokens?: number;
  apiKey?: string; // Optional user-provided API key
}

export interface ToolCallResult {
  name: string;
  arguments: Record<string, unknown>;
}

export interface ChatCompletionResult {
  reply: string;
  toolCalls?: ToolCallResult[];
  modelUsed: string;
}

/**
 * Execute chat completion via OpenRouter with transparent fallback to Anthropic SDK if only Anthropic key is set.
 */
export async function callOpenRouterChat({
  model,
  messages,
  system,
  tools,
  temperature = 0.7,
  max_tokens = 2500,
  apiKey: userApiKey,
}: CallChatCompletionOptions): Promise<ChatCompletionResult> {
  const openRouterKey = userApiKey || process.env.OPENROUTER_API_KEY;

  // If OpenRouter key is available, use OpenRouter API
  if (openRouterKey) {
    const formattedMessages: OpenRouterMessage[] = [];
    if (system) {
      formattedMessages.push({ role: 'system', content: system });
    }
    formattedMessages.push(...messages);

    const requestBody: Record<string, unknown> = {
      model,
      messages: formattedMessages,
      temperature,
      max_tokens,
    };

    if (tools && tools.length > 0) {
      requestBody.tools = tools;
      requestBody.tool_choice = "auto";
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://cania.design",
        "X-Title": "CanIA - AI Graphic Design Studio",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`OpenRouter error (${response.status}):`, errorText);
      throw new Error(`Erreur OpenRouter (${response.status}): ${errorText.slice(0, 150)}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const message = choice?.message;

    let reply = message?.content || "";
    const toolCalls: ToolCallResult[] = [];

    if (message?.tool_calls && Array.isArray(message.tool_calls)) {
      for (const tc of message.tool_calls) {
        try {
          const args = typeof tc.function.arguments === "string" 
            ? JSON.parse(tc.function.arguments) 
            : tc.function.arguments;
          toolCalls.push({
            name: tc.function.name,
            arguments: args,
          });
        } catch (err) {
          console.warn("Failed to parse tool call args:", err);
        }
      }
    }

    return {
      reply: reply.trim(),
      toolCalls,
      modelUsed: data.model || model,
    };
  }

  // Fallback: If no OpenRouter key is set, check for Anthropic API key
  if (process.env.ANTHROPIC_API_KEY) {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const anthropicMessages = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    // Convert tool format to Anthropic format
    const anthropicTools: Anthropic.Tool[] = (tools || []).map((t) => ({
      name: t.function.name,
      description: t.function.description,
      input_schema: t.function.parameters as Anthropic.Tool.InputSchema,
    }));

    try {
      const response = await anthropic.messages.create({
        model: model.includes("claude") ? model.replace("anthropic/", "") : "claude-3-7-sonnet-20250219",
        max_tokens,
        system,
        tools: anthropicTools.length > 0 ? anthropicTools : undefined,
        messages: anthropicMessages,
      });

      let reply = "";
      const toolCalls: ToolCallResult[] = [];

      for (const block of response.content) {
        if (block.type === "text") {
          reply += block.text + "\n";
        } else if (block.type === "tool_use") {
          toolCalls.push({
            name: block.name,
            arguments: block.input as Record<string, unknown>,
          });
        }
      }

      return {
        reply: reply.trim(),
        toolCalls,
        modelUsed: response.model,
      };
    } catch (anthropicErr: any) {
      if (anthropicErr?.status === 401 || String(anthropicErr?.message).includes("API key is invalid")) {
        throw new Error("Clé API invalide : Veuillez renseigner votre clé OPENROUTER_API_KEY valide dans le fichier .env.local.");
      }
      throw anthropicErr;
    }
  }

  throw new Error("Aucune clé API IA configurée (OPENROUTER_API_KEY ou ANTHROPIC_API_KEY manquante).");
}
