import React, { useEffect, useState, useRef } from "react";
import DropdownSelect from "../Dropdown/DropdownSelect";
import { Download, Search } from "lucide-react";
import EventManagerCardAd from "./EventManagerCardAd";
import Pagination from "@mui/material/Pagination";
import { useEventPagination } from "../../hook/useEvent";

const PAGE_SIZE = 20;

function EventAdminManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(0);
  const isFirstLoad = useRef(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(0);
  }, [filterStatus]);

  const { data, isLoading, isFetching, isError, error } = useEventPagination({
    pageNum: page,
    pageSize: PAGE_SIZE,
    status: filterStatus === "all" ? undefined : filterStatus.toUpperCase(),
  });

  // Track first successful
  useEffect(() => {
    if (data && isFirstLoad.current) {
      isFirstLoad.current = false;
    }
  }, [data]);

  const showFullLoading = isLoading && isFirstLoad.current;

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const handleBanEvent = async (id) => {
    console.log(`Cancelling event ${id}...`);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error("Network error"));
        }
      }, 1000);
    });
    console.log(`Event cancelled successfully`);
  };

  const handleView = (id) => {
    console.log(`View event ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete event ${id}`);
  };

  if (showFullLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading events...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Error loading events: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm gap-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-gray-900">Event Manager</h2>
        <p className="text-gray-500">Manage all events</p>
      </div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center relative">
        {/* Search */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* Filter & Create */}
      <div className="flex gap-3 items-center">
        <DropdownSelect
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: "all", label: "All Status" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-600 transition-colors font-medium max-sm:py-1 max-sm:px-1">
          <Download className="w-5 h-5" />
          <span>DownLoad Report</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="max-lg:hidden">
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Event
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Volunteers
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className={
              isFetching
                ? "opacity-50 transition-opacity"
                : "transition-opacity"
            }
          >
            {data?.data && data.data.length > 0 ? (
              data.data.map((event) => (
                <EventManagerCardAd
                  key={event.id}
                  data={event}
                  onCancelEvent={handleBanEvent}
                  onView={handleView}
                  onDelete={handleDelete}
                  onEdit={handleView}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-500">No events found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.data && data.data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 gap-4">
          <p className="text-sm text-gray-500">
            Showing {data.data.length} of {data.meta?.totalElements || 0} events
          </p>
          <Pagination
            count={data.meta?.totalPages || 0}
            page={page + 1}
            onChange={handlePageChange}
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
    </div>
  );
}

export default EventAdminManager;
