import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getAuthUserId } from "@/lib/auth";
import { HARNESS_SYSTEM_PROMPT, STYLE_PROFILES } from "@/features/agent-harness/design-knowledge";
import { callOpenRouterChat, OpenRouterTool } from "@/lib/openrouter";
import { CHAT_MODELS, IMAGE_MODELS, DEFAULT_CHAT_MODEL } from "@/features/ai-models/model-catalog";

const ALIGNMENTS = ["left", "center-horizontal", "right", "top", "center-vertical", "bottom"] as const;
const ARRANGE_ORDERS = ["front", "back", "forward", "backward"] as const;
const SHAPES = ["rectangle", "soft_rectangle", "circle", "triangle", "inverse_triangle", "diamond"] as const;

export const actionSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("add_text"),
    text: z.string(),
    fontSize: z.number().min(6).max(400).optional(),
    fontWeight: z.number().min(100).max(900).optional(),
    fill: z.string().optional(),
    textAlign: z.enum(["left", "center", "right"]).optional(),
    fontStyle: z.enum(["normal", "italic"]).optional(),
    fontFamily: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("add_shape"),
    shape: z.enum(SHAPES),
    fill: z.string().optional(),
    stroke: z.string().optional(),
    strokeWidth: z.number().min(0).max(50).optional(),
    width: z.number().min(1).max(4000).optional(),
    height: z.number().min(1).max(4000).optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("generate_image"),
    prompt: z.string(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("set_background"),
    color: z.string(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("align"),
    target: z.string(),
    alignment: z.enum(ALIGNMENTS),
  }),
  z.object({
    id: z.string(),
    type: z.literal("arrange"),
    target: z.string(),
    order: z.enum(ARRANGE_ORDERS),
  }),
  z.object({
    id: z.string(),
    type: z.literal("set_opacity"),
    target: z.string(),
    opacity: z.number().min(0).max(1),
  }),
  z.object({
    id: z.string(),
    type: z.literal("delete"),
    target: z.string(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("update_object"),
    target: z.string(),
    fill: z.string().optional(),
    text: z.string().optional(),
    fontSize: z.number().optional(),
    opacity: z.number().optional(),
  }),
]);

const planSchema = z.object({
  message: z.string(),
  styleTitle: z.string().optional(),
  actions: z.array(actionSchema).max(25),
});

const canvasSchema = z.object({
  width: z.number(),
  height: z.number(),
  background: z.string().optional(),
  objects: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      text: z.string().optional(),
      left: z.number(),
      top: z.number(),
      width: z.number(),
      height: z.number(),
      fill: z.string().optional(),
    })
  ).max(200),
});

const requestSchema = z.object({
  prompt: z.string().min(1).max(2000),
  style: z.string().optional(),
  canvas: canvasSchema,
  model: z.string().optional(),
  apiKey: z.string().optional(),
});

const OPENROUTER_PLAN_TOOL: OpenRouterTool = {
  type: "function",
  function: {
    name: "propose_design_plan",
    description: "Propose an ordered sequence of professional canvas actions that crafts or modifies the design.",
    parameters: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "One short friendly sentence in French explaining the design intention.",
        },
        styleTitle: {
          type: "string",
          description: "The artistic style chosen (e.g. 'Minimalist Architecture', 'Modern Cyberpunk').",
        },
        actions: {
          type: "array",
          description: "Ordered list of canvas operations to execute sequentially.",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "Unique slug identifier for this action (e.g. 'hero-title', 'accent-bg', 'card-badge').",
              },
              type: {
                type: "string",
                enum: [
                  "add_text",
                  "add_shape",
                  "generate_image",
                  "set_background",
                  "align",
                  "arrange",
                  "set_opacity",
                  "delete",
                  "update_object",
                ],
              },
              text: { type: "string" },
              fontSize: { type: "number" },
              fontWeight: { type: "number" },
              fontFamily: { type: "string" },
              fontStyle: { type: "string", enum: ["normal", "italic"] },
              textAlign: { type: "string", enum: ["left", "center", "right"] },
              shape: { type: "string", enum: SHAPES as unknown as string[] },
              fill: { type: "string" },
              stroke: { type: "string" },
              strokeWidth: { type: "number" },
              width: { type: "number" },
              height: { type: "number" },
              prompt: { type: "string" },
              color: { type: "string" },
              target: { type: "string" },
              alignment: { type: "string", enum: ALIGNMENTS as unknown as string[] },
              order: { type: "string", enum: ARRANGE_ORDERS as unknown as string[] },
              opacity: { type: "number" },
            },
            required: ["id", "type"],
          },
        },
      },
      required: ["message", "actions"],
    },
  },
};

