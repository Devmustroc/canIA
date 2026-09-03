import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.agent.audit.$post, 200>;
type RequestType = InferRequestType<typeof client.api.agent.audit.$post>["json"];

export const useAgentAudit = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.agent.audit.$post({ json });
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        const message =
          body && typeof body === "object" && "error" in body
            ? String((body as { error: unknown }).error)
            : "Impossible d'analyser le canvas";
        throw new Error(message);
      }
      return await response.json();
    },
  });
};

export type AuditResult = ResponseType extends { data: infer TData } ? TData : never;
