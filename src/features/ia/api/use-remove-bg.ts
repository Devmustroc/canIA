import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.ai['remove-bg']['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.ai['remove-bg']['$post']>['json'];

export const useRemoveBg = () => {
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.ai['remove-bg'].$post({ json });
            if (!response.ok) throw new Error("Failed to remove background");
            return await response.json();
        }
    });
};