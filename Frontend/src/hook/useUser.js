import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserInfo, updateUserInfo } from "../services/userService";

export const useProfile = () => {
    return useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserInfo,
    });
};

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUserInfo,
        onSuccess: () => {
            queryClient.invalidateQueries(["userProfile"]);
        },
    });
};
