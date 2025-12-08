import { useState } from "react";
import { useReviewRegistration } from "../../hook/useRegistration";

export default function RegistrationDetailModal({ registration, onClose }) {
  const [note, setNote] = useState("");

  const reviewMutation = useReviewRegistration();

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReject = () => {
    reviewMutation.mutate(
      {
        eventId: registration.eventId,
        participantId: registration.userId,
        status: "REJECTED",
        note: note.trim() || null,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleApprove = () => {
    reviewMutation.mutate(
      {
        eventId: registration.eventId,
        participantId: registration.userId,
        status: "APPROVED",
        note: note.trim() || null,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-[500px] p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-8 text-center">
          Registration Details
        </h3>

        <div className="space-y-4">
          <div className="flex flex-row gap-5">
            <div className="flex items-center">
              {registration.avatarUrl ? (
                <img
                  src={registration.avatarUrl}
                  alt={registration.fullName || "User"}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                  {registration.fullName?.charAt(0)?.toUpperCase() || "NA"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="mb-1">
                <b>Name:</b>{" "}
                {registration.fullName || (
                  <span className="text-gray-500 italic">Chưa có</span>
                )}
              </p>
              <p className="mb-1">
                <b>Email:</b>{" "}
                {registration.email || (
                  <span className="text-gray-500 italic">Chưa có</span>
                )}
              </p>
              <p className="mb-1">
                <b>User ID:</b>{" "}
                <span className="text-xs font-mono text-gray-600">
                  {registration.userId}
                </span>
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="mb-2">
              <b>Event:</b>{" "}
              {registration.eventName || (
                <span className="text-gray-500 italic">Unknown Event</span>
              )}
            </p>
            <p className="mb-2">
              <b>Registration ID:</b> #{registration.registrationId}
            </p>
            <p className="mb-2">
              <b>Status:</b>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  registration.registrationStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : registration.registrationStatus === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : registration.registrationStatus === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {registration.registrationStatus}
              </span>
            </p>
            <p className="mb-2">
              <b>Registered At:</b> {formatDate(registration.registeredAt)}
            </p>
            {registration.phoneNumber && (
              <p className="mb-2">
                <b>Phone:</b> {registration.phoneNumber}
              </p>
            )}
            {registration.address && (
              <p className="mb-2">
                <b>Address:</b> {registration.address}
              </p>
            )}
          </div>

          {registration.skills && (
            <div className="flex flex-col gap-2 border-t pt-4">
              <b>Skills:</b>
              <div className="flex flex-row gap-2 flex-wrap">
                {registration.skills.length > 0 ? (
                  registration.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="text-sm border-gray-600 border w-fit rounded-2xl px-3 py-1"
                    >
                      {skill}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 italic text-sm">
                    No skills listed
                  </span>
                )}
              </div>
            </div>
          )}

          {registration.bio && (
            <div className="flex flex-col gap-2 border-t pt-4">
              <b>Bio:</b>
              <div className="bg-gray-100 p-3 rounded-lg text-sm">
                {registration.bio}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 border-t pt-4">
            <p>
              <b>Note:</b>
            </p>
            <div className="bg-gray-100 p-3 rounded-lg text-sm">
              {registration.note || (
                <span className="text-gray-500 italic">Chưa có</span>
              )}
            </div>
          </div>

          {/* Review Note Input */}
          <div className="flex flex-col gap-2 border-t pt-4">
            <p>
              <b>Review Note (Optional):</b>
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter note for approval or rejection (optional)..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={
                reviewMutation.isPending ||
                registration.registrationStatus !== "PENDING"
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition"
            onClick={onClose}
            disabled={reviewMutation.isPending}
          >
            Close
          </button>
          <button
            onClick={handleReject}
            disabled={
              reviewMutation.isPending ||
              registration.registrationStatus !== "PENDING"
            }
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reviewMutation.isPending ? "Processing..." : "Reject"}
          </button>
          <button
            onClick={handleApprove}
            disabled={
              reviewMutation.isPending ||
              registration.registrationStatus !== "PENDING"
            }
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reviewMutation.isPending ? "Processing..." : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
}
