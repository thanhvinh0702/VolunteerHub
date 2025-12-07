import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import EventHero from "../../components/EventPages/EventHero";
import EventOverview from "../../components/EventPages/EventOverview";
import Tabs from "../../components/Tabs.jsx/Tabs";
import RegistrationCard from "../../components/EventPages/RegistrationCard";
import OrganizationCard from "../../components/EventPages/OrganizationCard";
import FeedPage from "../Post/FeedPage";
import VolunteerList from "../../components/EventPages/VoluteerList";
import getUser from "./user";
import { calculateDuration } from "../../utils/date";
import { useCheckUserParticipation } from "../../hook/useRegistration";
import { getEventById } from "../../services/eventService";
import { useAuth } from "../../hook/useAuth";

export default function EventLayout() {
  const { id, tab } = useParams();
  const location = useLocation();
  const passedEventData = location.state?.eventData;

  // Check user's participation status
  const { data: participationData, isLoading: isCheckingStatus } =
    useCheckUserParticipation(id);
  const userRegistrationStatus = participationData;
  console.log("User registration status:", userRegistrationStatus);
  const isApproved =
    userRegistrationStatus === "APPROVED" ||
    userRegistrationStatus === "COMPLETED";

  // Get active tab from URL params, default to overview
  const activeTab = tab || "overview";
  const { data } = localStorage.getItem("user");
  console.log("User data in EventLayout:", data);
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
        const data = await getEventById(id);
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
        return (
          <EventOverview
            description={eventData.description}
            location={
              eventData.address
                ? `${eventData.address.street}, ${eventData.address.district}, ${eventData.address.province}`
                : ""
            }
            startTime={eventData.startTime}
            endTime={eventData.endTime}
            capacity={eventData.capacity}
            registered={eventData.registrationCount}
            availableSlots={eventData.capacity - eventData.registrationCount}
          />
        );
      case "discussion":
        if (!isApproved) {
          return (
            <div className="p-8 text-center bg-gray-50 rounded-lg">
              <div className="text-gray-600 mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p className="text-lg font-semibold">Access Restricted</p>
                <p className="mt-2">
                  You must join the event and wait for approval to access
                  discussions.
                </p>
              </div>
            </div>
          );
        }
        return <FeedPage />;
      case "members":
        if (!isApproved) {
          return (
            <div className="p-8 text-center bg-gray-50 rounded-lg">
              <div className="text-gray-600 mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p className="text-lg font-semibold">Access Restricted</p>
                <p className="mt-2">
                  You must join the event and wait for approval to see the
                  volunteer list.
                </p>
              </div>
            </div>
          );
        }
        return (
          <VolunteerList
            userList={userList}
            loading={loading}
            end={end}
            setPage={setPage}
          />
        );
      default:
        return (
          <EventOverview
            description={eventData.description}
            location={
              eventData.address
                ? `${eventData.address.street}, ${eventData.address.district}, ${eventData.address.province}`
                : ""
            }
            startTime={eventData.startTime}
            endTime={eventData.endTime}
            capacity={eventData.capacity}
            registered={eventData.registrationCount}
            availableSlots={eventData.capacity - eventData.registrationCount}
          />
        );
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 max-sm:gap-0 bg-white rounded-lg shadow-sm overflow-hidden">
      <main className="col-span-8 max-sm:col-span-12 p-6 max-sm:p-0">
        <div className="flex flex-col w-full">
          <EventHero
            id={id}
            imgURL={eventData?.imageUrl}
            organizerName={eventData.owner?.username || "Unknown Organizer"}
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
          id={eventData?.id}
          duration={calculateDuration(eventData?.startTime, eventData?.endTime)}
          minAge={eventData?.minAge || ""}
          registrationDeadline={eventData?.registrationDeadline || ""}
          registrationStatus={eventData?.status || ""}
          durationCancel={eventData?.durationCancel || ""}
          registedVolunteer={eventData?.registrationCount || 0}
          totalSpots={eventData?.capacity || 10}
          userRegistrationStatus={userRegistrationStatus}
          isCheckingStatus={isCheckingStatus}
          onAction={() => {}}
        />
        <OrganizationCard data={passedEventData?.owner} />
        {/*<ContactCard />
        <RelatedEventsCard />*/}
      </aside>
    </div>
  );
}
