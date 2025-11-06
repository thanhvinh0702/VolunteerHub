import DashBoardOverview from "../../components/Dashboard/DashBoardOverview";
import DashboardLayout from "../DashBoard/DashboardLayout";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardLayout />
      <DashBoardOverview />
    </div>
  );
}
