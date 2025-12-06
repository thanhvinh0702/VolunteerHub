import RegistrationRowSingle from "./RegistrationRowSingle";

export default function RegistrationTableForAd({
  registrations = [],
  filters,
  onSelect,
}) {
  // Filter data based on search
  const filteredData = registrations.filter((reg) => {
    const searchLower = filters.search.toLowerCase();
    return (
      reg.userId?.toLowerCase().includes(searchLower) ||
      reg.id?.toString().includes(searchLower)
    );
  });

  return (
    <div className="bg-white rounded-xl">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr className="border-b border-b-gray-600/20 text-base">
            <th className="p-4 text-left">Volunteer</th>
            <th className="p-4 text-left">Register Date</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((reg) => (
              <RegistrationRowSingle
                key={reg.id}
                reg={reg}
                onSelect={() => onSelect(reg)}
              />
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-8 text-center text-gray-500">
                No pending registrations found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
