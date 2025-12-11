import { useState, useEffect, useRef } from "react";
import Pagination from "@mui/material/Pagination";
import RegistrationFilters from "../../components/Registration/RegistrationFilters";
import RegistrationTable from "../../components/Registration/RegistrationTable";
import RegistrationDetailModal from "../../components/Registration/RegistrationDetailModal";
import RegistrationStatusBadge from "../../components/Registration/RegistrationStatusBadge";
import { useAllRegistrationForManager } from "../../hook/useRegistration";

const PAGE_SIZE = 6;

export default function RegistrationPage() {
  const [filters, setFilters] = useState({
    event: "",
    status: "",
    search: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedReg, setSelectedReg] = useState(null);
  const isFirstLoad = useRef(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters.status, filters.event]);

  const { data, isLoading, isFetching } = useAllRegistrationForManager({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch,
    status: filters.status,
    event: filters.event,
  });

  // Track first successful load
  useEffect(() => {
    if (data && isFirstLoad.current) {
      isFirstLoad.current = false;
    }
  }, [data]);

  const showFullLoading = isLoading && isFirstLoad.current;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "";
    }
  };

  if (showFullLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading registrations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm ">
      <div className={`${selectedReg ? "blur" : ""} flex flex-col gap-5`}>
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold text-gray-900">
            Register manager
          </h3>
          <p className="text-gray-500">
            Manage all your volunteer registration
          </p>
        </div>

        <div className="">
          <RegistrationFilters
            filters={filters}
            setFilters={setFilters}
            eventOptions={data?.eventOptions || []}
          />
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <RegistrationTable
            data={data?.items || []}
            isFetching={isFetching}
            onSelect={(reg) => setSelectedReg(reg)}
          />
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {data?.items && data.items.length > 0 ? (
            data.items.map((reg) => {
              const user = reg.user || {};
              return (
                <div key={reg.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  {/* Summary */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName || "Volunteer"}
                          className="h-10 w-10 rounded-full flex-shrink-0 object-cover"
                        />
                      ) : (
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName || "volunteer"}`}
                          alt="avatar"
                          className="h-10 w-10 rounded-full flex-shrink-0 object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">{user.fullName || ""}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email || ""}</p>
                        {reg.userId && (
                          <p className="text-xs text-gray-400">User ID: {String(reg.userId).slice(0, 8)}...</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedReg(reg)}
                      className="flex-shrink-0 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition"
                    >
                      View
                    </button>
                  </div>

                  {/* Details */}
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Registered:</span>
                      <span className="text-gray-900 font-medium">{formatDateTime(reg.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Status:</span>
                      <RegistrationStatusBadge status={reg.status} />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">No registrations found</div>
          )}
        </div>

        {/* Pagination */}
        {data?.items && data.items.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 gap-4">
            <p className="text-sm text-gray-500">
              Showing {data.items.length} of {data.totalItems} registrations
            </p>
            {data.totalPages > 0 && (
              <Pagination
                count={data.totalPages}
                page={page}
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
            )}
          </div>
        )}
      </div>

      {selectedReg && (
        <RegistrationDetailModal
          registration={selectedReg}
          onClose={() => setSelectedReg(null)}
        />
      )}
    </div>
  );
}
