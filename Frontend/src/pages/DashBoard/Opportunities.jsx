import React from "react";
import Tabs from "../../components/Tabs.jsx/Tabs";
import UpcomingCard from "../../components/Dashboard/UpcomingCard";
import AppliedCard from "../../components/Dashboard/AppliedCard";
import CompleteCard from "../../components/Dashboard/CompleteCard";
import { mockApiFetch } from "./dumpapi";
import { useQueries } from "@tanstack/react-query";
import Pagination from "@mui/material/Pagination";

const PAGE_SIZE = 4;
const TABS = ["applied", "upcoming", "completed"];

const ComponentMap = {
  applied: AppliedCard,
  upcoming: UpcomingCard,
  completed: CompleteCard,
};

export default function Opportunities() {
  const [activeTab, setActiveTab] = React.useState("applied");
  const [pageState, setPageState] = React.useState({
    applied: 1,
    upcoming: 1,
    completed: 1,
  });

  // Prefetch all 3 tabs in parallel
  const queries = useQueries({
    queries: TABS.map((tab) => ({
      queryKey: ["opportunities", tab, pageState[tab]],
      queryFn: () =>
        mockApiFetch(`/api/opportunities/${tab}`, {
          page: pageState[tab],
          pageSize: PAGE_SIZE,
        }),
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
      refetchOnWindowFocus: false,
    })),
  });

  // Get current tab's query result
  const tabIndex = TABS.indexOf(activeTab);
  const { data, isLoading } = queries[tabIndex];

  const CardComponent = ComponentMap[activeTab];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handlePageChange = (event, value) => {
    setPageState((prev) => ({ ...prev, [activeTab]: value }));
  };
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
          onChange={handleTabChange}
        />
        <div className="mt-6 p-2 flex gap-5 flex-col">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div key={activeTab} className="flex gap-5 flex-col">
                {data?.items?.map((item) => (
                  <CardComponent key={`${activeTab}-${item.id}`} {...item} />
                ))}
              </div>
              <div className="flex justify-center pt-2">
                <Pagination
                  count={data?.totalPages ?? 1}
                  page={pageState[activeTab]}
                  onChange={handlePageChange}
                  color="primary"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
