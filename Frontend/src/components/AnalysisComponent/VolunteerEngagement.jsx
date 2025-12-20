import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const data = [
  { label: "Application Rate", value: "78%", trend: "up", change: "+5%" },
  { label: "Approval Rate", value: "85%", trend: "up", change: "+3%" },
  { label: "Retention Rate", value: "92%", trend: "up", change: "+8%" },
  { label: "Avg. Response Time", value: "2.3 days", trend: "down", change: "-0.5d" },
];

function VolunteerEngagement() {
  const getTrendIcon = (trend) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend) => {
    if (trend === "up") return "text-green-600 bg-green-50";
    if (trend === "down") return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Volunteer Engagement</h3>
      
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-600">{item.label}</p>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(item.trend)}`}>
                {getTrendIcon(item.trend)}
                <span>{item.change}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            
            {/* Progress bar for percentage values */}
            {item.value.includes("%") && (
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: item.value }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 mb-1">Overall Engagement</p>
            <p className="text-xl font-bold text-blue-600">Excellent</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VolunteerEngagement;


