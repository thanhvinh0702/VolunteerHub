import React, { useState } from "react";
import NotificationList from "./NotificationList";
import { notifications } from "./notificationData";
import DropdownSelect from "../../components/Dropdown/DropdownSelect";
import { Mail } from "lucide-react";

export default function Notifications() {
  const [data, setData] = useState(notifications);
  const [status, setStatus] = useState("all");
  function loadMore() {
    const more = [...notifications].slice(0, 20);
    setTimeout(() => {
      setData((prev) => [...prev, ...more]);
    }, 1000);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex flex-row justify-between items-center mb-6 relative">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold text-gray-900 inline-flex items-center gap-2">
            <span className="text-blue-600">
              <Mail />
            </span>
            <span>Notifications </span>
          </h3>
          <p className="text-gray-500">Manager all notifications.</p>
        </div>

        <div className="flex flex-row items-center gap-2 right-0 bottom-0 absolute max-sm:mr-2 mr-8">
          <p>Status: </p>
          <DropdownSelect
            options={[
              { value: "all", label: "All" },
              { value: "unread", label: "Unread" },
              { value: "read", label: "Read" },
            ]}
            onChange={setStatus}
            value={status}
          />
        </div>
      </div>

      <div className="rounded-2xl sm:mt-5 sm:p-4 relative">
        <NotificationList items={data} loadMore={loadMore} />
      </div>
    </div>
  );
}
