import React, { useState, useEffect } from "react";
import {
  Eye,
  Search,
  ChevronDown,
  ChevronUp,
  Trash,
  Download,
} from "lucide-react";
import Pagination from "@mui/material/Pagination";
import {
  useListUserOfAnEventApproveAndCompleted,
  useRemoveParticipant,
} from "../../hook/useRegistration";
import { useOutletContext } from "react-router-dom";
import AnalysisService from "../../services/analysisService";

const PAGE_SIZE = 10; // giống cách đặt PAGE_SIZE trong EventManager

function VolunteerList() {
  const { eventId } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [page, setPage] = useState(0);
  const [exportFormat, setExportFormat] = useState("csv");
  const [isExporting, setIsExporting] = useState(false);

  // Reset page khi thay đổi search
  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  let { data, isLoading, isError, refetch } =
    useListUserOfAnEventApproveAndCompleted(eventId, {
      pageNum: page,
      pageSize: PAGE_SIZE,
      status: "COMPLETED",
    });

  // Extract data từ response
  const registrations = data?.data || [];

  const { mutate: removeParticipant, isPending: isRemoving } =
    useRemoveParticipant();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatAddress = (address) => {
    if (!address) return "";
    if (typeof address === "string") return address;
    if (typeof address === "object") {
      const { street, district, province } = address;
      return [street, district, province].filter(Boolean).join(", ");
    }
    return "";
  };

  const filteredVolunteers = registrations.filter((registration) => {
    const searchLower = searchQuery.toLowerCase();
    const user = registration.user || {};
    return (
      user.fullName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.phoneNumber?.toLowerCase().includes(searchLower) ||
      formatAddress(user.address)?.toLowerCase().includes(searchLower)
    );
  });

  const displayedVolunteers = filteredVolunteers;

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleView = (registration) => {
    console.log("View registration:", registration);
  };

  const handleDelete = (registration) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${
          registration.user?.fullName || "this volunteer"
        } from the event?`
      )
    ) {
      removeParticipant(
        { eventId, participantId: registration.userId },
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value - 1); // từ 1-based (UI) sang 0-based (API)
  };

  const handleExportData = async () => {
    if (!eventId) {
      alert("Event ID is missing");
      return;
    }

    setIsExporting(true);

    try {
      if (exportFormat === "csv") {
        // Export CSV từ backend
        const response = await AnalysisService.getEventParticipantsCsv(eventId);

        // Create blob and download
        const blob = new Blob([response], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `volunteers_event_${eventId}_${
            new Date().toISOString().split("T")[0]
          }.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Export JSON từ backend
        const response = await AnalysisService.getEventParticipantsJson(
          eventId
        );

        // Convert JSON to string and download
        const jsonString = JSON.stringify(response, null, 2);
        const blob = new Blob([jsonString], {
          type: "application/json;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `volunteers_event_${eventId}_${
            new Date().toISOString().split("T")[0]
          }.json`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert(`Failed to export data: ${error.message || "Unknown error"}`);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="text-center py-8 text-gray-500">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="text-center py-8 text-red-500">
          Failed to load volunteers
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm gap-4 sm:gap-6 flex flex-col">
      {/* Header */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          Registered Volunteers
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">
          Overview of volunteers for this event
        </p>
      </div>

      {/* Search Bar & Export Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search volunteers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
          <button
            onClick={handleExportData}
            disabled={isExporting || !eventId}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            {isExporting
              ? "Exporting..."
              : `Export ${exportFormat.toUpperCase()}`}
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <th className="px-4 py-3">Volunteer</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Joined At</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredVolunteers.length > 0 ? (
              filteredVolunteers.map((registration) => {
                const user = registration.user || {};
                return (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            className="h-9 w-9 rounded-full flex-shrink-0 object-cover"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0">
                            {getInitials(user.fullName)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.fullName || ""}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.username || ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {user.email || ""}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {user.phoneNumber || ""}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatAddress(user.address)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(registration.reviewedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(registration)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(registration)}
                          disabled={isRemoving}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  No volunteers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {displayedVolunteers.length > 0 ? (
          displayedVolunteers.map((registration) => {
            const user = registration.user || {};
            const isExpanded = expandedIds.has(registration.id);
            return (
              <div
                key={registration.id}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                {/* Summary Section */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="h-10 w-10 rounded-full flex-shrink-0 object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0">
                        {getInitials(user.fullName)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {user.fullName || ""}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email || ""}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user.username || ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpand(registration.id)}
                    className="flex-shrink-0 p-1 rounded hover:bg-gray-100 transition"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phone:</span>
                      <span className="text-gray-900 font-medium">
                        {user.phoneNumber || ""}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Address:</span>
                      <span className="text-gray-900 font-medium text-right flex-1 ml-2">
                        {formatAddress(user.address)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Joined At:</span>
                      <span className="text-gray-900 font-medium">
                        {formatDate(registration.reviewedAt)}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleView(registration)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(registration)}
                        disabled={isRemoving}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-red-300 px-3 py-2 text-xs font-medium bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            No volunteers found
          </div>
        )}
      </div>

      {/* Pagination & Stats Footer */}
      {data?.data && data.data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 gap-4">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing {data.data.length} of {data.meta?.totalElements || 0}{" "}
            volunteers
          </p>
          <Pagination
            count={data.meta?.totalPages || 0}
            page={page + 1}
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
    </div>
  );
}

export default VolunteerList;
