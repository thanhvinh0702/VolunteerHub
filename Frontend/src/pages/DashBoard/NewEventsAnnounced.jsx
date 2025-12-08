import React from "react";
import ModalActivity from "../../components/ModalActivity/ModalActivity";
import AnnouncedEventCard from "../../components/Dashboard/AnnouncedEventCard";
import { useApprovedEventsTop2ByName } from "../../hook/useEvent";

function NewEventsAnnounced({ className }) {
  const { data, isLoading, isError } = useApprovedEventsTop2ByName();

  const raw = data;
  const items = Array.isArray(raw) ? raw : raw?.data ?? raw?.content ?? [];

  const normalizeImageUrl = (url) => {
    if (typeof url !== "string") return undefined;
    return url.replace(/`/g, "").trim();
  };

  const formatLocation = (address) => {
    if (!address) return "";
    const parts = [address.street, address.district, address.province].filter(
      Boolean
    );
    return parts.join(", ");
  };

  const cards = items.slice(0, 2).map((event) => ({
    title: event?.name || "Untitled Event",
    date: event?.startTime || null,
    starttime: event?.startTime || null,
    endtime: event?.endTime || null,
    location: formatLocation(event?.address) || event?.location || "",
    joined:
      typeof event?.participantCount === "number"
        ? event.participantCount
        : typeof event?.registrationCount === "number"
        ? event.registrationCount
        : 0,
    capacity: typeof event?.capacity === "number" ? event.capacity : 0,
    urlImg: normalizeImageUrl(event?.imageUrl),
  }));

  return (
    <div className={className}>
      <ModalActivity title="New Events Announced" subtile="Recently Announced">
        {isLoading && (
          <>
            <AnnouncedEventCard
              title="Loading..."
              date={null}
              starttime={null}
              endtime={null}
              location=""
              joined={0}
              capacity={0}
            />
            <AnnouncedEventCard
              title="Loading..."
              date={null}
              starttime={null}
              endtime={null}
              location=""
              joined={0}
              capacity={0}
            />
          </>
        )}
        {isError && (
          <div className="text-sm text-red-500">
            Failed to load new announcements.
          </div>
        )}
        {!isLoading && !isError && cards.length === 0 && (
          <div className="text-sm text-gray-500">No new announcements.</div>
        )}
        {!isLoading &&
          !isError &&
          cards.length > 0 &&
          cards.map((card, idx) => (
            <AnnouncedEventCard key={`${card.title}-${idx}`} {...card} />
          ))}
      </ModalActivity>
    </div>
  );
}

export default NewEventsAnnounced;
