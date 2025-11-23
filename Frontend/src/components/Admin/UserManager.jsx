import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { mockData } from "./dumpData";
import DropdownSelect from "../Dropdown/DropdownSelect";
import { Download, Search } from "lucide-react";
import UserCard from "./UserCard";

function UserManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: "user-manager",
    queryFn: mockData,
    staleTime: 1000 * 60,
  });
  const users = data?.users || [];

  const handleBanUser = async (id) => {
    console.log(`Banning user ${id}...`);

    // Simulate API call
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error("Network error"));
        }
      }, 1000);
    });

    // TODO: Replace with real API call
    // await banUser(id);

    console.log(`✅ User banned successfully`);
  };
  const handleView = (id) => {
    console.log(`View user ${id}`);
    // TODO: Navigate to user detail page
  };

  const handleDelete = (id) => {
    console.log(`Delete user ${id}`);
    // TODO: Show confirmation modal and delete
  };
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading users...</div>
        </div>
      </div>
    );
  }
  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  if (isError) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Error loading users: {error.message}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm gap-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-gray-900">User Manager</h2>
        <p className="text-gray-500">Manage all users</p>
      </div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center relative">
        {/* Search */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users..."
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
            { value: "active", label: "Active" },
            { value: "ban", label: "Ban" },
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
                id
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                icon
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Join date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Activity
              </th>{" "}
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  data={user}
                  onBanUser={handleBanUser}
                  onView={handleView}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-500">No users found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManager;
