import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {InferResponseType} from "hono";

export type ResponseType = InferResponseType<typeof client.api.projects[":id"]['$get'], 200>;

export const useGetProject = (id: string) => {
    return useQuery({
        enabled: !!id,
        queryKey: ['project',  { id }],
        queryFn: async () => {
            const res = await client.api.projects[":id"].$get({
                param: { id }
            });

            if (!res.ok) throw new Error(`Failed to fetch projects`);

            const {data} = await res.json();

            return data;
        }
    });
}
