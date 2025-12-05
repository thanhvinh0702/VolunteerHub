import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { api } from "./apidump";
import EventHero from "../../components/EventPages/EventHero";
import EventOverview from "../../components/EventPages/EventOverview";
import Tabs from "../../components/Tabs.jsx/Tabs";
import RegistrationCard from "../../components/EventPages/RegistrationCard";
import OrganizationCard from "../../components/EventPages/OrganizationCard";
import FeedPage from "../Post/FeedPage";
import VolunteerList from "../../components/EventPages/VoluteerList";
import getUser from "./user";

export default function EventLayout() {
  const { id, tab } = useParams();
  const location = useLocation();
  const passedEventData = location.state?.eventData;

  // Get active tab from URL params, default to overview
  const activeTab = tab || "overview";

  console.log(id);
  console.log("Passed event data:", passedEventData);

  const [eventData, setEventData] = useState(passedEventData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(0);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    const fetchUserList = async () => {
      const data = await getUser(page, 5);

      if (data.length === 0) setEnd(true);
      else setUserList((prev) => [...prev, ...data]);
      console.log(userList);
    };
    fetchUserList();
  }, [page]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (passedEventData) {
        console.log("Using passed event data, skipping API call");
        return;
      }

      if (!id) return;

      try {
        setLoading(true);
        const data = await api.get(`/events/${id}`);
        setEventData(data);
        setError(null);
        console.log("Fetched from API:", data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Không thể tải thông tin sự kiện");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, passedEventData]);

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
      key: "discussion",
      label: "Discussion",
      to: `/opportunities/discussion/${id}`,
    },
    { key: "members", label: "Members", to: `/opportunities/members/${id}` },
  ];

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <EventOverview description={eventData.description} />;
      case "discussion":
        return <FeedPage />;
      case "members":
        return (
          <VolunteerList
            userList={userList}
            loading={loading}
            end={end}
            setPage={setPage}
          />
        );
      default:
        return <EventOverview description={eventData.description} />;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 max-sm:gap-0 bg-white rounded-lg shadow-sm overflow-hidden">
      <main className="col-span-8 max-sm:col-span-12 p-6 max-sm:p-0">
        <div className="flex flex-col w-full">
          <EventHero
            id={id}
            imgURL={eventData?.imageUrl}
            organizerName={eventData.name}
            eventName={eventData.name}
          />

          {/* tab links */}
          <div className="w-full border-b border-gray-300 mb-4">
            <Tabs
              items={headerItems}
              defaultKey={activeTab}
              asLink
              variant="header"
            />
          </div>

          {/* Dynamic content based on active tab */}
          {renderTabContent()}
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
