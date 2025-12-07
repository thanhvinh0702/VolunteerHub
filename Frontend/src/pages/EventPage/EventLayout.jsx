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
import { calculateDuration, formatDateTime } from "../../utils/date";
import {
  useCheckUserParticipation,
  useRegisterForEvent,
  useConstUserApprovedList,
} from "../../hook/useRegistration";
import { getEventById } from "../../services/eventService";
import { useAuth } from "../../hook/useAuth";

export default function EventLayout() {
  const { id, tab } = useParams();
  const location = useLocation();
  const passedEventData = location.state?.eventData;
  const { user } = useAuth();

  // Check user's participation status
  const { data: participationData, isLoading: isCheckingStatus } =
    useCheckUserParticipation(id);
  const userRegistrationStatus = participationData;
  console.log("User registration status:", userRegistrationStatus);

  // Check if user is approved OR has MANAGER/ADMIN role
  const isApproved =
    userRegistrationStatus === "APPROVED" ||
    userRegistrationStatus === "COMPLETED" ||
    user?.role === "MANAGER" ||
    user?.role === "ADMIN";

  const { mutate: registerForEvent, isLoading: isRegistering } =
    useRegisterForEvent();

  // Get active tab from URL params, default to overview
  const activeTab = tab || "overview";
  const { data } = localStorage.getItem("user");
  console.log("User data in EventLayout:", data);
  console.log(id);
  console.log("Passed event data:", passedEventData);

  const [eventData, setEventData] = useState(passedEventData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(5);

  // Fetch approved users for the event
  const { data: approvedUsers, isLoading: isLoadingUsers } =
    useConstUserApprovedList(id);
  const allUsers = approvedUsers || [];
  const displayedUsers = allUsers.slice(0, displayCount);
  const hasMoreUsers = allUsers.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 5);
  };

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

  const handleRegistration = () => {
    registerForEvent(id);
  };

  const getButtonConfig = () => {
    const now = new Date();
    const deadline = new Date(eventData.registrationDeadline);

    if (now > deadline) {
      return {
        text: "Registration Closed",
        className: "bg-gray-400 cursor-not-allowed",
        disabled: true,
      };
    }

    switch (userRegistrationStatus) {
      case "PENDING":
        return {
          text: "Pending Approval",
          className: "bg-yellow-500 hover:bg-yellow-600",
          disabled: true,
        };
      case "APPROVED":
        return {
          text: "✓ You're Participating",
          className: "bg-green-500 hover:bg-green-600",
          disabled: true,
        };
      case "COMPLETED":
        return {
          text: "✓ Event Completed",
          className: "bg-blue-500 hover:bg-blue-600",
          disabled: true,
        };
      case "REJECTED":
        return {
          text: "✗ Registration Rejected",
          className: "bg-red-500 hover:bg-red-600",
          disabled: true,
        };
      default:
        return {
          text: "Join",
          className: "bg-white hover:via-fuchsia-600 hover:to-pink-600",
          disabled: false,
        };
    }
  };

  const buttonConfig = getButtonConfig();

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
            userList={displayedUsers}
            loadMore={handleLoadMore}
            end={!hasMoreUsers}
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

          {/* Mobile Registration Status */}
          <div className="sm:hidden bg-white p-4 rounded-lg mb-4 px-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {calculateDuration(eventData?.startTime, eventData?.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {eventData?.registrationCount || 0}/
                  {eventData?.capacity || 10}
                </span>
              </div>
            </div>

            <div className="mb-3 text-xs text-gray-600">
              <div className="flex items-center gap-2 mb-1">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  Deadline: {formatDateTime(eventData?.registrationDeadline)}
                </span>
              </div>
              {eventData?.minAge && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Min Age: {eventData.minAge}+</span>
                </div>
              )}
            </div>

            <button
              onClick={handleRegistration}
              disabled={
                buttonConfig.disabled || isRegistering || isCheckingStatus
              }
              className={`w-full py-1 rounded-lg text-white font-semibold transition-all duration-200 ${buttonConfig.className}`}
            >
              {isCheckingStatus
                ? "Checking..."
                : isRegistering
                ? "Registering..."
                : buttonConfig.text}
            </button>
          </div>

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
