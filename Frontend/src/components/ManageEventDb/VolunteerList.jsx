import React, { useState } from "react";
import {
  Eye,
  Edit3,
  Search,
  ChevronDown,
  ChevronUp,
  Delete,
  Trash,
} from "lucide-react";
import {
  useListUserOfAnEventApproveAndCompleted,
  useRemoveParticipant,
} from "../../hook/useRegistration";
import { useOutletContext } from "react-router-dom";

function VolunteerList() {
  const { eventId } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [itemsToShow, setItemsToShow] = useState(10);
  const [pageNum, setPageNum] = useState(0);

  let { data, isLoading, isError, refetch } =
    useListUserOfAnEventApproveAndCompleted(eventId, {
      pageNum,
      pageSize: itemsToShow,
      status: "COMPLETED",
    });

  // Extract data from paginated response
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

  const filteredVolunteers = registrations.filter((registration) => {
    const searchLower = searchQuery.toLowerCase();
    const user = registration.user || {};
    return (
      user.fullName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.phoneNumber?.toLowerCase().includes(searchLower) ||
      user.address?.toLowerCase().includes(searchLower)
    );
  });

  const displayedVolunteers = filteredVolunteers;
  const hasMore = false;

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

  const handleEdit = (registration) => {
    console.log("Edit registration:", registration);
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder="Search by name, email, username, phone, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
                      {user.address || ""}
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
                        {user.address || ""}
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

        {/* Load More Button - Mobile */}
        {hasMore && (
          <button
            onClick={() => setItemsToShow(itemsToShow + 5)}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Load More ({filteredVolunteers.length - itemsToShow} remaining)
          </button>
        )}
      </div>

      {/* Results Count */}
      {filteredVolunteers.length > 0 && (
        <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left pt-2 border-t border-gray-100">
          Showing {displayedVolunteers.length} of{" "}
          {data?.meta?.totalElements || filteredVolunteers.length} volunteers
        </div>
      )}
    </div>
  );
}

export default VolunteerList;
