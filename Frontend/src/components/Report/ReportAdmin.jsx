import { Calendar, User, Building, Download } from "lucide-react";
import React from "react";
import ReportCard from "./ReportCard";
const data = [
  {
    id: 1,
    name: "Export Volunteer",
    description: "Report 1 description",
    submit:
      "Download complete volunteer data including profiles, activity, and statistics",
    icon: <User />,
    onClick: () => console.log("Export Volunteer"),
    color: "text-blue-500",
    dataIncludeL: [
      "Users infomation (name, email, join data)",
      "Volunteer activity (hours, events, volunteers)",
      "Volunteer flags (hasWarning, isSuspended)",
      "Skills and exporience details",
      "Skills and exporience details",
    ],
  },
  {
    id: 2,
    name: "Export Events",
    description: "Report 2 description",
    submit:
      "Download complete event data including details, status, and participation",
    icon: <Calendar />,
    onClick: () => console.log("Export Events"),
    color: "text-green-500",
    dataIncludeL: [
      "Event details (name, description, date, time, location)",
      "Event participants (name, email, join data)",
      "Event activity (hours, events, volunteers)",
      "Event flags (hasWarning, isSuspended)",
      "Skills and exporience details",
    ],
  },
  {
    id: 3,
    name: "Export Organizations",
    description:
      "Download organization data including profiles and event activity",
    icon: <Building />,
    onClick: () => console.log("Export Organizations"),
    color: "text-red-500",
    isOrganization: true,
    dataIncludeL: [
      "Event details (name, description, date, time, location)",
      "Event participants (name, email, join data)",
      "Event activity (hours, events, volunteers)",
      "Event flags (hasWarning, isSuspended)",
      "Skills and exporience details",
    ],
  },
  {
    id: 4,
    name: "Export All Data",
    description: "Download complete user data including profiles and activity",
    icon: <Download />,
    onClick: () => console.log("Export All Data"),
    color: "text-yellow-500",
    isOrganization: true,
    dataIncludeL: [
      "Event details (name, description, date, time, location)",
      "Event participants (name, email, join data)",
      "Event activity (hours, events, volunteers)",
      "Event flags (hasWarning, isSuspended)",
      "Skills and exporience details",
    ],
  },
];
function ReportAdmin() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 max-md:flex max-md:flex-col max-lg:justify-between">
        {data.map((item) => (
          <ReportCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

export default ReportAdmin;
