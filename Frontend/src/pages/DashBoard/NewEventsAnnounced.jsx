import React from "react";
import ModalActivity from "../../components/ModalActivity/ModalActivity";
import UpComingCard from "../../components/ModalActivity/UpComingCard";
import AnnouncedEventCard from "../../components/Dashboard/AnnouncedEventCard";

const newEventsData = {
  title: "New Volunteer Opportunity",
  subtitle: "Community Center",
  date: "2025-10-01T00:00:00.000Z",
  starttime: "2025-10-01T09:00:00.000Z",
  endtime: "2025-10-01T17:00:00.000Z",
  location: "Downtown Community Center",
  status: "announced",
};

function NewEventsAnnounced({ className }) {
  return (
    <div className={className}>
      <ModalActivity title="New Events Announced" subtile="Recently Announced">
        <AnnouncedEventCard {...newEventsData} />
        <AnnouncedEventCard {...newEventsData} />
      </ModalActivity>
    </div>
  );
}

export default NewEventsAnnounced;
