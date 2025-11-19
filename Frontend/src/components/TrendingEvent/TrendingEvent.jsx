import React from "react";
import { trendingEventsData } from "./dump";
import TrendingCard from "./TrendingCard";
import ModalActivity from "../ModalActivity/ModalActivity";
function TrendingEvent() {
  return (
    <div className="flex flex-col gap-5">
      <ModalActivity title="Trending Events" subtile="Trending Events">
        {trendingEventsData.map((item) => (
          <TrendingCard key={item.id} items={item} />
        ))}
      </ModalActivity>
    </div>
  );
}

export default TrendingEvent;
