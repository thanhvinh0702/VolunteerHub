import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import Card from "../Card.jsx/Card";
import { FaLocationPin } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import UserCard from "../User/UserCard";
const dumpData = [
  {
    id: 1,
    name: "Bao Nguyen",
    email: "bao.nguyen@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=b",
    createdAt: "2025-11-01T08:12:34.000Z",
  },
  {
    id: 2,
    name: "Linh Tran",
    email: "linh.tran@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=linh_tran",
    createdAt: "2025-11-02T09:22:10.000Z",
  },
  {
    id: 3,
    name: "Minh Le",
    email: "minh.le@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=minh_le_03",
    createdAt: "2025-11-03T10:05:00.000Z",
  },
  {
    id: 4,
    name: "Ha Pham",
    email: "ha.pham@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ha_pham",
    createdAt: "2025-11-04T11:00:00.000Z",
  },
  {
    id: 5,
    name: "Quang Vu",
    email: "quang.vu@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=quang-vu-5",
    createdAt: "2025-11-05T12:30:00.000Z",
  },
  {
    id: 6,
    name: "Thao Nguyen",
    email: "thao.nguyen@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=thao_ng",
    createdAt: "2025-11-06T13:15:00.000Z",
  },
  {
    id: 7,
    name: "An Hoang",
    email: "an.hoang@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=an_hoang_7",
    createdAt: "2025-11-07T14:45:00.000Z",
  },
  {
    id: 8,
    name: "Nga Bui",
    email: "nga.bui@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=nga_bui",
    createdAt: "2025-11-08T15:20:00.000Z",
  },
  {
    id: 9,
    name: "Phong Do",
    email: "phong.do@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=phong_do",
    createdAt: "2025-11-09T16:45:00.000Z",
  },
  {
    id: 10,
    name: "Tuan Anh",
    email: "tuan.anh@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=tuan_anh",
    createdAt: "2025-11-10T17:30:00.000Z",
  },
  {
    id: 11,
    name: "Huyen Tran",
    email: "huyen.tran@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=huyen_tran",
    createdAt: "2025-11-11T09:05:00.000Z",
  },
  {
    id: 12,
    name: "Nam Pham",
    email: "nam.pham@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=nam_pham",
    createdAt: "2025-11-11T10:10:00.000Z",
  },
  {
    id: 13,
    name: "Khanh Le",
    email: "khanh.le@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=khanh_le",
    createdAt: "2025-11-11T11:20:00.000Z",
  },
  {
    id: 14,
    name: "Vy Nguyen",
    email: "vy.nguyen@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=vy_nguyen",
    createdAt: "2025-11-11T12:00:00.000Z",
  },
  {
    id: 15,
    name: "Long Ho",
    email: "long.ho@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=long_ho",
    createdAt: "2025-11-11T13:15:00.000Z",
  },
  {
    id: 16,
    name: "Trang Dang",
    email: "trang.dang@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=trang_dang",
    createdAt: "2025-11-11T14:10:00.000Z",
  },
  {
    id: 17,
    name: "Dat Vo",
    email: "dat.vo@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dat_vo",
    createdAt: "2025-11-11T15:00:00.000Z",
  },
  {
    id: 18,
    name: "Huong Bui",
    email: "huong.bui@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=huong_bui",
    createdAt: "2025-11-11T15:45:00.000Z",
  },
  {
    id: 19,
    name: "Duc Tran",
    email: "duc.tran@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=duc_tran",
    createdAt: "2025-11-11T16:10:00.000Z",
  },
  {
    id: 20,
    name: "Anh Thu",
    email: "anh.thu@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=anh_thu",
    createdAt: "2025-11-11T17:00:00.000Z",
  },
];
function EventOverview({
  description,
  location,
  date,
  startTime,
  endTime,
  capacity,
  registered,
  availableSlots,
}) {
  const [showMore, setShowMore] = useState(true);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  return (
    <div className="p-4  flex gap-4 flex-col">
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3 justify-between">
        <div>
          <Card>
            <div>
              <div>
                <FiCalendar className="text-blue-500" />
              </div>
              <p>
                <span>{startTime}</span>
                <span>{endTime}</span>
              </p>
            </div>
          </Card>
        </div>
        <div>
          <Card>
            <div>
              <div>
                <FaLocationPin className="text-yellow-400" />
              </div>
              <p>
                <span>{startTime}</span>
                <span>{endTime}</span>
              </p>
            </div>
          </Card>
        </div>
        <div>
          <Card>
            <div>
              <div>
                <BsFillPeopleFill />
              </div>
              <p>
                <span>{startTime}</span>
                <span>{endTime}</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
      <div className="flex flex-col gap-5 border-1 border-gray-300 p-4 rounded-2xl duration-300 scroll-smooth">
        <p className={`whitespace-pre-line ${showMore ? "line-clamp-10" : ""}`}>
          {description}
        </p>
        <span onClick={toggleShowMore} className="text-blue-500">
          {showMore ? "Show more ↓" : "Show less ↑"}
        </span>
      </div>
      <div>
        <Card>
          <div className="flex flex-col gap-5 max-sm:gap-2">
            <div>
              <p className="font-semibold">Other Volunteer</p>
              <p className="text-gray-600 text-sm">
                See who else is participating
              </p>
            </div>
            <div className="flex flex-col gap-1 md:gap-4">
              {dumpData.slice(0, 5).map((item) => (
                <UserCard key={item.id} {...item} />
              ))}
            </div>
            <p className="font-light text-xs mt-2">More volunteers</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default EventOverview;
