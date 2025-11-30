import React from "react";
import ModalActivity from "../ModalActivity/ModalActivity";
import { FiUsers } from "react-icons/fi";
import { icon } from "leaflet";

function GrowthMetric() {
  const dumpData = [
    {
      label: "New Signups",
      value: "+87",
      icon: <FiUsers />,
    },
    {
      label: "Events Created",
      value: "+23",
      icon: <FiUsers />,
    },
    {
      label: "Volunteer Hours",
      value: "+1,847",
      icon: <FiUsers />,
    },
    {
      label: "User Retention",
      value: "92%",
      icon: <FiUsers />,
    },
  ];
  return (
    <div>
      <ModalActivity title="Growth Metric" subtile="Growth Metric">
        <div className="flex flex-col gap-2 max-sm:gap-1 max-sm:text-sm px-8 py-2">
          {dumpData.map((item) => (
            <div key={item.label} className="flex flex-row justify-between">
              <div className="text-gray-500">{item.label}</div>
              <div className="flex flex-row gap-2 items-center ">
                <span className="">{item.value}</span>
                <span className="text-green-500">{item.icon}</span>
              </div>
            </div>
          ))}
        </div>
      </ModalActivity>
    </div>
  );
}

export default GrowthMetric;