const app = new Hono()
  // 0. List Available OpenRouter Models
  .get("/models", async (c) => {
    return c.json({
      data: {
        chatModels: CHAT_MODELS,
        imageModels: IMAGE_MODELS,
        defaultChatModel: DEFAULT_CHAT_MODEL,
      },
    });
  })

  // 1. Studio Autonomous Plan Endpoint (Supports OpenRouter Multi-Models)
  .post(
    "/plan",
    zValidator("json", requestSchema),
    async (c) => {
      const userId = await getAuthUserId(c);
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { prompt, style, canvas, model, apiKey } = c.req.valid("json");
      const selectedStyle = style && STYLE_PROFILES[style] ? STYLE_PROFILES[style] : undefined;

      const styleContext = selectedStyle
        ? `Mandatory Style Profile: "${selectedStyle.name}". Use background ${selectedStyle.background}, primary color ${selectedStyle.palette.primary}, text color ${selectedStyle.palette.text}. Title font: ${selectedStyle.typography.titleFont}.`
        : `Choose an aesthetic that elevates the design.`;

      const systemPrompt = `${HARNESS_SYSTEM_PROMPT}\n\nCanvas: ${canvas.width}x${canvas.height}px, background: ${canvas.background ?? "white"}.\nExisting objects on canvas: ${JSON.stringify(canvas.objects)}\n${styleContext}`;

      try {
        const result = await callOpenRouterChat({
          model: model || DEFAULT_CHAT_MODEL,
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }],
          tools: [OPENROUTER_PLAN_TOOL],
          max_tokens: 2500,
          apiKey,
        });

        const toolCall = result.toolCalls?.find((t) => t.name === "propose_design_plan");
        if (!toolCall) {
          return c.json({ error: "Le modèle n'a pas renvoyé de plan valide" }, 502);
        }

        const parsed = planSchema.safeParse(toolCall.arguments);
        if (!parsed.success) {
          return c.json({ error: "Le plan retourné par le modèle est incomplet" }, 502);
        }

        return c.json({ data: parsed.data });
      } catch (err: unknown) {
        console.error("Plan generation error:", err);
        return c.json({ error: err instanceof Error ? err.message : "Erreur lors de la génération du plan" }, 500);
      }
    }
  )

  // 2. AI Design Doctor / Canvas Audit Endpoint
  .post(
    "/audit",
    zValidator("json", z.object({ canvas: canvasSchema })),
    async (c) => {
      const userId = await getAuthUserId(c);
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { canvas } = c.req.valid("json");
      const { objects } = canvas;

      const issues: Array<{
        id: string;
        title: string;
        severity: "low" | "medium" | "high";
        description: string;
        suggestion: string;
      }> = [];

      let score = 95;

      const textObjects = objects.filter((o) => o.type === "textbox" || o.type === "i-text" || o.type === "text");
      if (textObjects.length === 0) {
        score -= 20;
        issues.push({
          id: "no-headline",
          title: "Absence de titre ou message clé",
          severity: "high",
          description: "Votre design n'a pas encore de texte principal pour capter l'attention.",
          suggestion: "Ajoutez un titre percutant avec l'outil Texte ou canAI Copilote.",
        });
      }

      const hasImages = objects.some((o) => o.type === "image");
      const hasShapes = objects.some((o) => o.type !== "textbox" && o.type !== "i-text" && o.type !== "text");

      if (!hasImages && !hasShapes && textObjects.length > 0) {
        score -= 15;
        issues.push({
          id: "visual-interest",
          title: "Manque d'accroche visuelle",
          severity: "medium",
          description: "Le visuel ne contient que du texte brut sans illustration ni forme structurante.",
          suggestion: "Insérez une forme en arrière-plan ou une illustration thématique pour enrichir la mise en page.",
        });
      }

      if (objects.length > 15) {
        score -= 10;
        issues.push({
          id: "high-density",
          title: "Forte densité visuelle",
          severity: "medium",
          description: "Le design contient un nombre important d'éléments qui peuvent surcharger la lecture.",
          suggestion: "Simplifiez la composition et donnez de l'espace aux éléments clés.",
        });
      }

      const finalScore = Math.max(25, Math.min(100, score));

      return c.json({
        data: {
          score: finalScore,
          summary: finalScore >= 80
            ? "Excellente composition globale !"
            : finalScore >= 60
              ? "Bonne base mais quelques améliorations recommandées."
              : "Optimisation de contraste et hiérarchie nécessaire.",
          issues,
          canAutoFix: issues.length > 0,
        }
      });
    }
  )

  // 3. Palette Harmonizer Endpoint
  .post(
    "/harmonize",
    zValidator(
      "json",
      z.object({
        styleId: z.string(),
        canvas: canvasSchema,
      })
    ),
    async (c) => {
      const userId = await getAuthUserId(c);
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { styleId, canvas } = c.req.valid("json");
      const profile = STYLE_PROFILES[styleId] || STYLE_PROFILES.minimalist;

      const actions: z.infer<typeof actionSchema>[] = [
        {
          id: "harmonize-bg",
          type: "set_background",
          color: profile.background,
        }
      ];

      canvas.objects.forEach((obj, idx) => {
        if (obj.type === "textbox" || obj.type === "i-text" || obj.type === "text") {
          actions.push({
            id: `harmonize-text-${obj.id || idx}`,
            type: "add_text",
            text: obj.text || "Texte",
            fill: profile.palette.text,
            fontFamily: profile.typography.titleFont,
            fontSize: 48,
          });
        }
      });

      return c.json({
        data: {
          message: `Harmonisation avec la palette ${profile.name} préparée.`,
          profile,
          actions,
        }
      });
    }
  )

  // 4. Conversational canAI Copilote Chat Endpoint (Multi-Models OpenRouter)
  .post(
    "/chat",
    zValidator(
      "json",
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ),
        canvas: canvasSchema,
        selectedObject: z
          .object({
            id: z.string().optional(),
            type: z.string().optional(),
            text: z.string().optional(),
            fill: z.string().optional(),
            fontSize: z.number().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
            left: z.number().optional(),
            top: z.number().optional(),
          })
          .optional(),
        model: z.string().optional(),
        apiKey: z.string().optional(),
      })
    ),
    async (c) => {
      const userId = await getAuthUserId(c);
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { messages, canvas, selectedObject, model, apiKey } = c.req.valid("json");

      const selectedContext = selectedObject
        ? `CURRENTLY SELECTED OBJECT ON CANVAS:\n- ID: "${selectedObject.id || "active"}"\n- Type: ${selectedObject.type}\n- Text: "${selectedObject.text || ""}"\n- Fill/Color: ${selectedObject.fill}\n- Font Size: ${selectedObject.fontSize}px\n- Dimensions: ${Math.round(selectedObject.width || 0)}x${Math.round(selectedObject.height || 0)}px\nIf the user says "change ceci", "mets-le en...", "supprime", "agrandis", they are referring to this selected object (target: "${selectedObject.id || "active"}").`
        : `NO OBJECT CURRENTLY SELECTED (User is operating on the canvas as a whole).`;

      const systemPrompt = `${HARNESS_SYSTEM_PROMPT}

You are canAI Copilote, the intelligent graphic design assistant. You are conversing directly with the designer inside the editor.
Speak in clear, professional, and friendly French.
You have two primary abilities:
1. Explain design choices, critique aesthetics, give layout/typography tips.
2. Direct Action Execution: If the user asks to edit, add, delete, color, align, or generate anything on the canvas, call the tool "propose_design_plan" with the exact ordered operations needed.

${selectedContext}
Canvas Size: ${canvas.width}x${canvas.height}px, Background: ${canvas.background || "#ffffff"}.
Existing objects on canvas: ${JSON.stringify(canvas.objects)}`;

      try {
        const openRouterMessages = messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

        const result = await callOpenRouterChat({
          model: model || DEFAULT_CHAT_MODEL,
          system: systemPrompt,
          messages: openRouterMessages,
          tools: [OPENROUTER_PLAN_TOOL],
          max_tokens: 2000,
          apiKey,
        });

        let actions: z.infer<typeof actionSchema>[] = [];
        let planMessage = "";

        const toolCall = result.toolCalls?.find((t) => t.name === "propose_design_plan");
        if (toolCall) {
          const parsed = planSchema.safeParse(toolCall.arguments);
          if (parsed.success) {
            planMessage = parsed.data.message || "";
            actions = parsed.data.actions;
          }
        }

        const reply = result.reply 
          ? (planMessage ? `${result.reply}\n\n${planMessage}` : result.reply)
          : (planMessage || "Action effectuée sur votre design.");

        return c.json({
          data: {
            reply: reply.trim(),
            actions,
            modelUsed: result.modelUsed,
          },
        });
      } catch (err: unknown) {
        console.error("canAI Copilote Chat error:", err);
        return c.json(
          { error: err instanceof Error ? err.message : "Erreur de communication avec le modèle IA" },
          500
        );
      }
    }
  );

export default app;
