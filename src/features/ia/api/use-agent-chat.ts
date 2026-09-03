import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.agent.chat.$post, 200>;
type RequestType = InferRequestType<typeof client.api.agent.chat.$post>["json"];

export const useAgentChat = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.agent.chat.$post({ json });
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        const message =
          body && typeof body === "object" && "error" in body
            ? String((body as { error: unknown }).error)
            : "Impossible de joindre canAI Copilote";
        throw new Error(message);
      }
      return await response.json();
    },
  });
};
