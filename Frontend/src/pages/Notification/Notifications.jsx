import React, { useState } from "react";
import NotificationList from "./NotificationList";
import { notifications } from "./notificationData";

export default function Notifications() {
  const [data, setData] = useState(notifications);

  function loadMore() {
    const more = [...notifications].slice(0, 20);
    setTimeout(() => {
      setData((prev) => [...prev, ...more]);
    }, 1000);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm ">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold text-gray-900">Notifications</h3>
        <p className="text-gray-500">Manager all notifications.</p>
      </div>
      <div className="rounded-2xl sm:mt-5 sm:p-4 relative">
        <NotificationList items={data} loadMore={loadMore} />
      </div>
    </div>
  );
}
