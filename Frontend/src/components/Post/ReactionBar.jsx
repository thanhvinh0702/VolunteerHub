// ReactionBar.jsx
import React from "react";
import ReactionButton from "./ReactionButton";
import { FaCommentAlt, FaShare } from "react-icons/fa";
import { useCreateReaction } from "../../hook/useCommunity";

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
  commentLength = 0,
  hiddenComment = false,
  eventId,
}) {
  // Hook for background API call
  const { mutate: createReaction } = useCreateReaction(eventId, post?.id);
  // Map UI keys to backend enum
  const toEnumType = (key) => {
    const map = {
      like: "LIKE",
      love: "LOVE",
      haha: "HAHA",
      wow: "WOW",
      sad: "SAD",
      angry: "ANGRY",
    };
    return map[key] || "LIKE";
  };

  if (!post) return null;

  const reactionEntries = Object.entries(post.reactions ?? {}).filter(
    ([, count]) => typeof count === "number"
  );
  return (
    <div className="flex flex-wrap items-center gap-3 text-gray-700">
      <div className="flex flex-row gap-2 items-stretch">
        <ReactionButton
          initialReaction={post.userReaction ?? null}
          onReact={(r) => {
            onReact?.(post.id, r);
            if (r && eventId && post?.id) {
              // Call API in background with payload { type: "..." }
              createReaction(toEnumType(r));
            }
          }}
          small={compact}
        />
        {!compact && reactionEntries.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 px-3 py-2 bg-blue-50 rounded-lg">
            {reactionEntries.map(([key, count]) => (
              <span
                key={key}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
              >
                <span className="text-lg">{REACTION_ICONS[key] ?? "👍"}</span>
                <span>{count}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {hiddenComment && (
        <button
          onClick={() => onCommentClick?.(post.id)}
          className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-600 font-semibold`}
        >
          <FaCommentAlt className="w-5 h-5" />
          {commentLength > 0 ? (
            <span>{`Comments (${commentLength})`}</span>
          ) : (
            "Comments"
          )}
        </button>
      )}

      {onShare && (
        <button
          onClick={() => onShare?.(post.id)}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-600 font-semibold"
        >
          <FaShare className="w-5 h-5" />
          <span>{compact ? "" : "Chia sẻ"}</span>
        </button>
      )}
    </div>
  );
}
