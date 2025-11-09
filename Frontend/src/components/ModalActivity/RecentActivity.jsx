import React from "react";
import RecentActivityCard from "./RecentActivityCard";
import ModalActivity from "./ModalActivity";
const dumpActivity = [
  {
    id: 1,
    title: "Community Garden Cleanup",
    date: "2025-08-25",
    duration: "4h",
    status: "Verified",
    statusColor: "green",
    icon: "check",
  },
  {
    id: 2,
    title: "Youth Mentorship Session",
    date: "2025-08-20",
    duration: "3h",
    status: "Verified",
    statusColor: "green",
    icon: "check",
  },
  {
    id: 3,
    title: "Library Book Drive",
    date: "2025-08-15",
    duration: "2h",
    status: "Pending",
    statusColor: "yellow",
    icon: "clock",
  },
  {
    id: 4,
    title: "Animal Shelter Support",
    date: "2025-08-10",
    duration: "5h",
    status: "Verified",
    statusColor: "green",
    icon: "check",
  },
  {
    id: 5,
    title: "Beach Plastic Cleanup",
    date: "2025-07-28",
    duration: "6h",
    status: "Pending",
    statusColor: "yellow",
    icon: "clock",
  },
];

function RecentActivity() {
  return (
    <div>
      <ModalActivity title="Recent Activity" subtile="Recent Activity">
        {dumpActivity.slice(0, 3).map((item) => (
          <RecentActivityCard {...item} />
        ))}
      </ModalActivity>
    </div>
  );
}

export default RecentActivity;
