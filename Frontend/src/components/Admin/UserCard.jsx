import React, { useState } from "react";
import {
  Ban,
  CircleCheckBig,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import { getStatusColor, STATUS_CONFIG, USER_STATUS, canBan } from "./dumpData";
import { Mail, User } from "lucide-react";

function UserCard({ data, onBanUser, onEdit, onView, onDelete }) {
  const {
    id,
    name,
    email,
    avatar,
    type,
    status,
    joinDate,
    lastActive,
    activity,
  } = data;
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isBan, setBan] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const BanUser = async () => {
    if (!canBan(currentStatus)) {
      alert("Only active users can be banned");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to ban "${name}"?\n\nThis user will no longer be able to access the platform.`
    );

    if (!confirmed) return;

    const previousStatus = currentStatus;
    setCurrentStatus(USER_STATUS.BAN);
    setBan(true);

    try {
      await onBanUser?.(id);
      console.log(`✅ User banned successfully`);
    } catch (error) {
      console.error("Failed to ban user:", error);
      setCurrentStatus(previousStatus);
      alert(`Failed to ban user: ${error.message || "Unknown error"}`);
    } finally {
      setBan(false);
    }
  };

  return (
    <>
      {/* Desktop View - Table Row */}
      <tr className="hidden lg:table-row border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <span className="font-semibold text-gray-900">{id}</span>
        </td>
        <td className="px-6 py-4">
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{name}</span>
            <span className="text-sm text-gray-500">{email}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium capitalize">
            {type}
          </span>
        </td>
        <td className="px-6 py-4">
          <span
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize min-w-[90px] inline-block text-center ${getStatusColor(
              currentStatus
            )}`}
            title={STATUS_CONFIG[currentStatus]?.description}
          >
            {STATUS_CONFIG[currentStatus]?.label || currentStatus}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-col text-sm">
            <div className="flex items-center gap-1 text-gray-700">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(joinDate)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatTime(lastActive)}</span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-col gap-1 text-sm">
            {activity?.hours && (
              <span className="text-gray-700">{activity.hours} hours</span>
            )}
            {activity?.events !== null && (
              <span className="text-gray-500">{activity.events} events</span>
            )}
            {activity?.volunteers !== null && (
              <span className="text-gray-500">
                {activity.volunteers} volunteers
              </span>
            )}
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            {currentStatus === USER_STATUS.ACTIVE && (
              <button
                onClick={BanUser}
                disabled={isBan}
                className="p-2 bg-red-500/90 text-white hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                title="Ban user"
              >
                <Ban className="w-4 h-4" />
              </button>
            )}
            {currentStatus === USER_STATUS.PENDING && (
              <button
                onClick={() => onEdit?.(id)}
                className="p-2 bg-green-500/90 text-white hover:bg-green-600 rounded-lg transition-colors"
                title="Approve User"
              >
                <CircleCheckBig className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onView?.(id)}
              className="p-2 border-gray-500/20 border hover:bg-gray-100 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onDelete?.(id)}
              className="p-2 bg-red-400 hover:bg-red-500 rounded-lg transition-colors"
              title="Delete User"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </td>
      </tr>

      {/* Mobile View - Expandable Card */}
      <tr className="lg:hidden">
        <td colSpan="6" className="p-0">
          <div className="bg-white border-1 border-gray-200 rounded-2xl mb-5 shadow-md">
            {/* Compact Header - Always Visible */}
            <div
              className="p-4 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <p className="font-semibold text-gray-900 text-base leading-tight mb-1">
                    {name}
                  </p>

                  {/* Type & Status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500 capitalize">
                      {type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${getStatusColor(
                        currentStatus
                      )}`}
                    >
                      {STATUS_CONFIG[currentStatus]?.label || currentStatus}
                    </span>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Quick Info Preview (when collapsed) */}
              {!isExpanded && (
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(joinDate)}</span>
                  </div>
                  {activity?.hours && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{activity.hours} hours</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-3 rounded-xl">
                {/* Date & Time */}
                <div className="flex items-center gap-2 text-sm pt-3">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700">{formatDate(joinDate)}</span>
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                  <span className="text-gray-600">
                    {formatTime(lastActive)}
                  </span>
                </div>

                {/* Email & Type */}
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 break-words">{email}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 break-words capitalize">
                    {type}
                  </span>
                </div>

                {/* Activity */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 font-medium">
                        Activity
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    {activity?.hours && (
                      <span className="text-gray-700">
                        {activity.hours} hours volunteered
                      </span>
                    )}
                    {activity?.events !== null && (
                      <span className="text-gray-500">
                        {activity.events} events{" "}
                        {type === "organization" ? "created" : "joined"}
                      </span>
                    )}
                    {activity?.volunteers !== null && (
                      <span className="text-gray-500">
                        {activity.volunteers} volunteers
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {currentStatus === USER_STATUS.ACTIVE && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        BanUser();
                      }}
                      disabled={isBan}
                      className="col-span-4 py-2.5 bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Ban className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">
                        Ban User
                      </span>
                    </button>
                  )}
                  {currentStatus === USER_STATUS.PENDING && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(id);
                      }}
                      className="col-span-4 py-2.5 bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CircleCheckBig className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">
                        Approve User
                      </span>
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView?.(id);
                    }}
                    className="col-span-2 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">View</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(id);
                    }}
                    className="col-span-2 py-2.5 bg-red-400 hover:bg-red-500 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}

export default UserCard;
