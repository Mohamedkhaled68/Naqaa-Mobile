import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetSubCategoriesForCate = (id: any) => {
    return useQuery({
        queryKey: ["subCategories", "getSubCategoriesforCate", id],
        queryFn: async () => {
            const response = await api.get(`/subcategories/category/${id}`);
            console.log(response.data.data);
            return response.data.data;
        },
        enabled: !!id, // Only run the query if id is provided
    });
};

export default useGetSubCategoriesForCate;
