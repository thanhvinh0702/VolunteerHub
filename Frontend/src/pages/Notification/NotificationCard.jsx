import React from "react";

function NotificationCard({ noti }) {
  return (
    <div
      className={`w-full px-4 py-5 max-sm:py-2  rounded-xl mb-4 border-gray-200 border shadow-sm transition-all duration-300 hover:bg-gray-200 ${
        noti?.unread ? "bg-blue-200/50" : "bg-white"
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full animate-bounce ${
              noti?.unread ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium">{noti?.title}</div>
            <div className="text-sm text-gray-500">{noti?.content}</div>
          </div>
        </div>
        <div className="text-sm text-gray-500">{noti.time}</div>
      </div>
    </div>
  );
}

export default NotificationCard;
