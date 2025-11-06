// DashboardLayout.jsx
import Tabs from "../../components/Tabs.jsx/Tabs";
import { useAuth } from "../../hook/useAuth";

const headerItems = [
  { key: "overview", label: "Overview", to: "/home" },
  { key: "opps", label: "Opportunities", to: "/dashboard/opportunities" },
  { key: "activity", label: "Activity Log", to: "/dashboard/activity" },
  { key: "badges", label: "Badges", to: "/dashboard/badges" },
  {
    key: "notifications",
    label: "Notifications",
    to: "/dashboard/notifications",
  },
];

export default function DashboardLayout() {
  const { user } = useAuth();
  console.log(user);
  return (
    <header className="mb-6">
      <div className="flex flex-col gap-2 my-8">
        <p className="text-4xl font-bold">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%] ">
            Welcome back
          </span>
          , {user?.name}
        </p>

        <p className="text-gray-500">
          Track your volunteer activities and discover new opportunities.
        </p>
      </div>

      {/* asLink=true => NavLink used, URL changes */}
      <div className="mt-6">
        <Tabs items={headerItems} asLink variant="header" />
      </div>
    </header>
  );
}
