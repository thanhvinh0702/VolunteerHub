import React, { useEffect } from "react";
import Tabs from "../../components/Tabs.jsx/Tabs";
import UpcomingCard from "../../components/Dashboard/UpcomingCard";
import AppliedCard from "../../components/Dashboard/AppliedCard";
import CompleteCard from "../../components/Dashboard/CompleteCard";
import { mockApiFetch } from "./dumpapi";
import { useQuery } from "@tanstack/react-query";
const ComponentMap = {
  applied: AppliedCard,
  upcoming: UpcomingCard,
  completed: CompleteCard,
};

export default function Opportunities() {
  const [activeTab, setActiveTab] = React.useState("applied");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["opportunities", activeTab],
    queryFn: () => mockApiFetch(`/api/opportunities/${activeTab}`),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const CardComponent = ComponentMap[activeTab];
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm gap-4 flex flex-col">
      <div>
        <h4 className="text-2xl font-semibold mb-1">Opportunities</h4>
        <p className="text-gray-500">Nội dung cơ hội sẽ hiển thị ở đây.</p>
      </div>
      <div>
        <Tabs
          items={[
            { key: "applied", label: "Applied" },
            { key: "upcoming", label: "Upcoming" },
            { key: "completed", label: "Completed" },
          ]}
          activeKey={activeTab}
          onChange={setActiveTab}
        />
        <div className="mt-6 p-2 flex gap-5 flex-col">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex  gap-5 flex-col">
              {data.map((item) => (
                <CardComponent key={item.id} {...item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
