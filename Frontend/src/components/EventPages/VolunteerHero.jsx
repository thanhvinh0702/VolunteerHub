import React from "react";

function VolunteerCard({ user, index }) {
  return (
    <div
      className={`flex w-8 h-8 flex-row bg-amber-300 rounded-full overflow-hidden ring-1 outline-1 z-${index} ring-white outline-white`}
    >
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function VolunteerHero({ userList }) {
  return (
    <div>
      <div className="flex -space-x-4 flex-row gap-2">
        {userList.slice(0, 8).map((user, index) => (
          <VolunteerCard key={user.id} user={user} index={100 - index} />
        ))}
        {userList.length > 8 ? (
          <div
            className={`flex w-8 h-8 flex-row bg-gray-600 rounded-full overflow-hidden ring-1 outline-1 z-${1000} ring-white outline-white text-center flex items-center p-1`}
          >
            <div className="text-white text-sm">+{userList.length - 8}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default VolunteerHero;
