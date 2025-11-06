import React from "react";
import { useAuth } from "../../hook/useAuth";
import { dashboardConfig } from "../../constant/dashboardConfig";
import EventCard from "./EventCard";
function DashBoardOverview() {
  const { user } = useAuth();
  const role = user?.role;
  console.log(role.toUpperCase());
  const cards = dashboardConfig[role.toUpperCase()];
  console.log(cards);
  return (
    <div className="space-y-4 text-black w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full justify-between gap-3 md:gap-8">
        {cards.map((card, index) => (
          <EventCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}

export default DashBoardOverview;
