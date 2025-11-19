import React from "react";
import { UserPlus, ExternalLink, X } from "lucide-react"; // Ví dụ icon từ thư viện

const RequestCard = ({ data }) => {
  console.log(data);
  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm mb-3">
      {/* Thông tin User & Event bên trái */}
      <div className="flex items-center gap-3">
        <img
          src={data.user.avatar}
          alt={data.user.name}
          className="w-10 h-10 rounded-full bg-gray-100"
        />
        <div>
          <h4 className="font-semibold text-gray-900">{data.user.name}</h4>
          <p className="text-sm text-gray-500">{data.eventName}</p>
        </div>
      </div>

      {/* Nút hành động bên phải */}
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          onClick={() => console.log("Duyệt:", data.id)}
        >
          <UserPlus size={16} />
          Approve
        </button>

        <button
          className="px-4 py-2 bg-red-600 text-white border border-gray-200 rounded-lg text-sm font-medium transition-colors hover:scale-105 duration-150"
          onClick={() => console.log("Xem chi tiết:", data.id)}
        >
          <span className="flex flex-row items-center gap-2">
            Reject
            <span>
              {" "}
              <X />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
