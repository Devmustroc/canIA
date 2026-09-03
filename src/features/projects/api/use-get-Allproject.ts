import { useInfiniteQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";

export type ResponseType = InferResponseType<typeof client.api.projects['$get'], 200>;

export const useGetAllProjects = () => {
    return useInfiniteQuery<ResponseType, Error>({
        initialPageParam: 1,
        queryKey: ['projects'],
        queryFn: async ({ pageParam }) => {
            const res = await client.api.projects.$get({
                query: {
                    page: (pageParam as number).toString(),
                    limit: "10"
                }
            });

            if (!res.ok) throw new Error(`Failed to fetch projects`);

            return  res.json();

        },
        getNextPageParam: (lastPage, allPages) => {
            // Implement logic to determine the nextPage parameter based on `lastPage` or `allPages`
            // For example, if `lastPage` contains a `nextPage` property indicating the next page number
            return lastPage.nextPage;
        }
    });
}