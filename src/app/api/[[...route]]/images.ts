import { Hono } from "hono";
import { unsplash } from "@/lib/unsplash";
import { getAuthUserId } from "@/lib/auth";

const DEFAULT_COUNT = 50;
const DEFAULT_COLLECTION_IDS = ["317099"];

const FALLBACK_IMAGES = [
  {
    id: "fb-1",
    alt_description: "Paysage de montagne",
    urls: {
      regular: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&q=80",
      small: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80",
      thumb: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&q=80",
    },
    links: { html: "https://unsplash.com/photos/1506744038136-46273834b3fb" },
    user: { name: "Bailey Zindel" }
  },
  {
    id: "fb-2",
    alt_description: "Architecture moderne",
    urls: {
      regular: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1080&q=80",
      small: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80",
      thumb: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&q=80",
    },
    links: { html: "https://unsplash.com/photos/1513694203232-719a280e022f" },
    user: { name: "Simone Hutsch" }
  },
  {
    id: "fb-3",
    alt_description: "Dégradé abstrait",
    urls: {
      regular: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1080&q=80",
      small: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80",
      thumb: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&q=80",
    },
    links: { html: "https://unsplash.com/photos/1541701494587-cb58502866ab" },
    user: { name: "Geordanna Cordero" }
  },
  {
    id: "fb-4",
    alt_description: "Espace de travail épuré",
    urls: {
      regular: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1080&q=80",
      small: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80",
      thumb: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&q=80",
    },
    links: { html: "https://unsplash.com/photos/1497215728101-856f4ea42174" },
    user: { name: "Alesia Kazantceva" }
  },
  {
    id: "fb-5",
    alt_description: "Néon vibrant",
    urls: {
      regular: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080&q=80",
      small: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
      thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80",
    },
    links: { html: "https://unsplash.com/photos/1518770660439-4636190af475" },
    user: { name: "Alexander Sinn" }
  },
  {
    id: "fb-6",
    alt_description: "Feuillage tropical",
    urls: {
      regular: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1080&q=80",
      small: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80",
      thumb: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=200&q=80",
    },
    links: { html: "https://unsplash.com/photos/1518531933037-91b2f5f229cc" },
    user: { name: "Scott Webb" }
  },
  {
    id: "fb-7",
    alt_description: "Ville de nuit",
    urls: {
      regular: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1080&q=80",
      small: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80",
      thumb: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200&q=80",
    },
    links: { html: "https://unsplash.com/photos/1519501025264-65ba15a82390" },
    user: { name: "Aleksandar Pasaric" }
  },
  {
    id: "fb-8",
    alt_description: "Art abstrait",
    urls: {
      regular: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1080&q=80",
      small: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&q=80",
      thumb: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&q=80",
    },
    links: { html: "https://unsplash.com/photos/1579783900882-c0d3dad7b119" },
    user: { name: "Steve Johnson" }
  }
];

const app = new Hono()
    .get("/", async (c) => {
        const userId = await getAuthUserId(c);
        if (!userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        try {
            const images = await unsplash.photos.getRandom({
                collectionIds: DEFAULT_COLLECTION_IDS,
                count: DEFAULT_COUNT,
            });

            if (images.errors || !images.response) {
                return c.json({ data: FALLBACK_IMAGES });
            }

            let response = images.response;

            if (!Array.isArray(response)) {
                response = [response];
            }

            return c.json({ data: response });
        } catch (error) {
            return c.json({ data: FALLBACK_IMAGES });
        }
    });

export default app;