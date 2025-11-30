import React from "react";
import QuickActionButton from "./QuickActionButton";
import { Search, Download, MessageSquare, User } from "lucide-react";

export default function QuickActionsUser() {
  const actions = [
    {
      id: "find",
      label: "Find Events",
      icon: Search,
      onClick: () => console.log("Tìm kiếm sự kiện..."),
      active: true,
    },
    {
      id: "download",
      label: "Download Report",
      icon: Download,
      onClick: () => console.log("Đang tải báo cáo..."),
      active: false,
    },
    {
      id: "message",
      label: "Messages",
      icon: MessageSquare,
      onClick: () => console.log("Mở tin nhắn..."),
      active: false,
    },
    {
      id: "profile",
      label: "Edit Profile",
      icon: User,
      onClick: () => console.log("Chỉnh sửa hồ sơ..."),
      active: false,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h4 className="text-2xl font-semibold mb-1">Quick Actions</h4>
      <p className="text-gray-500 text-sm mb-4">Common tasks and shortcuts</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <QuickActionButton key={action.id} {...action} />
        ))}
      </div>
    </div>
  );
}
