import React from "react";
import TrendingCardHorizontal from "./TrendingCardHorizontal";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, FlameKindling } from "lucide-react";

const dumpData = [
  {
    name: "Event 1",
    date: "2024-07-01",
    location: "Location A",
    thumbnail: "",
    post: "50",
    comment: "10",
  },
  {
    name: "Event 1",
    date: "2024-07-01",
    location: "Location A",
    thumbnail: "",
    post: "50",
    comment: "10",
  },
  {
    name: "Event 1",
    date: "2024-07-01",
    location: "Location A",
    thumbnail: "",
    post: "50",
    comment: "10",
  },
  {
    name: "Event 1",
    date: "2024-07-01",
    location: "Location A",
    thumbnail: "",
    post: "50",
    comment: "10",
  },
  {
    name: "Event 1",
    date: "2024-07-01",
    location: "Location A",
    thumbnail: "",
    post: "50",
    comment: "10",
  },
  {
    name: "Event 1",
    date: "2024-07-01",
    location: "Location A",
    thumbnail: "",
    post: "50",
    comment: "10",
  },
  {
    name: "Event 1",
    date: "2024-07-01",
    location: "Location A",
    thumbnail: "",
    post: "50",
    comment: "10",
  },
  {
    name: "Event 1",
    date: "2024-07-01",
    location: "Location A",
    thumbnail: "",
    post: "50",
    comment: "10",
  },
  {
    name: "Event 1",
    date: "2024-07-01",
    location: "Location A",
    thumbnail: "",
    post: "50",
    comment: "10",
  },
];

export default function TrendingCardList({ data }) {
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
  }, []);

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

  return (
    <div className="w-full shadow-sm mt-5 mb-5 rounded-2xl px-4 pt-3 pb-4">
      <div className="font-jost flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-2xl font-bold text-gray-800 mb-6">
        <div className="flex flex-row gap-2 items-center">
          <span className="text-xl sm:text-xl">Trending Events</span>
          <div className="text-red-400 bg-orange-200 rounded-2xl p-1">
            <FlameKindling className="animate-pulse" />
          </div>
        </div>
        <div className="text-xs sm:text-sm cursor-pointer bg-gradient-to-r from-purple-500 to-blue-400 text-white px-3 py-1.5 rounded-2xl hover:scale-105 active:scale-95 duration-200 transition-all whitespace-nowrap">
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
          {dumpData.map((item, index) => (
            <TrendingCardHorizontal
              key={index}
              ref={index === 0 ? cardRef : null}
              {...item}
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
