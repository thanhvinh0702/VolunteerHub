import React from "react";
import ModalActivity from "./ModalActivity";
import UpComingCard from "./UpComingCard";
import { useUpcomingApprovedRegistrations } from "../../hook/useRegistration";
import Skeleton from "@mui/material/Skeleton";
import Card from "../Card.jsx/Card";
import { BellOff } from "lucide-react";

function UpcomingEvents() {
  const queryParams = { pageSize: 3, sortedBy: "date", order: "desc" };
  const { data, isLoading, isError, isFetching } =
    useUpcomingApprovedRegistrations(queryParams);

  React.useEffect(() => {
    console.log("[UpcomingEvents] query params:", queryParams);
    console.log("[UpcomingEvents] raw data:", data);
    console.log(
      "[UpcomingEvents] isLoading:",
      isLoading,
      "isError:",
      isError,
      "isFetching:",
      isFetching
    );
  }, [data, isLoading, isError, isFetching]);

  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
    ? data.content
    : Array.isArray(data?.data)
    ? data.data
    : [];

  console.log("[UpcomingEvents] items:", items);

  const cards = items
    .slice()
    .sort((a, b) => {
      const da = new Date(a?.event?.startTime || 0).getTime();
      const db = new Date(b?.event?.startTime || 0).getTime();
      return db - da; // desc
    })
    .slice(0, 3);

  console.log("[UpcomingEvents] cards:", cards);

  const SkeletonUpcomingCard = () => (
    <div>
      <Card>
        <div className="flex items-start gap-4 p-4">
          <div className="flex flex-col justify-between gap-2 flex-1">
            <Skeleton width="100%" height={28} />
            <Skeleton width={100} height={24} />
            <div className="flex flex-row gap-4">
              <Skeleton width={120} height={20} />
              <Skeleton width={80} height={20} />
            </div>
            <Skeleton width="90%" height={20} />
            <div className="flex gap-2 items-center">
              <Skeleton width={80} height={28} />
              <Skeleton width={20} height={20} />
            </div>
          </div>
          <Skeleton
            variant="rectangular"
            width={128}
            height={128}
            className="rounded-xl"
          />
        </div>
      </Card>
    </div>
  );

  return (
    <div className="h-full">
      <ModalActivity
        title="What's Coming Up"
        subtile="Approved and scheduled to happen soon"
        viewMore={true}
        path="/dashboard/opportunities"
      >
        {(isLoading || isFetching) && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonUpcomingCard key={i} />
            ))}
          </>
        )}
        {isError && (
          <div className="text-center py-8 flex flex-col gap-4 items-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <BellOff className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              Failed to load upcoming events.
            </p>
          </div>
        )}
        {!isLoading && !isFetching && !isError && cards.length === 0 && (
          <div className="text-center py-8 flex flex-col gap-4 items-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <BellOff className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No upcoming events.</p>
          </div>
        )}
        {!isLoading &&
          !isFetching &&
          !isError &&
          cards.map((reg) => {
            const ev = reg.event || {};
            const address = [
              ev.address?.street,
              ev.address?.district,
              ev.address?.province,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <UpComingCard
                key={`${reg.id}-${ev.id}`}
                eventId={ev.id}
                title={ev.name}
                subtile={ev.category?.name || ""}
                date={ev.startTime}
                starttime={ev.startTime}
                endtime={ev.endTime}
                location={address}
                status={reg.status || ev.status || "APPROVED"}
                urlImg={ev.imageUrl || undefined}
              />
            );
          })}
      </ModalActivity>
    </div>
  );
}

export default UpcomingEvents;
