import { useState, useEffect, useRef } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Pagination from "@mui/material/Pagination";
import RegistrationFilters from "../../components/Registration/RegistrationFilters";
import RegistrationTable from "../../components/Registration/RegistrationTable";
import RegistrationDetailModal from "../../components/Registration/RegistrationDetailModal";
import { mockRegistrationData } from "./registrationData";

const PAGE_SIZE = 6;

export default function RegistrationPage() {
  const [filters, setFilters] = useState({
    event: "all",
    status: "pending",
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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "registrations",
      page,
      debouncedSearch,
      filters.status,
      filters.event,
    ],
    queryFn: () =>
      mockRegistrationData({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        status: filters.status,
        event: filters.event,
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
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
          <RegistrationFilters filters={filters} setFilters={setFilters} />
        </div>

        <div className="overflow-x-auto">
          <RegistrationTable
            data={data?.items || []}
            isFetching={isFetching}
            onSelect={(reg) => setSelectedReg(reg)}
          />
        </div>

        {/* Pagination */}
        {data?.items && data.items.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 gap-4">
            <p className="text-sm text-gray-500">
              Showing {data.items.length} of {data.totalItems} registrations
            </p>
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
