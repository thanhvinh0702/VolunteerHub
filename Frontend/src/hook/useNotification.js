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

// const handleMarkAsRead = (notificationId) => {
//     markAsReadMutation.mutate(notificationId, {
//       onSuccess: () => {
//         console.log("Đã đánh dấu đọc");
//       },
//       onError: (error) => {
//         alert("Không thể đánh dấu đã đọc");
//       },
//     });
//   };

//   // Handler đánh dấu tất cả đã đọc
//   const handleMarkAllAsRead = () => {
//     markAllAsReadMutation.mutate(undefined, {
//       onSuccess: () => {
//         console.log("Đã đánh dấu tất cả đã đọc");
//       },
//       onError: (error) => {
//         alert("Không thể đánh dấu tất cả đã đọc");
//       },
//     });
//   };

//   // Handler xóa notification
//   const handleDelete = (notificationId) => {
//     if (window.confirm("Bạn có chắc muốn xóa thông báo này?")) {
//       deleteNotificationMutation.mutate(notificationId, {
//         onSuccess: () => {
//           console.log("Đã xóa thông báo");
//         },
//         onError: (error) => {
//           alert("Không thể xóa thông báo");
//         },
//       });
//     }
//   };