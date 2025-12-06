import { Calendar } from "lucide-react";
import RegistrationStatusBadge from "../Registration/RegistrationStatusBadge";

export default function RegistrationRowSingle({ reg, onSelect }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <tr className="border-b border-b-gray-600/20 hover:bg-gray-50 max-sm:text-sm">
      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-medium">Chưa có</span>
          <span className="text-xs text-gray-500 font-mono">
            User ID: {reg.userId?.substring(0, 8)}...
          </span>
        </div>
      </td>

      <td className="p-4 inline-flex gap-2 items-center">
        <span>
          <Calendar className="w-4 h-4 text-blue-400" />
        </span>
        <span>{formatDate(reg.createdAt)}</span>
      </td>
      <td className="p-4">
        <RegistrationStatusBadge status={reg.status?.toLowerCase() || "pending"} />
      </td>
      <td className="p-4">
        <button className="text-blue-600 hover:underline" onClick={onSelect}>
          View details
        </button>
      </td>
    </tr>
  );
}
