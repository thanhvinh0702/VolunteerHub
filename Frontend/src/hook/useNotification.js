import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markAllAsRead, markAsRead } from "../services/notificationService";

const NOTIFICATION_KEY = ['notifications']

export const useNotification = () => {
    return useQuery({
        queryKey: NOTIFICATION_KEY,
        queryFn: fetchNotifications,
        staleTime: 1000 * 60 * 5
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: markAsRead,
        onSuccess: (data, notificationId) => {
            queryClient.setQueryData(NOTIFICATION_KEY, (oldData) => {
                if (!oldData) return oldData;
                return oldData.map((notification) => {
                    notification.id === notificationId ? { ...notification, isRead: true } : notification
                });
            });
        },
    });
};

export const useMarkAllRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: markAllAsRead,

        onSuccess: () => {
            queryClient.setQueryData(NOTIFICATION_KEY, (oldData) => {
                if (!oldData) return oldData;
                return oldData.map((notification) => {
                    return { ...notification, isRead: true };
                });
            });
        },
    });
};
