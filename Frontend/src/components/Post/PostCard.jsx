import React from "react";
import ReactionBar from "./ReactionBar";

export default function PostCard({ post, onOpenPost, onReactLocal }) {
  const INLINE_COUNT = 5;
  const inlineComments = post.comments.slice(0, INLINE_COUNT);
  const moreCount = Math.max(0, post.comments.length - INLINE_COUNT);

  const openModal = (options = {}) => onOpenPost(post, options);

  return (
    <article className="rounded-lg shadow-sm p-4 mb-6">
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium">
          {post.author.name[0]}
        </div>
        <div>
          <div className="font-semibold">{post.author.name}</div>
          <div className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
      </header>

      <p className="mt-3 text-sm text-gray-800">{post.text}</p>

      {post.images.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {post.images.slice(0, 4).map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-full h-48 object-cover rounded-md cursor-pointer"
              onClick={() => openModal({ startImageIndex: i })}
            />
          ))}
          {post.images.length > 4 && (
            <div className="relative">
              <img
                src={post.images[4]}
                alt=""
                className="w-full h-48 object-cover rounded-md"
              />
              <div
                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-lg font-semibold rounded-md cursor-pointer"
                onClick={() => openModal({ startImageIndex: 4 })}
              >
                +{post.images.length - 4}
              </div>
            </div>
          )}
        </div>
      )}

      <footer className="mt-3 flex items-center justify-between text-sm text-gray-600">
        <ReactionBar
          reactions={post.reactions}
          userReaction={post.userReaction}
          onReact={(t) => onReactLocal(post.id, t)}
        />
        <button
          onClick={() => openModal({ openComments: true })}
          className="text-gray-600 hover:text-blue-600"
        >
          💬 {post.comments.length}
        </button>
      </footer>

      {/* 5 comment */}
      {inlineComments.length > 0 && (
        <div className="border-t pt-2 space-y-1">
          {inlineComments.map((c) => {
            // Mock user
            const getUserName = (ownerId) => {
              const userMap = {
                10: "Bạn",
                1: "Nguyễn Văn A",
                2: "Trần Thị B",
                3: "Lê Văn C",
                4: "Phạm Thị D",
                5: "Hoàng Văn E",
                6: "Vũ Thị F",
                7: "Đặng Văn G",
                8: "Bùi Thị H",
              };
              return userMap[ownerId] || `User ${ownerId}`;
            };

            return (
              <div key={c.id} className="text-sm">
                <span className="font-semibold">
                  {getUserName(c.ownerId)}:{" "}
                </span>
                {c.content}
              </div>
            );
          })}
          {moreCount > 0 && (
            <button
              onClick={() => openModal({ openComments: true })}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Show more comment ({moreCount})
            </button>
          )}
        </div>
      )}
    </article>
  );
}
