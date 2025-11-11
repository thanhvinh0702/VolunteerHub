import React from "react";
import { Heart, ThumbsUp } from "lucide-react";

export default function ReactionBar({ reactions, userReaction, onReact }) {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <button
        onClick={() => onReact("like")}
        className={`flex items-center gap-1 hover:text-blue-600 ${
          userReaction === "like" ? "text-blue-600 font-semibold" : ""
        }`}
      >
        <ThumbsUp className="w-4 h-4" /> {reactions.like}
      </button>
      <button
        onClick={() => onReact("love")}
        className={`flex items-center gap-1 hover:text-red-600 ${
          userReaction === "love" ? "text-red-600 font-semibold" : ""
        }`}
      >
        <Heart className="w-4 h-4" /> {reactions.love}
      </button>
    </div>
  );
}
