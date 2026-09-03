import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.agent.harmonize.$post, 200>;
type RequestType = InferRequestType<typeof client.api.agent.harmonize.$post>["json"];

export const useAgentHarmonize = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.agent.harmonize.$post({ json });
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        const message =
          body && typeof body === "object" && "error" in body
            ? String((body as { error: unknown }).error)
            : "Impossible d'harmoniser la palette";
        throw new Error(message);
      }
      return await response.json();
    },
  });
};
