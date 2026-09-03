import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {InferRequestType, InferResponseType} from "hono";

type RequestType = InferRequestType<typeof client.api.projects.templates.$get>["query"]
export type ResponderType = InferResponseType<typeof client.api.projects.templates.$get, 200>

export const useGetTemplates = (apiQuery: RequestType) => {
    return useQuery({
        queryKey: ['templates', {
            page: apiQuery.page,
            limit: apiQuery.limit
        }],
        queryFn: async () => {
            const res = await client.api.projects.templates.$get({
                query: apiQuery
            });

            if (!res.ok) throw new Error(`Failed to fetch Templates`);

            const {data} = await res.json();

            return data;
        }
    });
}
