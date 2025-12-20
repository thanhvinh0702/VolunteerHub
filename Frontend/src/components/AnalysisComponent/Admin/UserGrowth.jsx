import React from "react";
import { Users, Building2, TrendingUp, UserCheck } from "lucide-react";

const stats = [
  { label: "Volunteers", value: "2,847", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
  { label: "Organizations", value: "156", icon: Building2, color: "text-purple-600", bgColor: "bg-purple-50" },
  { label: "Monthly Growth", value: "+12.5%", icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50", isGrowth: true },
  { label: "Retention Rate", value: "87.3%", icon: UserCheck, color: "text-orange-600", bgColor: "bg-orange-50" },
];

function UserGrowth() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">User Growth</h3>
      
      <div className="space-y-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <span className={`text-lg font-bold ${stat.isGrowth ? stat.color : 'text-gray-900'}`}>
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserGrowth;


