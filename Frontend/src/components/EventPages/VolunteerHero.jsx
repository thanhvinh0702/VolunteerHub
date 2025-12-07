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

function VolunteerHero({ userList, totalCount, hasMore, onShowMore }) {
  // Nếu chỉ có 1 người, hiển thị với tên và avatar
  if (userList.length === 1) {
    const user = userList[0];
    return (
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 via-pink-50 to-fuchsia-50 rounded-lg border border-purple-100">
        <img
          src={user.avatarUrl}
          alt={user.fullName}
          className="w-10 h-10 rounded-full ring-2 ring-purple-300"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">{user.fullName}</p>
          <p className="text-xs text-gray-500">First volunteer joined! 🎉</p>
        </div>
      </div>
    );
  }

  // Nếu có 2-3 người, hiển thị với một chút spacing
  if (userList.length <= 3) {
    return (
      <div>
        <div className="flex -space-x-2 flex-row items-center">
          {userList.map((user, index) => (
            <VolunteerCard key={user.id} user={user} index={100 - index} />
          ))}
          {hasMore && (
            <button
              onClick={onShowMore}
              className="ml-2 flex w-8 h-8 flex-row bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-600 rounded-full ring-1 ring-white items-center justify-center transition-all duration-200 cursor-pointer"
              title="Show more volunteers"
            >
              <div className="text-white text-xs font-semibold">
                +{totalCount - userList.length}
              </div>
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {totalCount} volunteer{totalCount > 1 ? "s" : ""} joined
        </p>
      </div>
    );
  }

  // Nếu có nhiều người (4+), hiển thị như cũ với overlap nhiều hơn
  return (
    <div>
      <div className="flex -space-x-4 flex-row gap-2 items-center">
        {userList.map((user, index) => (
          <VolunteerCard key={user.id} user={user} index={100 - index} />
        ))}
        {hasMore && (
          <button
            onClick={onShowMore}
            className="flex w-8 h-8 flex-row bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-600 rounded-full ring-1 ring-white items-center justify-center transition-all duration-200 cursor-pointer"
            title="Show more volunteers"
          >
            <div className="text-white text-xs font-semibold">
              +{totalCount - userList.length}
            </div>
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {totalCount} volunteers joined
      </p>
    </div>
  );
}

export default VolunteerHero;
