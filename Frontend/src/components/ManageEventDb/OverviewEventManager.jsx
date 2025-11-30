import React, { useState, useEffect, useRef } from "react";
import { dashboardConfig } from "../../constant/dashboardConfig";
import EventCard from "../Dashboard/EventCard";
import Card from "../Card.jsx/Card";
import { FaEdit } from "react-icons/fa";
import { ScrollText, TriangleAlert, XCircle } from "lucide-react";
import { getCoordinates } from "../../utils/getCoordinates";
import MapPreview from "../Location/MapPreview";
function OverviewEventManager() {
  const [showMore, setShowMore] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const descriptionRef = useRef(null);
  const dump = {
    id: 1,
    category: "Environment",
    requiredSkills: ["Environmental Care", "Physical Fitness"],
    difficulty: "Easy",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis veritatis incidunt facere repellendus architecto nisi consequuntur asperiores magnam. Provident dicta inventore soluta eius qui hic. Eveniet non ex reprehenderit ut Consequatur consequuntur blanditiis expedita excepturi perspiciatis vero? Ea, eaque dolor alias veniam provident tempora nihil, exercitationem tenetur soluta praesentium numquam cum itaque aut deserunt! Sequi pariatur quis nemo corrupti cum!",
    capacity: {
      current: 12,
      max: 25,
    },
    startTime: "2025-11-21T08:00:00",
    endTime: "2025-11-21T10:00:00",
    location: "123 Nguyen Trai, Thanh Xuan, Ha Noi",
    registered: 12,
    availableSlots: 18,
    ownerName: "Ocean Care Foundation",
    status: "approved",
    imageUrl:
      "https://www.greatplacetowork.com/images/blog-images/articles/American-Express-Employees-Volunteer.webp",
    duration: "4 hours",
    minAge: 16,
    registrationDeadline: "2025-09-13T23:59:59.000Z",
    registrationStatus: "Closed",
    durationCancel: "24 hours",
  };
  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(descriptionRef.current).lineHeight
      );
      const maxHeight = lineHeight * 4;
      const actualHeight = descriptionRef.current.scrollHeight;
      setShouldShowButton(actualHeight > maxHeight);
    }
  }, [dump.description]);
  const cards = dashboardConfig["ORGANIZATION".toUpperCase()];
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCoordinates = async () => {
      try {
        const coords = await getCoordinates(dump.location);
        if (isMounted) {
          if (coords) {
            setCoordinates(coords);
            setMapError(null);
          } else {
            setMapError("Không tìm thấy vị trí trên bản đồ");
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
  }, [dump.location]);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-lg:gap-4 auto-rows-fr">
        {cards.map((item) => (
          <EventCard key={item.id} {...item} />
        ))}
      </div>
      <div className="rounded-xl grid grid-cols-3 gap-5 max-sm:flex max-sm:flex-col max-sm:gap-5">
        <div className="col-span-2 h-full">
          <Card>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xl font-semibold text-gray-900">
                  Event Details
                </p>
                <p className="text-gray-500 text-sm">
                  Complete information about this event
                </p>
              </div>

              <dl className="space-y-4 text-sm sm:text-base text-gray-700">
                <div>
                  <dt className="font-semibold text-gray-900">Location</dt>
                  <dd>{dump.location}</dd>
                </div>

                <div>
                  <dt className="font-semibold text-gray-900">Category</dt>
                  <dd>{dump.category}</dd>
                </div>

                <div>
                  <dt className="font-semibold text-gray-900">
                    Required Skills
                  </dt>
                  <dd>
                    {dump.requiredSkills?.length
                      ? dump.requiredSkills.join(", ")
                      : "Not specified"}
                  </dd>
                </div>

                <div className="flex flex-col gap-2">
                  <dt className="font-semibold text-gray-900">
                    Difficulty Level
                  </dt>
                  <dd>
                    <span className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-800">
                      {dump.difficulty}
                    </span>
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="font-semibold text-gray-900">
                    Volunteer Capacity
                  </dt>
                  <dd className="text-gray-500">
                    {dump.capacity.current} / {dump.capacity.max} volunteers
                    registered
                  </dd>
                  <div className="h-3 w-full rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-red-400"
                      style={{
                        width: `${
                          (dump.capacity.current / dump.capacity.max) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </dl>

              <div className="relative">
                <div
                  ref={descriptionRef}
                  className={`text-gray-700 leading-relaxed transition-all duration-300 overflow-hidden ${
                    showMore ? "" : "line-clamp-4"
                  }`}
                >
                  {dump.description}
                </div>
                {shouldShowButton && (
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm focus:outline-none transition-colors"
                  >
                    {showMore ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex flex-col gap-5 font-medium font-jost">
              <div className="border-gray-300 border rounded-xl p-2 cursor-pointer hover:bg-gray-50 transition">
                <button className="flex flex-row items-center gap-5 cursor-pointer">
                  <span>
                    <FaEdit />
                  </span>
                  Edit Event Infomation{" "}
                </button>
              </div>
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
                <p className="text-sm text-gray-500">{dump.location}</p>
              </div>
              {mapError ? (
                <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {mapError}
                </div>
              ) : (
                <MapPreview
                  lat={coordinates?.lat}
                  lon={coordinates?.lon}
                  address={dump.location}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OverviewEventManager;
