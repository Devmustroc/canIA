import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.ai['rewrite-text']['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.ai['rewrite-text']['$post']>['json'];

export const useRewriteText = () => {
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.ai['rewrite-text'].$post({ json });
            if (!response.ok) throw new Error("Échec de la réécriture du texte par l'IA");
            return await response.json();
        }
    });
};
