import React, { useEffect, useMemo, useState } from "react";
import ProjectCard from "../../components/Project/card";
import FilterHorizontal from "../../components/Filter/FilterHorizontal";
import { getOpenEvents } from "./events";
import { applyFilters } from "../../utils/filters";
function OpportunitiesEvent() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    setEvents(getOpenEvents());
  }, []);
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [status, setStatus] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const categories = useMemo(
    () => [...new Set(events.map((e) => e.category))].filter(Boolean),
    [events]
  );
  const toogleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  const resetFilters = () => {
    setQuery("");
    setSelectedCategories([]);
    setStatus("all");
    setTimeRange("all");
  };
  const filtered = React.useMemo(
    () =>
      applyFilters(events, {
        query,
        queryKeys: ["title", "location"],
        selectedCategories,
        categoryKey: "category",
        status,
        statusKey: "status",
        timeRange,
        dateKey: "date",
      }),
    [events, query, selectedCategories, status, timeRange]
  );
  return (
    <div className="flex flex-col gap-2 p-5">
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-bold text-md">Volunteer Opportunities</p>
        <p className="text-sm text-gray-600 mb-4">
          {" "}
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
        toggleCategory={toogleCategory}
        resetFilters={resetFilters}
      />

      <div></div>
      <div></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {filtered.map((item) => {
          return <ProjectCard key={item.id} {...item} />;
        })}
      </div>
    </div>
  );
}

export default OpportunitiesEvent;
