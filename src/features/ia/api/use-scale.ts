import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.ai['scale']['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.ai['scale']['$post']>['json'];

export const useScale = () => {
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.ai['scale'].$post({ json });
            if (!response.ok) throw new Error("Failed to scale image");
            return await response.json();
        }
    });
};