{
  /*<p className="text-gray-600 mb-2">
        <strong>Location:</strong>{" "}
        {eventData.location ||
          `${eventData.address?.street}, ${eventData.address?.province}, ${eventData.address?.city}`}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Time:</strong>{" "}
        {new Date(eventData.date || eventData.startTime).toLocaleString(
          "vi-VN"
        )}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Danh mục:</strong>{" "}
        {eventData.category || eventData.category?.name}
      </p>
      {eventData.description && <p className="mt-4">{eventData.description}</p>}*/
}

import { useEffect, useState } from "react";
import { Outlet, Link, useParams } from "react-router-dom";
import { api } from "./apidump";
import EventHero from "../../components/EventPages/EventHero";
import EventInfoRow from "../../components/EventPages/EventInfoRow";
import EventOverview from "../../components/EventPages/EventOverview";
import Tabs from "../../components/Tabs.jsx/Tabs";
import RegistrationCard from "../../components/EventPages/RegistrationCard";
import OrganizationCard from "../../components/EventPages/OrganizationCard";
import FeedPage from "../Post/FeedPage";
import VolunteerHero from "../../components/EventPages/VolunteerHero";
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
export default function EventLayout() {
  const { id } = useParams();
  console.log(id);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.get(`/events/${id}`);
        setEventData(data);
        setError(null);
        console.log(data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Không thể tải thông tin sự kiện");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);
  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  if (error || !eventData) {
    return (
      <div className="p-5 text-red-500">
        {error || "Không tìm thấy sự kiện"}
      </div>
    );
  }

  const headerItems = [
    { key: "overview", label: "Overview", to: `/opportunities/overview/${id}` },
    {
      key: "discusion",
      label: "Discusion",
      to: `/opportunities/discussion/${id}`,
    },
    { key: "member", label: "Member", to: "/opportunities/members" },
  ];

  return (
    <div className="grid grid-cols-12 gap-6 max-sm:gap-0 bg-white rounded-lg shadow-sm overflow-hidden">
      <main className="col-span-8 max-sm:col-span-12 p-6 max-sm:p-0">
        <div className="flex flex-col w-full">
          <EventHero
            id={id}
            imgURL={eventData?.imageUrl}
            organizerName={eventData.title}
            eventName={eventData.title}
          />

          {/* tab links */}
          <div className="w-full border-b border-gray-300 mb-4">
            <Tabs items={headerItems} asLink variant="header" />
          </div>

          {/*<EventOverview description={eventData.description} />*/}
          <VolunteerHero userList={dumpData} />
        </div>
      </main>

      <aside className="col-span-4 max-sm:hidden p-6 bg-gray-50 flex flex-col gap-4">
        <RegistrationCard
          duration={eventData?.duration}
          minAge={eventData?.minAge}
          registrationDeadline={eventData?.registrationDeadline}
          registrationStatus={eventData?.registrationStatus}
          durationCancel={eventData?.durationCancel}
          onAction={() => {}}
        />
        <OrganizationCard />
        {/*<ContactCard />
        <RelatedEventsCard />*/}
      </aside>
    </div>
  );
}
