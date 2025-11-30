import { useState } from "react";
import RegistrationFilters from "../Registration/RegistrationFilters";
import RegistrationTableForAd from "./RegistrationTableForAd";
import RegistrationDetailModal from "../Registration/RegistrationDetailModal";
import EventVolunteerRegisterFilter from "./EventVolunteerRegisterFilter";

export default function EventVolunteerRegister() {
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
          <EventVolunteerRegisterFilter
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        <div className="overflow-x-auto">
          <RegistrationTableForAd
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
