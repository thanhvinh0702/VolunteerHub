import React from "react";
import { formatDateTime } from "../../utils/date";
function ProjectCard() {
  const item = {
    id: 1,
    title: "Chiến dịch trồng 1000 cây xanh tại Công viên Thống Nhất",
    date: "2025-10-20T08:00:00.000Z",
    location: "Công viên Thống Nhất, Quận 10, TP. HCM",
    capacity: 100,
    registered: 73,
    availableSlots: 27,
    category: "Trồng cây",
    imageUrl:
      "https://vnn-imgs-f.vgcloud.vn/2021/03/31/08/nhom-thanh-nien-tinh-nguyen-luon-rung-treo-minh-tren-vach-nui-de-nhat-rac-1.jpg", // ảnh demo hoặc ảnh thật từ server
    ctaText: "Đăng ký ngay",
    status: "open",
  };

  const getPercentage = (registered, capacity) => {
    return (registered / capacity) * 100;
  };

  return (
    <div className="max-w-[320px] bg-white text-black mx-auto mt-20 flex flex-col gap-2 justify-center font-roboto rounded-2xl font-bold hover:shadow-slate-300  duration-300 ease-in-out">
      <div className="relative aspect-[16/9]">
        <img
          src={item.imageUrl}
          className="object-cover rounded-t-2xl h-full h-full"
        />
        <p className="absolute top-0 right-4 bg-blue-500/80 text-white mt-2 rounded-xl p-1 !text-[10px] text-center">
          {item.category}
        </p>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="text-xl max-sm:text-lg font-bold line-clamp-2">
          {item.title}
        </div>
        <div className="flex flex-row gap-2 items-center text-slate-500 ">
          <i className="ri-calendar-line"></i>
          <p className="font-normal text-sm">{formatDateTime(item.date)}</p>
        </div>
        <div className="flex flex-row gap-2 items-center text-slate-500">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              item.location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-row gap-2 items-center text-slate-500 hover:text-red-400 transition-colors"
          >
            <i class="ri-map-pin-fill"></i>
            <p className="font-normal text-sm">{item.location}</p>
          </a>
        </div>
        <div className="flex flex-row gap-2 items-center justify-between mb-2 text-slate-400 font-medium text-sm">
          <div className="flex flex-row gap-2 items-center justify-center">
            <i class="ri-user-3-line"></i>
            {item.registered}/{item.capacity}
          </div>
          <p>Avaiable {item.availableSlots}</p>
        </div>
        <div className="w-full bg-red-100 rounded-full h-3 mb-8">
          <div
            className="bg-red-400 h-3 rounded-full transition-all duration-300"
            style={{
              width: `${getPercentage(item.registered, item.capacity)}%`,
            }}
          ></div>
        </div>

        <div className="w-full">
          <button className="w-full bg-red-500/80 text-white rounded-xl py-2 font-bold text-sm hover:bg-red-500/90 transition-all duration-300 ease-in-out hover:scale-105 font-lobster tracking-widest border-none">
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
