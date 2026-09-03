import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { replicate } from "@/lib/replicate";
import { getAuthUserId } from "@/lib/auth";
import { callOpenRouterChat } from "@/lib/openrouter";

const app = new Hono()
    .post(
        "/generate-image",
        zValidator("json",
            z.object({
                prompt: z.string(),
                model: z.string().optional(),
            })),
        async (c) => {
            const userId = await getAuthUserId(c);
            if (!userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const { prompt, model } = c.req.valid('json');

            try {
                let resUrl: string | undefined;

                if (model?.includes("flux")) {
                    const output: unknown = await replicate.run(
                        "black-forest-labs/flux-schnell",
                        {
                            input: {
                                prompt: prompt,
                                num_outputs: 1,
                                aspect_ratio: "1:1",
                                output_format: "webp",
                                output_quality: 90,
                            }
                        }
                    );
                    const arr = output as string[];
                    resUrl = arr?.[0];
                } else {
                    const input = {
                        cfg: 3.5,
                        steps: 28,
                        prompt: prompt,
                        aspect_ratio: "3:2",
                        output_format: "webp",
                        output_quality: 90,
                        negative_prompt: "",
                        prompt_strength: 0.85
                    };
                    const output = await replicate.run("stability-ai/stable-diffusion-3", { input });
                    const res = output as Array<string>;
                    resUrl = res?.[0];
                }

                return c.json({ data: resUrl || "" });
            } catch (err) {
                console.error("Image generation error:", err);
                return c.json({ error: "Échec de la génération d'image" }, 500);
            }
        }
    )
    .post(
        '/remove-bg',
        zValidator("json",
            z.object({
                image: z.string(),
            })
        ),
        async (c) => {
            const userId = await getAuthUserId(c);
            if (!userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const { image } = c.req.valid('json');
            const input = {
                image: image,
            };
            const output: unknown = await replicate.run("cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003", { input });
            const res = output as string;

            return c.json({ data: res });
        }
    )
    .post('/sticker',
        zValidator("json",
            z.object({
                prompt: z.string(),
                image: z.string(),
            }),
        ),
        async (c) => {
            const userId = await getAuthUserId(c);
            if (!userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const { prompt, image } = c.req.valid('json');
            const output: unknown = await replicate.run(
                "fofr/face-to-sticker:764d4827ea159608a07cdde8ddf1c6000019627515eb02b6b449695fd547e5ef",
                {
                    input: {
                        image: image,
                        steps: 20,
                        width: 1024,
                        height: 1024,
                        prompt: prompt,
                        upscale: false,
                        upscale_steps: 10,
                        negative_prompt: "",
                        prompt_strength: 4.5,
                        ip_adapter_noise: 0.5,
                        ip_adapter_weight: 0.2,
                        instant_id_strength: 0.7
                    }
                }
            );
            const res = output as string;

            return c.json({ data: res });
        }
    )
    .post(
        '/scale',
        zValidator("json",
            z.object({
                image: z.string(),
            })),
        async (c) => {
            const userId = await getAuthUserId(c);
            if (!userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const { image } = c.req.valid('json');

            const output: unknown = await replicate.run(
                "nightmareai/real-esrgan:f0992969a94014d73864d08e6d9a39286868328e4263d9ce2da6fc4049d01a1a",
                {
                    input: {
                        image: image,
                        scale: 2,
                        face_enhance: false
                    }
                }
            );

            const res = output as string;

            return c.json({ data: res });
        }
    )
    .post(
        '/tts',
        zValidator(
            "json",
            z.object({
                text: z.string().max(2000),
                voice: z.string().optional(),
            })
        ),
        async (c) => {
            const userId = await getAuthUserId(c);
            if (!userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const { text, voice } = c.req.valid("json");
            const openRouterKey = process.env.OPENROUTER_API_KEY;

            if (openRouterKey) {
                try {
                    const res = await fetch("https://openrouter.ai/api/v1/audio/speech", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${openRouterKey}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            model: "openai/tts-1",
                            input: text,
                            voice: voice || "nova",
                        }),
                    });

                    if (res.ok) {
                        const buffer = await res.arrayBuffer();
                        const base64Audio = Buffer.from(buffer).toString("base64");
                        return c.json({ data: `data:audio/mp3;base64,${base64Audio}` });
                    }
                } catch (e) {
                    console.warn("OpenRouter TTS fallback to Web Speech:", e);
                }
            }

            return c.json({ data: null, useClientSpeech: true });
        }
    )
    .post(
        "/rewrite-text",
        zValidator(
            "json",
            z.object({
                text: z.string(),
                action: z.string(),
                customPrompt: z.string().optional(),
            })
        ),
        async (c) => {
            const userId = await getAuthUserId(c);
            if (!userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const { text, action, customPrompt } = c.req.valid("json");

            let instruction = "Améliore le texte suivant pour un visuel graphique professionnel.";
            if (action === "slogan") {
                instruction = "Transforme le texte suivant en un slogan percutant et mémorable.";
            } else if (action === "shorter") {
                instruction = "Raccourcis le texte suivant en gardant l'essence du message.";
            } else if (action === "longer") {
                instruction = "Développe le texte suivant avec plus de détails captivants.";
            } else if (action === "formal") {
                instruction = "Réécris le texte suivant avec un ton très professionnel et élégant.";
            } else if (action === "fun") {
                instruction = "Réécris le texte suivant avec un ton dynamique, enthousiaste et créatif.";
            } else if (action === "translate_en") {
                instruction = "Traduis le texte suivant en anglais naturel.";
            } else if (action === "translate_fr") {
                instruction = "Traduis le texte suivant en français naturel.";
            } else if (action === "translate_es") {
                instruction = "Traduis le texte suivant en espagnol naturel.";
            } else if (action === "custom" && customPrompt) {
                instruction = customPrompt;
            }

            try {
                const result = await callOpenRouterChat({
                    model: "google/gemini-2.5-flash",
                    system: "Tu es un expert en rédaction publicitaire et copywriting visuel. Ta tâche est de réécrire le texte fourni par l'utilisateur selon ses consignes. Retourne EXCLUSIVEMENT le texte réécrit, sans guillemets, sans explications, sans puces et sans commentaires.",
                    messages: [
                        {
                            role: "user",
                            content: `Consigne : ${instruction}\n\nTexte original à réécrire :\n"${text}"`,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 300,
                });

                const cleanedText = result.reply.trim().replace(/^["']|["']$/g, '');
                return c.json({ data: cleanedText });
            } catch (err: any) {
                console.error("Rewrite text error:", err);
                return c.json({ error: err?.message || "Échec de la réécriture du texte" }, 500);
            }
        }
    );

export default app;