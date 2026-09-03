import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";

export const useGetImages = () => {
    return useQuery({
        queryKey: ['images'],
        queryFn: async () => {
            const res = await client.api.images.$get();

            if (!res.ok) throw new Error(`Failed to fetch images: ${res.statusText}`);

            const {data} = await res.json();

            return data;
        }
    });
}
