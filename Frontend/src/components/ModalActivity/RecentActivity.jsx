import React from "react";
import RecentActivityCard from "./RecentActivityCard";
import ModalActivity from "./ModalActivity";
import { useRecentPendingRegistrations } from "../../hook/useRegistration";
import Skeleton from "@mui/material/Skeleton";
import Card from "../Card.jsx/Card";

function RecentActivity() {
  const queryParams = {
    pageSize: 3,
    sortedBy: "date",
    order: "desc",
    status: "PENDING",
  };
  const { data, isLoading, isError, isFetching } =
    useRecentPendingRegistrations(queryParams);

  console.log("[RecentActivity] data:", data);

  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
    ? data.content
    : Array.isArray(data?.data)
    ? data.data
    : [];

  console.log("[RecentActivity] items:", items);

  const cards = items
    .slice()
    .sort((a, b) => {
      const da = new Date(a?.event?.startTime || 0).getTime();
      const db = new Date(b?.event?.startTime || 0).getTime();
      return db - da; // desc
    })
    .slice(0, 3)
    .map((reg, idx) => {
      const ev = reg.event || {};
      const start = ev.startTime ? new Date(ev.startTime) : null;
      const end = ev.endTime ? new Date(ev.endTime) : null;
      let durationText = "";
      if (start && end && end > start) {
        const diffMs = end.getTime() - start.getTime();
        const diffHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
        durationText = `${diffHours}h`;
      }
      const dateText = ev.startTime ? ev.startTime.slice(0, 10) : "";

      return {
        id: reg.id ?? ev.id ?? idx,
        title: ev.name || "Untitled",
        date: dateText,
        duration: durationText,
        status: (reg.status || "PENDING").toUpperCase(),
      };
    });

  console.log("[RecentActivity] cards:", cards);

  const SkeletonRecentActivityCard = () => (
    <div className="text-gray-600 max-md:text-sm">
      <Card>
        <div className="flex flex-col justify-between relative px-4 py-0 gap-2">
          <Skeleton width={200} height={24} />
          <div className="flex flex-row gap-5">
            <Skeleton width={120} height={20} />
            <Skeleton width={80} height={20} />
          </div>
          <div className="flex gap-3 items-center">
            <Skeleton width={80} height={24} />
            <Skeleton width={20} height={20} />
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="h-full">
      <ModalActivity title="Recent Activity" subtile="Recent Activity">
        {(isLoading || isFetching) && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonRecentActivityCard key={i} />
            ))}
          </>
        )}
        {isError && (
          <p className="px-4 py-2 text-red-500">No recent activity.</p>
        )}
        {!isLoading && !isFetching && !isError && cards.length === 0 && (
          <p className="px-4 py-2 text-gray-500">No pending activities.</p>
        )}
        {!isLoading && !isFetching && !isError &&
          cards.map((item) => <RecentActivityCard key={item.id} {...item} />)}
      </ModalActivity>
    </div>
  );
}

export default RecentActivity;
