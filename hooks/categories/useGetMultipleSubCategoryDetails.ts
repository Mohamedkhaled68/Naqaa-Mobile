import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetMultipleSubCategoryDetails = (subcategoryIds: string[]) => {
    return useQuery({
        queryKey: ["subCategories", "multiple", ...subcategoryIds.sort()],
        queryFn: async () => {
            if (subcategoryIds.length === 0) return [];

            // Fetch all subcategories in parallel
            const promises = subcategoryIds.map((id) =>
                api
                    .get(`/subcategories/${id}`)
                    .then((response) => response.data.data)
            );

            const results = await Promise.all(promises);
            console.log("Multiple subcategory details:", results);
            return results;
        },
        enabled: subcategoryIds.length > 0,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export default useGetMultipleSubCategoryDetails;
