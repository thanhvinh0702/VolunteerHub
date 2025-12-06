import React, { useState } from "react";
import ProjectCard from "../../components/Project/card";
import FilterHorizontal from "../../components/Filter/FilterHorizontal";
import TrendingScrollList from "../../components/TrendingEvent/TrendingScrollList";
import { useSearchEvents } from "../../hook/useEvent";
import { Pagination } from "@mui/material";

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
  const [pageSize] = useState(9);

  // Filter states
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("APPROVED");
  const [timeRange, setTimeRange] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("Date"); // Date, Name

  const { data, isLoading, isFetching, isError, error } = useSearchEvents({
    search: query,
    pageNum,
    pageSize,
    status: status === "all" ? undefined : status,
    sortBy: sortBy,
    filterBy: selectedCategories.length > 0 ? "category" : undefined,
    filterValue: selectedCategories.length > 0 ? selectedCategories : undefined,
  });

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

  const events = data?.data || [];
  const totalPages = 2; // Default to 2 pages
  const totalElements = 7;

  // Category options
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setPageNum(0); // Reset to first page when filter changes
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedCategories([]);
    setStatus("APPROVED");
    setTimeRange("all");
    setSortBy("Date");
    setPageNum(0);
  };

  const handlePageChange = (event, value) => {
    setPageNum(value - 1); // Convert from 1-based (UI) to 0-based (API)
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
        resetFilters={resetFilters}
      />

      <div>
        <TrendingScrollList />
      </div>

      <div className="flex justify-between items-center px-4 mb-4">
        <div className="text-xl font-bold">All Opportunities</div>
        <div className="text-sm text-gray-600">
          {isLoading ? "Loading..." : `${totalElements} events found`}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading opportunities...</div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && events.length === 0 && (
        <div className="flex items-center justify-center h-64">
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

      {/* Events Grid */}
      {!isLoading && events.length > 0 && (
        <>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr ${
              isFetching ? "opacity-50" : ""
            }`}
          >
            {events.map((item) => (
              <ProjectCard key={item.id} {...item} />
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
