import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfileCompleteness, getUserInfo, updateUserInfo } from "../services/userService";

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

export const useProfileCompleteness = () => {
    return useQuery({
        queryKey: ["profileCompleteness"],
        queryFn: getProfileCompleteness,
        refetchOnWindowFocus: false,
    });
};