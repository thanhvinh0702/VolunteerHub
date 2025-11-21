import React, { useState } from "react";
import { Eye, Edit3, Search, ChevronDown, ChevronUp } from "lucide-react";

const volunteers = [
  {
    id: "VL-001",
    name: "Alex Chen",
    email: "alex@email.com",
    age: 24,
    address: "123 Nguyen Trai, Ha Noi",
    initials: "AC",
  },
  {
    id: "VL-002",
    name: "Maria Rodriguez",
    email: "maria@email.com",
    age: 28,
    address: "456 Le Loi, HCMC",
    initials: "MR",
  },
  {
    id: "VL-003",
    name: "James Wilson",
    email: "james@email.com",
    age: 22,
    address: "789 Tran Hung Dao, Da Nang",
    initials: "JW",
  },
  {
    id: "VL-004",
    name: "Lisa Park",
    email: "lisa@email.com",
    age: 26,
    address: "321 Bach Dang, Hai Phong",
    initials: "LP",
  },
  {
    id: "VL-005",
    name: "David Kim",
    email: "david@email.com",
    age: 30,
    address: "654 Hoang Hoa Tham, Hue",
    initials: "DK",
  },
];

function VolunteerList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [itemsToShow, setItemsToShow] = useState(5);

  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedVolunteers = filteredVolunteers.slice(0, itemsToShow);
  const hasMore = filteredVolunteers.length > itemsToShow;

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleView = (volunteer) => {
    console.log("View volunteer:", volunteer);
    // TODO: Navigate to volunteer detail page or open modal
  };

  const handleEdit = (volunteer) => {
    console.log("Edit volunteer:", volunteer);
    // TODO: Navigate to edit page or open modal
  };

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
          placeholder="Search by name, email, ID, or address..."
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
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Volunteer</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredVolunteers.length > 0 ? (
              filteredVolunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {volunteer.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0">
                        {volunteer.initials}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {volunteer.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{volunteer.email}</td>
                  <td className="px-4 py-3 text-gray-600">{volunteer.age}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {volunteer.address}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(volunteer)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(volunteer)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
          displayedVolunteers.map((volunteer) => {
            const isExpanded = expandedIds.has(volunteer.id);
            return (
              <div
                key={volunteer.id}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                {/* Summary Section */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0">
                      {volunteer.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {volunteer.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {volunteer.email}
                      </p>
                      <p className="text-xs text-gray-400">{volunteer.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpand(volunteer.id)}
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
                      <span className="text-gray-500">Age:</span>
                      <span className="text-gray-900 font-medium">
                        {volunteer.age}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Address:</span>
                      <span className="text-gray-900 font-medium text-right flex-1 ml-2">
                        {volunteer.address}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleView(volunteer)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(volunteer)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
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
          Showing {displayedVolunteers.length} of {filteredVolunteers.length}{" "}
          volunteers
        </div>
      )}
    </div>
  );
}

export default VolunteerList;
