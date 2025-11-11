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
          <FeedPage />
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
