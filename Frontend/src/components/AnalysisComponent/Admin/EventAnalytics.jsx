import React from "react";
import { Calendar, Play, Users, CheckCircle } from "lucide-react";

const stats = [
  { label: "Total Events", value: "1234", icon: Calendar },
  { label: "Active Events", value: "45", icon: Play },
  { label: "Avg. Participants", value: "18.7", icon: Users },
  { label: "Completion Rate", value: "94.2%", icon: CheckCircle },
];

function EventAnalytics() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Event Analytics</h3>
      
      <div className="space-y-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{stat.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EventAnalytics;


