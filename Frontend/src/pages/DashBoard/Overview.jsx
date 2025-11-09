import React from "react";
import DashBoardOverview from "../../components/Dashboard/DashBoardOverview";
import QuickActionsUser from "../../components/QuickActionButton/QuickActionsUser";
import UpcomingEvents from "../../components/ModalActivity/UpcomingEvents";
import RecentActivity from "../../components/ModalActivity/RecentActivity";

export default function Overview() {
  return (
    <div className="flex flex-col gap-10">
      <DashBoardOverview />
      <QuickActionsUser />
      <div className="grid grid-cols-2 gap-10 max-lg:block">
        <UpcomingEvents className="basis-1/2" />
        <RecentActivity className="basis-1/2" />
      </div>
    </div>
  );
}
