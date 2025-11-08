import React from "react";
import ModalActivity from "./ModalActivity";
import UpComingCard from "./UpComingCard";
const dump = {
  title: "Beach Cleanup Drive",
  subtitle: "Ocean Care Foundation",
  date: "2025-09-15T00:00:00.000Z",
  starttime: "2025-09-15T08:00:00.000Z",
  endtime: "2025-09-15T12:00:00.000Z",
  location: "Sunset Beach",
  status: "confirmed",
};

function UpcomingEvents() {
  return (
    <div>
      <ModalActivity title="Upcoming Events" subtile="Upcoming Events">
        <UpComingCard {...dump} />
        <UpComingCard {...dump} />
      </ModalActivity>
    </div>
  );
}

export default UpcomingEvents;
