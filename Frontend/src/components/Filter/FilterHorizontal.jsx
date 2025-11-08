import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import DropdownSelect from "../Dropdown/DropdownSelect";

export default function FilterHorizontal({
  query,
  setQuery,
  status,
  setStatus,
  timeRange,
  setTimeRange,
  categories,
  selectedCategories,
  toggleCategory,
}) {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-600/20">
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search opportunities..."
            className="w-full rounded-xl px-4 py-3 pl-10 bg-gray-50 border border-gray-200 focus:ring focus:ring-blue-200 caret-blue-600"
          />
        </div>

        {/* Controls */}
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <DropdownSelect
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "All status" },
                { value: "open", label: "Open" },
                { value: "closed", label: "Closed" },
              ]}
              className="w-32"
            />

            <DropdownSelect
              value={timeRange}
              onChange={setTimeRange}
              options={[
                { value: "all", label: "Any time" },
                { value: "today", label: "Today" },
                { value: "this_week", label: "This week" },
                { value: "this_month", label: "This month" },
              ]}
              className="w-36"
            />
          </div>

          <button
            onClick={() => setOpenFilter(!openFilter)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Filter
          </button>
        </div>

        {/* Categories */}
        {openFilter && (
          <div className="mt-3 md:flex gap-2 overflow-x-auto">
            {categories.map((c) => {
              const active = selectedCategories.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleCategory(c)}
                  className={`whitespace-nowrap px-3 py-1 rounded-full border ${
                    active ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
