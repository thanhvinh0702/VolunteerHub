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
      className="flex items-center gap-3 w-full bg-white p-4 border-t border-blue-100"
    >
      <div className="flex flex-1 relative">
        <input
          ref={inputRef}
          value={value}
          onChange={onChange}
          className="w-full bg-blue-50 rounded-full pl-5 pr-24 py-3 text-base outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white transition-all placeholder-gray-400 font-medium"
          placeholder="Chia sẻ suy nghĩ của bạn..."
        />
        <div className="absolute inset-y-0 right-2 flex items-center space-x-3">
          {upLoadImg && (
            <button
              type="button"
              onClick={upLoadImg}
              className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
              title="Thêm ảnh"
            >
              <Camera className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
            disabled={!value.trim()}
            title="Gửi bình luận"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
}
