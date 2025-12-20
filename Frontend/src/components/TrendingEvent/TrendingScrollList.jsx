import React from "react";
import TrendingCardHorizontal from "./TrendingCardHorizontal";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, FlameKindling } from "lucide-react";
import { useTopTrendingEvents } from "../../hook/useEvent";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../utils/date";

export default function TrendingCardList() {
  const navigate = useNavigate();
  const { data, isLoading } = useTopTrendingEvents({
    days: 30,
    pageSize: 5,
  });
  const scrollRef = useRef(null);
  const cardRef = useRef(null);

  const [cardWidth, setCardWidth] = useState(0);

  // Auto calc width of card
  useEffect(() => {
    if (cardRef.current) {
      const styles = window.getComputedStyle(cardRef.current);
      const marginRight = parseInt(styles.marginRight);

      setCardWidth(cardRef.current.offsetWidth + marginRight);
    }
  }, [data]);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -cardWidth + 50,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: cardWidth - 50,
      behavior: "smooth",
    });
  };

  const trendingEvents = data?.data || [];

  const handleShowMore = () => {
    navigate("/trending");
  };

  // Don't render if loading or no data
  if (isLoading || trendingEvents.length === 0) {
    return null;
  }

  return (
    <div className="w-full shadow-sm mt-5 mb-5 rounded-2xl px-4 pt-3 pb-4">
      <div className="font-jost flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-2xl font-bold text-gray-800 mb-6">
        <div className="flex flex-row gap-2 items-center">
          <span className="text-xl sm:text-xl">Trending Events</span>
          <div className="text-red-400 bg-orange-200 rounded-2xl p-1">
            <FlameKindling className="animate-pulse" />
          </div>
        </div>
        <div
          onClick={handleShowMore}
          className="text-xs sm:text-sm cursor-pointer bg-gradient-to-r from-purple-500 to-blue-400 text-white px-3 py-1.5 rounded-2xl hover:scale-105 active:scale-95 duration-200 transition-all whitespace-nowrap"
        >
          Show more
        </div>
      </div>

      <div className="mb-2 relative flex items-center gap-2">
        {/* Left button */}
        <button
          onClick={scrollLeft}
          className="hidden sm:flex items-center justify-center flex-shrink-0 w-10 h-10 bg-white shadow-lg rounded-full hover:bg-gray-100 hover:shadow-xl transition-all duration-200 border border-gray-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth gap-3 md:gap-5 snap-x flex-1"
        >
          {trendingEvents.map((event, index) => (
            <TrendingCardHorizontal
              key={event.id}
              ref={index === 0 ? cardRef : null}
              id={event.id}
              name={event.name}
              location={
                event.address
                  ? `${event.address.district}, ${event.address.province}`
                  : "N/A"
              }
              date={formatDateTime(event.startTime, { withTime: false })}
              thumbnail={event.imageUrl}
              post={event.postGrowth || 0}
              comment={event.commentGrowth || 0}
            />
          ))}
        </div>

        {/* Right button */}
        <button
          onClick={scrollRight}
          className="hidden sm:flex items-center justify-center flex-shrink-0 w-10 h-10 bg-white shadow-lg rounded-full hover:bg-gray-100 hover:shadow-xl transition-all duration-200 border border-gray-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
