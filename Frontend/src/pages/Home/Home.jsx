import DashBoardOverview from "../../components/Dashboard/DashBoardOverview";
import ModalConfirm from "../../components/Modal/ModalConfirm";
import DashboardLayout from "../DashBoard/DashboardLayout";

import QuickActionsUser from "../../components/QuickActionButton/QuickActionsUser";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col gap-10">
      <DashboardLayout />
      <DashBoardOverview />
      <QuickActionsUser />
    </div>
  );
}
