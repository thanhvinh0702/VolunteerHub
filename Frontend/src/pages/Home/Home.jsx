import { useState } from "react";
import DashBoardOverview from "../../components/Dashboard/DashBoardOverview";
import ModalConfirm from "../../components/Modal/ModalConfirm";
import DashboardLayout from "../DashBoard/DashboardLayout";

export default function Home() {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    alert("DELETE");
  };
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardLayout />
      <DashBoardOverview />
    </div>
  );
}
