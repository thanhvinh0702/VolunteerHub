import React, { useState, useEffect } from "react";
import ProjectCard from "../../components/Project/card";
import FilterHorizontal from "../../components/Filter/FilterHorizontal";
import TrendingScrollList from "../../components/TrendingEvent/TrendingScrollList";
import { useEventPagination } from "../../hook/useEvent";
import { Pagination, Skeleton } from "@mui/material";

const categories = [
  "education",
  "health",
  "environment",
  "community",
  "animal",
  "sport",
];

function OpportunitiesEvent() {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize] = useState(6);

  // Filter states
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("APPROVED");
  const [timeRange, setTimeRange] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("Date"); // Date, Name
  const [order, setOrder] = useState("asc"); // asc, desc
  const getSortBy = () => {
    switch (sortBy) {
      case "Date":
        return "startTime";
      case "Name":
        return "name";
      case "Capacity":
        return "capacity";
      default:
        return "startTime";
    }
  };

  // Debounce filter params để tránh gọi API quá nhiều
  const [debouncedParams, setDebouncedParams] = useState({
    status: status === "all" ? undefined : status,
    sortedBy: getSortBy(),
    order,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedParams({
        status: status === "all" ? undefined : status,
        sortedBy: getSortBy(),
        order,
      });
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [status, sortBy, order]);

  // Sử dụng useEventPagination với debounced params
  const { data, isLoading, isFetching, isError, error, isPlaceholderData } =
    useEventPagination({
      pageNum,
      pageSize,
      ...debouncedParams,
    });

  // Reset pageNum về 0 khi filter thay đổi
  useEffect(() => {
    setPageNum(0);
  }, [query, status, sortBy, order, selectedCategories]);

  if (isError) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Error loading opportunities: {error?.message || "Unknown error"}
          </div>
        </div>
      </div>
    );
  }
  console.log(data);

  const events = data?.data || [];
  const totalPages = data?.meta?.totalPages || 0;
  const totalElements = data?.meta?.totalElements || 0;

  // Category options
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedCategories([]);
    setStatus("APPROVED");
    setTimeRange("all");
    setSortBy("Date");
    setOrder("asc");
    setPageNum(0);
  };

  const handlePageChange = (event, value) => {
    setPageNum(value - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-2 p-5">
      <div className="flex flex-col gap-2">
        <p className="text-3xl font-bold text-md">Volunteer Opportunities</p>
        <p className="text-sm text-gray-600 mb-4">
          Discover meaningful ways to make a difference
        </p>
      </div>

      <FilterHorizontal
        query={query}
        setQuery={setQuery}
        status={status}
        setStatus={setStatus}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
        resetFilters={resetFilters}
      />

      <div>
        <TrendingScrollList />
      </div>

      <div className="flex justify-between items-center px-4 mb-4">
        <div className="text-xl font-bold">All Opportunities</div>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          {isFetching && (
            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          )}
          {isLoading ? "Loading..." : `${totalElements} events found`}
        </div>
      </div>

      {isLoading && !data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {[...Array(pageSize)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <Skeleton variant="rectangular" height={180} animation="wave" />
              <div className="p-4">
                <Skeleton
                  variant="text"
                  width="60%"
                  height={24}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={20}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="40%"
                  height={20}
                  animation="wave"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && events.length === 0 && (
        <div className="flex items-center justify-center h-64 transition-opacity duration-300">
          <div className="text-center">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <p className="text-gray-500">No opportunities found</p>
            <button
              onClick={resetFilters}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {(events.length > 0 || isPlaceholderData) && (
        <>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr transition-opacity duration-300 ease-in-out ${
              isFetching ? "opacity-60" : "opacity-100"
            }`}
            style={{ pointerEvents: isFetching ? "none" : "auto" }}
          >
            {events.map((item, index) => (
              <div
                key={item.id}
                className="transform transition-all duration-300 ease-out"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <ProjectCard {...item} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                count={totalPages}
                page={pageNum + 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    "&.Mui-selected": {
                      backgroundColor: "#f87171",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#ef4444",
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OpportunitiesEvent;
