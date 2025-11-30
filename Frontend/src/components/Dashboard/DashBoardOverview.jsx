// src/components/Dashboard/DashBoardOverview.jsx
import React from "react";

// Import các Hooks
import { useAuth } from "../../hook/useAuth";
import { useDashboardStats } from "../../hook/useDashboardStats";

// Import các Components giao diện
import EventCard from "./EventCard";
import EventCardSkeleton from "../Skeleton/EventCardSkeleton";
import EventCardError from "./EventCardError";

function DashBoardOverview() {
  // 1. Lấy Role của user hiện tại
  const { user } = useAuth();
  // Luôn đảm bảo role viết hoa và có giá trị mặc định để tránh lỗi crash
  const role = user?.role?.toUpperCase() || "USER";

  // 2. Gọi Hook lấy dữ liệu
  // Hook này trả về mảng các card đã được merge đầy đủ thông tin:
  // { label, icon, value, isLoading, isError, refetch, ... }
  const cardDataList = useDashboardStats(role);

  return (
    <div className="space-y-4 text-black w-full">
      {/* Grid Layout: Mobile 1 cột, Tablet 2 cột, PC 4 cột */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full justify-between gap-3 md:gap-8">
        {cardDataList.map((card, index) => {
          if (card.isLoading) {
            return <EventCardSkeleton key={`skeleton-${index}`} />;
          }

          if (card.isError) {
            return (
              <EventCardError
                key={`error-${index}`}
                message="Không tải được dữ liệu"
                onRetry={() => card.refetch()}
              />
            );
          }

          // Hiển thị Card với dữ liệu thật
          return <EventCard key={card.id || index} {...card} />;
        })}
      </div>
    </div>
  );
}

export default DashBoardOverview;
