import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetCategories = (search: string = "") => {
    return useQuery({
        queryKey: ["categories", "getCategories"],
        queryFn: async () => {
            const response = await api.get("/categories");
            return response.data.data;
        },

        // Optional: configure stale time, cache time, etc.
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export default useGetCategories;
