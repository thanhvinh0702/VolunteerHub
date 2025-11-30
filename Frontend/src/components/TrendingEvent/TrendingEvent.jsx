import React from "react";
import { trendingEventsData } from "./dump";
import TrendingCard from "./TrendingCard";
import ModalActivity from "../ModalActivity/ModalActivity";
import { ArrowRight } from "lucide-react";
function TrendingEvent() {
  return (
    <div className="flex flex-col gap-5">
      <ModalActivity title="Trending Events" subtile="Trending Events">
        {trendingEventsData.map((item) => (
          <TrendingCard key={item.id} items={item} />
        ))}
        <div className="flex flex-row items-center justify-end gap-1 cursor-pointer hover:text-blue-500 text-sm">
          <p>See more</p>
          <ArrowRight className="w-4 h-4" />
        </div>
      </ModalActivity>
    </div>
  );
}

export default TrendingEvent;
