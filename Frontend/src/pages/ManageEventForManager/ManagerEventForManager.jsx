import React from "react";
import ManagerDbHero from "../../components/ManageEventDb/ManagerDbHero";
import Tabs from "../../components/Tabs.jsx/Tabs";
import { Outlet } from "react-router-dom"; // Thêm import này

const dump = {
  id: 2,
  thumbnail:
    "https://th.bing.com/th/id/OIP.OJfse3bK8mEdtSh5qt9s5wHaE7?w=237&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
  title: "Chiến dịch Marketing Mùa Đông ",
  subtitle:
    "Kế hoạch triển khai quảng cáo đa kênh và dự trù ngân sách quảng cáo.",
  date: "2023-11-01",
};

function ManagerEventForManager() {
  const { thumbnail, title, subtitle, date } = dump;

  // Đổi thành relative paths (không có leading slash)
  const headerItems = [
    { key: "overview", label: "Overview", to: "overview" },
    {
      key: "manage-volunteers",
      label: "Manage Volunteers",
      to: "manage-volunteers",
    },
    {
      key: "verify-registration",
      label: "Verify Registration",
      to: "verify-registration",
    },
    {
      key: "mark-completion",
      label: "Mark Completion",
      to: "mark-completion",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <ManagerDbHero
          thumbnail={thumbnail}
          title={title}
          subtitle={subtitle}
          date={date}
        />
      </div>
      <div>
        <Tabs items={headerItems} variant="header" asLink />
      </div>

      {/* Thay các div rỗng bằng Outlet để hiển thị nội dung theo tab */}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}

export default ManagerEventForManager;
