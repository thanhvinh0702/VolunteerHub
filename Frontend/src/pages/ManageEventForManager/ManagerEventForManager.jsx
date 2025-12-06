import React from "react";
import ManagerDbHero from "../../components/ManageEventDb/ManagerDbHero";
import Tabs from "../../components/Tabs.jsx/Tabs";
import { Outlet, useParams } from "react-router-dom";
import { useEventDetail } from "../../hook/useEvent";

function ManagerEventForManager() {
  const { id } = useParams();

  // Fetch event data once at parent level
  const { data: eventData, isLoading, error } = useEventDetail(id);

  // Đổi thành relative paths (không có leading slash)
  const headerItems = [
    { key: "overview", label: "Overview", to: "overview" },
    {
      key: "manage-volunteers",
      label: "Manage Volunteers",
      to: "manage-volunteers",
    },
    {
      key: "verify-registration",
      label: "Verify Registration",
      to: "verify-registration",
    },
    {
      key: "mark-completion",
      label: "Mark Completion",
      to: "mark-completion",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading event: {error.message}</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }
  console.log("Event Data in ManagerEventForManager:", eventData);
  return (
    <div className="flex flex-col gap-5">
      <div>
        <ManagerDbHero
          thumbnail={eventData.imageUrl}
          title={eventData.name}
          subtitle={eventData.description}
          status={eventData.status}
          date={eventData.startTime}
        />
      </div>
      <div>
        <Tabs items={headerItems} variant="header" asLink />
      </div>

      {/* Pass eventData to child routes via context */}
      <div className="mt-4">
        <Outlet context={{ eventId: id, eventData }} />
      </div>
    </div>
  );
}

export default ManagerEventForManager;
