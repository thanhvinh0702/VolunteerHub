import React from "react";
import {
  Bell,
  Calendar,
  Check,
  CheckLine,
  Tag,
  Trash,
  View,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useMarkAsRead,
  useDeleteNotification,
} from "../../hook/useNotification";
import {
  confirmDelete,
  showSuccess,
  showError,
} from "../../utils/confirmDialog";

function NotificationCard({ noti }) {
  console.log("Rendering NotificationCard for:", noti);

  const markAsReadMutation = useMarkAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  // Format time from array [year, month, day, hour, minute]
  const formatTime = (timeArray) => {
    if (!timeArray || !Array.isArray(timeArray)) return "";
    const [year, month, day, hour, minute] = timeArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsReadMutation.mutateAsync(id);
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
      console.error("Error marking as read:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete(
      "this notification",
      "This action cannot be undone."
    );

    if (result.isConfirmed) {
      try {
        await deleteNotificationMutation.mutateAsync(id);
        showSuccess("Deleted!", "Notification has been deleted successfully.");
      } catch (error) {
        showError("Error!", "Failed to delete notification. Please try again.");
        console.error("Error deleting notification:", error);
      }
    }
  };

  // Format created at timestamp
  const formatCreatedAt = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate notification message based on type and payload
  const getNotificationMessage = () => {
    const { type, payload } = noti;

    switch (type) {
      case "EVENT_REQUESTED":
        return {
          title: "New Event Request",
          content: `"${payload?.name}" in ${payload?.category} category`,
          detail: `${formatTime(payload?.start_time)} - ${formatTime(
            payload?.end_time
          )}`,
        };
      case "EVENT_APPROVED":
        return {
          title: "Event Approved",
          content: `Your event "${payload?.name}" has been approved`,
          detail: null,
        };
      case "EVENT_REJECTED":
        return {
          title: "Event Rejected",
          content: `Your event "${payload?.name}" was rejected`,
          detail: null,
        };
      default:
        return {
          title: type || "Notification",
          content: payload?.name || "You have a new notification",
          detail: null,
        };
    }
  };

  const message = getNotificationMessage();
  console.log("Notification message:", message);

  return (
    <div
      className={`w-full px-4 py-5 max-sm:py-2 rounded-xl mb-4 border-gray-200 border shadow-sm transition-all duration-300 hover:bg-gray-200 cursor-pointer ${
        !noti?.isRead ? "bg-blue-50" : "bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            !noti?.isRead ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <Bell className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Badge */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900">
              {message.title}
            </h4>
            {!noti?.isRead && (
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            )}
          </div>

          {/* Content */}
          <p className="text-sm text-gray-600 mb-2">{message.content}</p>

          {/* Detail */}
          {message.detail && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <Calendar className="w-3 h-3" />
              <span>{message.detail}</span>
            </div>
          )}

          {/* Category */}
          {noti?.payload?.category && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <Tag className="w-3 h-3" />
              <span className="capitalize">{noti.payload.category}</span>
            </div>
          )}

          {/* Timestamp */}
          <p className="text-xs text-gray-400">
            {formatCreatedAt(noti?.createdAt)}
          </p>
        </div>
        {/* Actions */}
        <div className="flex flex-col items-start min-w-[80px]">
          <button
            onClick={() => handleMarkAsRead(noti?.id)}
            disabled={markAsReadMutation.isPending}
            className={`${
              noti?.isRead ? "hidden" : "text-white"
            } flex items-center gap-2 mb-2 bg-blue-400 hover:bg-blue-500 transition duration-300 border px-2 py-1 rounded-lg w-full disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="w-4">
              <Check />
            </span>
            <span>{markAsReadMutation.isPending ? "..." : "Mark read"}</span>
          </button>
          <button
            onClick={() => handleDelete(noti?.id)}
            disabled={deleteNotificationMutation.isPending}
            className="text-white bg-red-500 hover:bg-red-600 transition duration-300 flex items-center gap-2 border px-4 py-1 rounded-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>
              <Trash className="w-4" />
            </span>{" "}
            <span>
              {deleteNotificationMutation.isPending ? "..." : "Delete"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
