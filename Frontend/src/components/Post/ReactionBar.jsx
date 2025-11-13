// ReactionBar.jsx
import React from "react";
import ReactionButton from "./ReactionButton";
import { FaCommentAlt, FaShare } from "react-icons/fa";

const REACTION_ICONS = {
  like: "👍",
  love: "❤️",
  haha: "😂",
  wow: "😮",
  sad: "😢",
  angry: "😡",
};

export default function ReactionBar({
  post,
  onReact,
  onCommentClick,
  onShare,
  compact = false,
}) {
  if (!post) return null;

  const reactionEntries = Object.entries(post.reactions ?? {}).filter(
    ([, count]) => typeof count === "number"
  );
  const commentCount = Array.isArray(post.comments)
    ? post.comments.length
    : post.comments ?? 0;
  const commentLabel = compact
    ? String(commentCount ?? 0)
    : `Comments (${commentCount ?? 0})`;

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
      <div className="flex flex-row gap-1 items-stretch">
        <ReactionButton
          initialReaction={post.userReaction ?? null}
          onReact={(r) => onReact?.(post.id, r)}
          small={compact}
        />
        {!compact && reactionEntries.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            {reactionEntries.map(([key, count]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 font-medium"
              >
                <span>{REACTION_ICONS[key] ?? "👍"}</span>
                <span>{count}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => onCommentClick?.(post.id)}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100"
      >
        <FaCommentAlt className="w-4 h-4" />
        {commentLabel && (
          <span className="font-semibold">
            {compact ? commentLabel : commentLabel}
          </span>
        )}
      </button>

      {onShare && (
        <button
          onClick={() => onShare?.(post.id)}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100"
        >
          <FaShare className="w-4 h-4" />
          <span className="font-semibold">{compact ? "" : "Share"}</span>
        </button>
      )}
    </div>
  );
}
