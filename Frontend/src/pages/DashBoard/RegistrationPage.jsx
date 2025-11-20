import { useState } from "react";
import RegistrationFilters from "../../components/Registration/RegistrationFilters";
import RegistrationTable from "../../components/Registration/RegistrationTable";
import RegistrationDetailModal from "../../components/Registration/RegistrationDetailModal";
export default function RegistrationPage() {
  const [filters, setFilters] = useState({
    event: "all",
    status: "pending",
    search: "",
  });

  const [selectedReg, setSelectedReg] = useState(null);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm ">
      <div className={`${selectedReg ? "blur" : ""} flex flex-col gap-5`}>
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold text-gray-900">
            Register manager
          </h3>
          <p className="text-gray-500">
            Manage all your volunteer registration
          </p>
        </div>

        <div className="">
          <RegistrationFilters filters={filters} setFilters={setFilters} />
        </div>

        <div className="overflow-x-auto">
          <RegistrationTable
            filters={filters}
            onSelect={(reg) => setSelectedReg(reg)}
          />
        </div>
      </div>

      {selectedReg && (
        <RegistrationDetailModal
          registration={selectedReg}
          onClose={() => setSelectedReg(null)}
        />
      )}
    </div>
  );
}
