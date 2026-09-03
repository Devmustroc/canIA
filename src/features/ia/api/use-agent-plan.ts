import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.agent.plan.$post, 200>;
type RequestType = InferRequestType<typeof client.api.agent.plan.$post>['json'];

export const useAgentPlan = () => {
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.agent.plan.$post({ json });
            if (!response.ok) {
                const body: unknown = await response.json().catch(() => null);
                const message = body && typeof body === "object" && "error" in body
                    ? String((body as { error: unknown }).error)
                    : "Failed to generate a design plan";
                throw new Error(message);
            }
            return await response.json();
        }
    });
};

export type AgentPlan = ResponseType extends { data: infer TData } ? TData : never;
export type AgentAction = AgentPlan extends { actions: (infer TAction)[] } ? TAction : never;
