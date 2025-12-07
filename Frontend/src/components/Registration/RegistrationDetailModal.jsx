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
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                NA
              </div>
            </div>
            <div className="flex-1">
              <p className="mb-1">
                <b>Name:</b>{" "}
                <span className="text-gray-500 italic">Chưa có</span>
              </p>
              <p className="mb-1">
                <b>Email:</b>{" "}
                <span className="text-gray-500 italic">Chưa có</span>
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
              <b>Registration ID:</b> #{registration.id}
            </p>
            <p className="mb-2">
              <b>Status:</b>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  registration.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : registration.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : registration.status === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {registration.status}
              </span>
            </p>
            <p className="mb-2">
              <b>Created At:</b> {formatDate(registration.createdAt)}
            </p>
            <p className="mb-2">
              <b>Updated At:</b> {formatDate(registration.updatedAt)}
            </p>
          </div>

          <div className="flex flex-col gap-2 border-t pt-4">
            <b>Skills:</b>
            {/* <div className="flex flex-row gap-2">
              {registration.skills.length > 0 &&
                registration.skills.map((item) => {
                  return (
                    <div className="text-sm border-gray-600 border w-fit rounded-2xl px-2">
                      {item}
                    </div>
                  );
                })}
            </div> */}
          </div>

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
                reviewMutation.isPending || registration.status !== "PENDING"
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
              reviewMutation.isPending || registration.status !== "PENDING"
            }
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reviewMutation.isPending ? "Processing..." : "Reject"}
          </button>
          <button
            onClick={handleApprove}
            disabled={
              reviewMutation.isPending || registration.status !== "PENDING"
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
