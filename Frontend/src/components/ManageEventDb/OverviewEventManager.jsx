import React, { useState, useEffect, useRef } from "react";
import { dashboardConfig } from "../../constant/dashboardConfig";
import EventCard from "../Dashboard/EventCard";
import Card from "../Card.jsx/Card";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { ScrollText, TriangleAlert, XCircle } from "lucide-react";
import { getCoordinates } from "../../utils/getCoordinates";
import MapPreview from "../Location/MapPreview";
import { useEventDetail, useUpdateEvent } from "../../hook/useEvent";
import DropdownSelect from "../Dropdown/DropdownSelect";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";

const categoryOptions = [
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "environment", label: "Environment" },
  { value: "animals", label: "Animals" },
  { value: "other", label: "Other" },
];

function OverviewEventManager() {
  const { eventId } = useOutletContext();
  const [showMore, setShowMore] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const descriptionRef = useRef(null);

  // Fetch event details
  const {
    data: eventData,
    isLoading,
    error,
    refetch,
  } = useEventDetail(eventId);
  const updateEventMutation = useUpdateEvent({
    onSuccess: () => {
      toast.success("Event updated successfully");
      setIsEditMode(false);
      refetch();
    },
  });
  // Initialize edit data when event data loads
  useEffect(() => {
    if (eventData && !editData) {
      setEditData({
        name: eventData.name || "",
        description: eventData.description || "",
        categoryName: eventData.category?.name || "",
        startTime: eventData.startTime ? eventData.startTime.slice(0, 16) : "",
        endTime: eventData.endTime ? eventData.endTime.slice(0, 16) : "",
        capacity: eventData.capacity || "",
        registrationDeadline: eventData.registrationDeadline
          ? eventData.registrationDeadline.slice(0, 16)
          : "",
        street: eventData.address?.street || "",
        district: eventData.address?.district || "",
        province: eventData.address?.province || "",
      });
    }
  }, [eventData, editData]);
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [mapError, setMapError] = useState(null);

  // Build location string from eventData or editData
  const locationString =
    isEditMode && editData
      ? [editData.street, editData.district, editData.province]
          .filter(Boolean)
          .join(", ")
      : eventData
      ? [
          eventData.address?.street,
          eventData.address?.district,
          eventData.address?.province,
        ]
          .filter(Boolean)
          .join(", ")
      : "";

  useEffect(() => {
    if (descriptionRef.current && eventData?.description) {
      const lineHeight = parseInt(
        window.getComputedStyle(descriptionRef.current).lineHeight
      );
      const maxHeight = lineHeight * 4;
      const actualHeight = descriptionRef.current.scrollHeight;
      setShouldShowButton(actualHeight > maxHeight);
    }
  }, [eventData?.description]);

  useEffect(() => {
    let isMounted = true;

    const fetchCoordinates = async () => {
      if (!locationString) return;

      try {
        const coords = await getCoordinates(locationString);
        if (isMounted) {
          if (coords) {
            setCoordinates(coords);
            setMapError(null);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Không thể lấy tọa độ:", error);
          setMapError("Không thể tải bản đồ");
        }
      }
    };

    fetchCoordinates();

    return () => {
      isMounted = false;
    };
  }, [locationString]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // Reset edit data to original
    if (eventData) {
      setEditData({
        name: eventData.name || "",
        description: eventData.description || "",
        categoryName: eventData.category?.name || "",
        startTime: eventData.startTime ? eventData.startTime.slice(0, 16) : "",
        endTime: eventData.endTime ? eventData.endTime.slice(0, 16) : "",
        capacity: eventData.capacity || "",
        registrationDeadline: eventData.registrationDeadline
          ? eventData.registrationDeadline.slice(0, 16)
          : "",
        street: eventData.address?.street || "",
        district: eventData.address?.district || "",
        province: eventData.address?.province || "",
      });
    }
  };

  const handleSave = () => {
    if (!editData) return;

    // Normalize categoryName to lowercase
    const normalizedCategoryName = editData.categoryName.toLowerCase();

    // Backend expects LocalDateTime without seconds; trim to yyyy-MM-ddTHH:mm
    const normalizeDateTime = (value) =>
      value ? value.toString().substring(0, 16) : value;

    const payload = {
      name: editData.name,
      description: editData.description,
      categoryName: normalizedCategoryName,
      startTime: normalizeDateTime(editData.startTime),
      endTime: normalizeDateTime(editData.endTime),
      capacity: parseInt(editData.capacity),
      registrationDeadline: normalizeDateTime(editData.registrationDeadline),
      address: {
        street: editData.street,
        district: editData.district,
        province: editData.province,
      },
    };

    console.log("=== PAYLOAD BEFORE PUT ===");
    console.log("Event ID:", eventId);
    console.log("Payload (JSON):", JSON.stringify(payload, null, 2));
    console.log("DateTime formats:", {
      start: editData.startTime,
      end: editData.endTime,
      deadline: editData.registrationDeadline,
    });

    console.log("Payload sent as eventRequest:", payload);

    updateEventMutation.mutate({ eventId, payload });
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading event: {error.message}</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No event data found</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 font-jost">
      {/* <div className="grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-lg:gap-4 auto-rows-fr">
        {cards.map((item) => (
          <EventCard key={item.id} {...item} />
        ))}
      </div> */}
      <div className="rounded-xl grid grid-cols-3 gap-5 max-sm:flex max-sm:flex-col max-sm:gap-5">
        <div className="col-span-2 h-full">
          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-semibold text-gray-900">
                    Event Details
                  </p>
                  <p className="text-gray-500 text-sm">
                    {isEditMode
                      ? "Edit event information"
                      : "Complete information about this event"}
                  </p>
                </div>
                {!isEditMode && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                )}
              </div>

              <dl className="space-y-4 text-sm sm:text-base text-gray-700">
                {/* Event Name */}
                <div>
                  <dt className="font-semibold text-gray-900 mb-1">
                    Event Name *
                  </dt>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editData?.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Event name"
                    />
                  ) : (
                    <dd className="text-lg font-medium">{eventData.name}</dd>
                  )}
                </div>

                {/* Category */}
                <div>
                  <dt className="font-semibold text-gray-900 mb-1">
                    Category *
                  </dt>
                  {isEditMode ? (
                    <DropdownSelect
                      value={editData?.categoryName || ""}
                      onChange={(value) =>
                        handleInputChange("categoryName", value)
                      }
                      options={categoryOptions}
                      placeholder="Select category"
                      className="w-full"
                    />
                  ) : (
                    <dd className="capitalize">{eventData.category?.name}</dd>
                  )}
                </div>

                {/* Status */}
                <div>
                  <dt className="font-semibold text-gray-900 mb-1">Status</dt>
                  <dd>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        eventData.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : eventData.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : eventData.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {eventData.status}
                    </span>
                  </dd>
                </div>

                {/* Capacity */}
                <div>
                  <dt className="font-semibold text-gray-900 mb-1">
                    Maximum Capacity *
                  </dt>
                  {isEditMode ? (
                    <input
                      type="number"
                      value={editData?.capacity || ""}
                      onChange={(e) =>
                        handleInputChange("capacity", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Maximum volunteers"
                      min="1"
                    />
                  ) : (
                    <dd className="text-gray-600">
                      {eventData.capacity} volunteers
                    </dd>
                  )}
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="font-semibold text-gray-900 mb-1">
                      Start Time *
                    </dt>
                    {isEditMode ? (
                      <input
                        type="datetime-local"
                        value={editData?.startTime || ""}
                        onChange={(e) =>
                          handleInputChange("startTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <dd>{new Date(eventData.startTime).toLocaleString()}</dd>
                    )}
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-900 mb-1">
                      End Time *
                    </dt>
                    {isEditMode ? (
                      <input
                        type="datetime-local"
                        value={editData?.endTime || ""}
                        onChange={(e) =>
                          handleInputChange("endTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <dd>{new Date(eventData.endTime).toLocaleString()}</dd>
                    )}
                  </div>
                </div>

                {/* Registration Deadline */}
                <div>
                  <dt className="font-semibold text-gray-900 mb-1">
                    Registration Deadline *
                  </dt>
                  {isEditMode ? (
                    <input
                      type="datetime-local"
                      value={editData?.registrationDeadline || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "registrationDeadline",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <dd>
                      {new Date(
                        eventData.registrationDeadline
                      ).toLocaleString()}
                    </dd>
                  )}
                </div>

                {/* Location */}
                <div>
                  <dt className="font-semibold text-gray-900 mb-2">
                    Location *
                  </dt>
                  {isEditMode ? (
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={editData?.street || ""}
                        onChange={(e) =>
                          handleInputChange("street", e.target.value)
                        }
                        placeholder="Street"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={editData?.district || ""}
                        onChange={(e) =>
                          handleInputChange("district", e.target.value)
                        }
                        placeholder="District"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={editData?.province || ""}
                        onChange={(e) =>
                          handleInputChange("province", e.target.value)
                        }
                        placeholder="Province"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <dd>{locationString}</dd>
                  )}
                </div>
              </dl>

              {/* Description */}
              <div className="relative">
                <dt className="font-semibold text-gray-900 mb-2">
                  Description *
                </dt>
                {isEditMode ? (
                  <textarea
                    value={editData?.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Event description..."
                  />
                ) : (
                  <>
                    <div
                      ref={descriptionRef}
                      className={`text-gray-700 leading-relaxed transition-all duration-300 overflow-hidden ${
                        showMore ? "" : "line-clamp-4"
                      }`}
                    >
                      {eventData.description}
                    </div>
                    {shouldShowButton && (
                      <button
                        onClick={() => setShowMore(!showMore)}
                        className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm focus:outline-none transition-colors"
                      >
                        {showMore ? "Show less" : "Show more"}
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons in Edit Mode */}
              {isEditMode && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateEventMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaSave />{" "}
                    {updateEventMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex flex-col gap-5 font-medium font-jost">
              {!isEditMode && (
                <div className="border-gray-300 border rounded-xl p-2 cursor-pointer hover:bg-gray-50 transition">
                  <button
                    className="flex flex-row items-center gap-5 cursor-pointer w-full"
                    onClick={handleEdit}
                  >
                    <span>
                      <FaEdit />
                    </span>
                    Edit Event Information
                  </button>
                </div>
              )}
              <div className="border-gray-300 border rounded-xl p-2 cursor-pointer hover:bg-gray-50 transition">
                <button className="flex flex-row items-center gap-5 cursor-pointer">
                  <span>
                    <XCircle />
                  </span>
                  Close Register{" "}
                </button>
              </div>
              <div className="border border-red-200 rounded-xl p-2 bg-red-600/80 text-white cursor-pointer hover:bg-red-600 transition">
                <button className="flex flex-row items-center gap-5 cursor-pointer">
                  <span>
                    <TriangleAlert className="" />
                  </span>
                  Delete Event{" "}
                </button>
              </div>
              <div className="border-gray-300 border rounded-xl p-2 cursor-pointer hover:bg-gray-50 transition">
                <button className="flex flex-row items-center gap-5 cursor-pointer">
                  <span>
                    <ScrollText />
                  </span>
                  View public event{" "}
                </button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  Event Location
                </p>
                <p className="text-sm text-gray-500">{locationString}</p>
              </div>
              <MapPreview
                lat={coordinates?.lat || null}
                lon={coordinates?.lon || null}
                address={locationString}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OverviewEventManager;
