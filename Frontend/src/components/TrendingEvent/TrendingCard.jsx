import React from "react";
import Card from "../Card.jsx/Card";
import { FaFire } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { Eye } from "lucide-react";
function TrendingCard({ items }) {
  const { title, category, trendPercentage, stats, isTrending } = items;
  return (
    <div className="bg-red-100/50 rounded-xl">
      <Card>
        <div className="flex flex-row gap-4 items-center justify-between ">
          <div className="p-3 bg-red-300/20 rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-7 h-7">
              <FaFire className="text-red-500 w-full h-full object-contain animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex flex-row justify-between items-start">
              <p className="text-sm font-semibold md:text-base">{title}</p>
              <div className="bg-red-700 text-white px-2 py-1 rounded-sm flex items-center gap-1 text-xs md:text-sm whitespace-normal">
                <FaArrowTrendUp />
                <span>+{trendPercentage}%</span>
              </div>
            </div>
            <div className="text-xs md:text-sm text-gray-600">{category}</div>
            <div className="grid grid-cols-2 gap-0 md:grid-cols-4 text-sm md:text-base mt-0">
              <div className="text-gray-600">
                <p>Member</p>
                <p className="text-black font-medium">
                  {stats.members.current}/{stats.members.capacity}
                </p>
              </div>
              <div className="text-gray-600">
                <p className="">New Posts</p>
                <p className="text-black font-medium">{stats.newPosts}</p>
              </div>
              <div className="text-gray-600">
                <p className="">Likes</p>
                <p className="text-black font-medium">{stats.likes}</p>
              </div>
              <div className="text-gray-600 ">
                <p className="">Comments</p>
                <p className="text-black font-medium">{stats.comments}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border-black/20 p-2 bg-white md:ml-10">
            <Eye className="w-5 h-5 hover:text-gray-400" />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default TrendingCard;
