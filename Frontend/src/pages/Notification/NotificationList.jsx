import React, { useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import NotificationCard from "./NotificationCard";
import { MoveUp } from "lucide-react";
function NotificationList({ items, loadMore }) {
  const virtuosoRef = useRef();

  // Hàm scroll đến đầu
  const scrollToTop = () => {
    virtuosoRef.current?.scrollToIndex({
      index: 0,
      align: "start",
      behavior: "smooth",
    });
  };

  return (
    <div className="h-[55vh] max-h-[700px] min-h-[320px] bg-white p-3 sm:p-4">
      <Virtuoso
        ref={virtuosoRef}
        style={{ height: "100%" }}
        data={items}
        endReached={loadMore}
        itemContent={(index, noti) => (
          <NotificationCard key={`${noti?.id ?? index}`} noti={noti} />
        )}
      />

      <button
        onClick={scrollToTop}
        className="absolute animate-bounce -bottom-5 right-0 w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition"
      >
        <MoveUp />
      </button>
    </div>
  );
}

export default NotificationList;
