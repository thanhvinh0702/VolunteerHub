import React from "react";

export default function CommentItem({ c }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
        {c.author[0]}
      </div>
      <div className="bg-gray-100 p-2 rounded-lg flex-1">
        <div className="text-sm font-semibold">{c.author}</div>
        <div className="text-sm">{c.text}</div>
      </div>
    </div>
  );
}
