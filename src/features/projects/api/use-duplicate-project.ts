import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.projects[':id']["duplicate"]['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.projects[":id"]["duplicate"]['$post']>['param'];

export const useDuplicateProject =  () => {
    const queryClient = useQueryClient();
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (param) => {
            const response = await client.api.projects[":id"]["duplicate"].$post({
                param,
            });

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: () => {
            toast.error(`Failed to duplicate project`);
        }
    });
}