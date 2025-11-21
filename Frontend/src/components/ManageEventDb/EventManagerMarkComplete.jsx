import React, { useState } from "react";
import MarkCompletionCard from "../MarkCompletion/MarkCompletionCard";
import { Search, CheckCircle, Send, Download } from "lucide-react";
import DropDown from "../Dropdown/DropDown";
import DropdownSelect from "../Dropdown/DropdownSelect";

// Dummy data
const initialVolunteers = [
  {
    id: 1,
    name: "Alex Chen",
    email: "alex@email.com",
    status: "registered",
    avatar: null,
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    email: "maria@email.com",
    status: "completed",
    hoursLogged: 4,
    rating: 5,
    feedback: "Excellent volunteer! Very enthusiastic and helpful.",
    avatar: null,
  },
  {
    id: 3,
    name: "James Wilson",
    email: "james@email.com",
    status: "attended",
    hoursLogged: 4,
    avatar: null,
  },
  {
    id: 4,
    name: "Lisa Park",
    email: "lisa@email.com",
    status: "absent",
    avatar: null,
  },
];

function EventManagerMarkComplete() {
  const [volunteers, setVolunteers] = useState(initialVolunteers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");

  const handleMarkAttended = (volunteer) => {
    console.log("Mark Attended:", volunteer);
    // Update volunteer status to attended
    setVolunteers(
      volunteers.map((v) =>
        v.id === volunteer.id ? { ...v, status: "attended", hoursLogged: 0 } : v
      )
    );
  };

  const handleMarkAbsent = (volunteer) => {
    console.log("Mark Absent:", volunteer);
    // Update volunteer status to absent
    setVolunteers(
      volunteers.map((v) =>
        v.id === volunteer.id ? { ...v, status: "absent" } : v
      )
    );
  };

  const handleMarkCompleted = (volunteer) => {
    console.log("Mark Completed:", volunteer);
    // Update volunteer status to completed (would open modal to add rating/feedback)
    setVolunteers(
      volunteers.map((v) =>
        v.id === volunteer.id
          ? {
              ...v,
              status: "completed",
              rating: 5,
              feedback: "Great volunteer!",
            }
          : v
      )
    );
  };

  const handleEditCompletion = (volunteer) => {
    console.log("Edit Completion:", volunteer);
    // Open modal to edit completion details
  };

  const handleUndo = (volunteer) => {
    console.log("Undo:", volunteer);
    // Revert volunteer status back to registered
    setVolunteers(
      volunteers.map((v) =>
        v.id === volunteer.id ? { ...v, status: "registered" } : v
      )
    );
  };

  const handleMarkAllAsCompleted = () => {
    console.log("Mark all attended as completed");
    // Mark all attended volunteers as completed
    setVolunteers(
      volunteers.map((v) =>
        v.status === "attended"
          ? {
              ...v,
              status: "completed",
              rating: 5,
              feedback: "Great volunteer!",
            }
          : v
      )
    );
  };

  const handleSendCertificates = () => {
    console.log("Send certificates");
    // Send certificates to all completed volunteers
  };
  console.log(filter);

  const handleExportReport = () => {
    console.log("Export report");
    // Export report of all volunteers
  };

  // Filter volunteers based on search query
  const filteredVolunteers = volunteers.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm gap-4 sm:gap-6 flex flex-col">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
          Volunteer Completion Management
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Mark attendance and completion status for event volunteers
        </p>
      </div>

      {/* Search and Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-3">
        {/* Search Bar */}
        <div className="relative w-full lg:flex-1 lg:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search volunteers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm sm:text-base"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 pb-1 max-md:self-end relative">
          <button
            onClick={handleMarkAllAsCompleted}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap text-xs sm:text-sm"
          >
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="sm:hidden">Mark All</span>
            <span className="hidden sm:inline">
              Mark All Attended as Completed
            </span>
          </button>
          <button
            onClick={handleSendCertificates}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap text-xs sm:text-sm"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="hidden xs:inline">Send Certificates</span>
            <span className="xs:hidden">Send</span>
          </button>

          <div className="relative z-50 overflow-visible">
            <DropdownSelect
              options={[
                { label: "All", value: "all" },
                { label: "Attended", value: "attended" },
                { label: "Completed", value: "completed" },
                { label: "Absent", value: "absent" },
              ]}
              value={filter}
              onChange={(next) => setFilter(next)}
            />
          </div>
        </div>
      </div>

      {/* Tip Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <p className="text-xs sm:text-sm text-gray-700">
          <span className="font-semibold">Tip:</span> Mark volunteers as
          "Attended" first, then individually mark as "Completed" with hours and
          feedback for certificate generation.
        </p>
      </div>

      {/* Volunteer List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredVolunteers.length > 0 ? (
          filteredVolunteers.map((volunteer) => (
            <MarkCompletionCard
              key={volunteer.id}
              volunteer={volunteer}
              onMarkAttended={handleMarkAttended}
              onMarkAbsent={handleMarkAbsent}
              onMarkCompleted={handleMarkCompleted}
              onEditCompletion={handleEditCompletion}
              onUndo={handleUndo}
            />
          ))
        ) : (
          <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
            No volunteers found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}

export default EventManagerMarkComplete;
