export default function RegistrationStatusBadge({ status }) {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 text-sm rounded-lg font-semibold ${map[status]}`}
    >
      {status === "pending" && "Pending"}
      {status === "approved" && "Accept"}
      {status === "rejected" && "Reject"}
    </span>
  );
}
