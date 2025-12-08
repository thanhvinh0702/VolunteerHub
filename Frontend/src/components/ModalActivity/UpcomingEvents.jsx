import React from "react";
import ModalActivity from "./ModalActivity";
import UpComingCard from "./UpComingCard";
import { useUpcomingApprovedRegistrations } from "../../hook/useRegistration";
import Skeleton from "@mui/material/Skeleton";
import Card from "../Card.jsx/Card";

function UpcomingEvents() {
  const queryParams = { pageSize: 3, sortedBy: "date", order: "desc" };
  const { data, isLoading, isError, isFetching } = useUpcomingApprovedRegistrations(queryParams);

  React.useEffect(() => {
    console.log("[UpcomingEvents] query params:", queryParams);
    console.log("[UpcomingEvents] raw data:", data);
    console.log("[UpcomingEvents] isLoading:", isLoading, "isError:", isError, "isFetching:", isFetching);
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
        <div className="flex justify-between relative">
          <div className="text-md max-sm:text-sm flex flex-col gap-2 pl-5 flex-1">
            <Skeleton width={180} height={24} />
            <Skeleton width={100} height={20} />
            <div className="flex flex-row gap-5 max-sm:block text-gray-600">
              <div className="flex flex-1 gap-1 items-center">
                <Skeleton width={140} height={20} />
              </div>
              <div className="flex flex-1 items-center">
                <Skeleton width={180} height={20} />
              </div>
            </div>
            <div className="flex flex-1 gap-1 items-center text-gray-600">
              <Skeleton width={220} height={20} />
            </div>
            <Skeleton width={80} height={24} />
          </div>
          <div className="flex self-center rounded-xl w-32 max-md:w-28 overflow-hidden ring-1 ring-gray-200 shadow-sm">
            <Skeleton variant="rounded" width={128} height={128} />
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="h-full">
      <ModalActivity title="Upcoming Events" subtile="Upcoming Events">
        {(isLoading || isFetching) && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonUpcomingCard key={i} />
            ))}
          </>
        )}
        {isError && (
          <p className="px-4 py-2 text-red-500">No upcoming events.</p>
        )}
        {!isLoading && !isFetching && !isError && cards.length === 0 && (
          <p className="px-4 py-2 text-gray-500">No upcoming events.</p>
        )}
        {!isLoading && !isFetching && !isError &&
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
