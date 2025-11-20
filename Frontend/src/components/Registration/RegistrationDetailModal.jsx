export default function RegistrationDetailModal({ registration, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-900/60 bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white w-[500px] p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-8 text-center">
          Register Details
        </h3>

        <div className="space-y-3">
          <div className="flex flex-row gap-5">
            <div className="flex items-center">
              <img
                src={registration.avatar}
                alt={registration.name}
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div>
              <p>
                <b>Name:</b> {registration.name}
              </p>
              <p>
                <b>Email:</b> {registration.email}
              </p>
              <p>
                <b>Event:</b> {registration.eventName}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <b>Skills:</b>
            <div className="flex flex-row gap-2">
              {registration.skills.length > 0 &&
                registration.skills.map((item) => {
                  return (
                    <div className="text-sm border-gray-600 border w-fit rounded-2xl px-2">
                      {item}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>
              <b>Messages:</b>
            </p>
            <div className="bg-gray-200 p-2 rounded-2xl">
              {registration.message}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-red-400 text-white rounded">
            Reject
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
