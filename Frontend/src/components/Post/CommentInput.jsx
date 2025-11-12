import React from "react";
import { Camera, Send } from "lucide-react";

export default function CommentInput({
  value,
  onChange,
  onSubmit,
  inputRef,
  upLoadImg,
  deleteImg,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-3 w-full bg-white p-5"
    >
      <div className="flex flex-1 relative">
        <input
          ref={inputRef}
          value={value}
          onChange={onChange}
          className="w-full bg-gray-100 rounded-full pl-4 pr-28 py-2 text-sm outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition"
          placeholder="Viết bình luận của bạn..."
        />
        <div className="absolute inset-y-0 right-3 flex items-center space-x-5 text-gray-500">
          <button
            type="submit"
            className=" text-blue w-5 h-5 disabled:text-gray-200 disabled:cursor-not-allowed"
            disabled={!value.trim()}
          >
            <Camera />
          </button>
          <button
            type="submit"
            className=" text-blue w-5 h-5 disabled:text-gray-200 disabled:cursor-not-allowed"
            disabled={!value.trim()}
          >
            <Send />
          </button>
        </div>
      </div>
    </form>
  );
}
