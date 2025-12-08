import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import RegistrationFilters from "../Registration/RegistrationFilters";
import RegistrationTableForAd from "./RegistrationTableForAd";
import RegistrationDetailModal from "../Registration/RegistrationDetailModal";
import EventVolunteerRegisterFilter from "./EventVolunteerRegisterFilter";
import { useOutletContext } from "react-router-dom";
import { useListUserOfAnEvent } from "../../hook/useRegistration";

export default function EventVolunteerRegister() {
  const { eventId } = useOutletContext();
  const [filters, setFilters] = useState({
    event: "all",
    status: "pending",
    search: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Map frontend filter status to API status
  const getApiStatus = (filterStatus) => {
    const statusMap = {
      pending: "PENDING",
      rejected: "REJECTED",
    };
    return statusMap[filterStatus] || "PENDING";
  };

  const { data, isLoading, isError, refetch } = useListUserOfAnEvent(eventId, {
    pageNum: page - 1, // MUI Pagination starts from 1, API starts from 0
    pageSize,
    status: getApiStatus(filters.status),
  });

  // Extract data from paginated response
  const registrations = data?.data || [];
  const totalPages = data?.meta?.totalPages || 0;
  const totalElements = data?.meta?.totalElements || 0;

  const [selectedReg, setSelectedReg] = useState(null);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

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
          <EventVolunteerRegisterFilter
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Loading registrations...
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">
            Error loading registrations
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <RegistrationTableForAd
                registrations={registrations}
                filters={filters}
                onSelect={(reg) => setSelectedReg(reg)}
              />
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 gap-4">
                <p className="text-sm text-gray-500">
                  Showing {registrations.length} of {totalElements}{" "}
                  {filters.status} registration(s)
                </p>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      "&.Mui-selected": {
                        backgroundColor: "#3b82f6",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#2563eb",
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

      {selectedReg && (
        <RegistrationDetailModal
          registration={selectedReg}
          onClose={() => {
            setSelectedReg(null);
            refetch(); // Refresh data after closing modal
          }}
        />
      )}
    </div>
  );
}
