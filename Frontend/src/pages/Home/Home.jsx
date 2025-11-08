import DashBoardOverview from "../../components/Dashboard/DashBoardOverview";
import ModalConfirm from "../../components/Modal/ModalConfirm";
import DashboardLayout from "../DashBoard/DashboardLayout";

import QuickActionsUser from "../../components/QuickActionButton/QuickActionsUser";
import UpcomingEvents from "../../components/ModalActivity/UpcomingEvents";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col gap-10">
      <DashboardLayout />
      <DashBoardOverview />
      <QuickActionsUser />
      <UpcomingEvents />
    </div>
  );
}
