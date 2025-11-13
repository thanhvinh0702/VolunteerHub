import React from "react";
import ReactionBar from "./ReactionBar";

export default function PostCard({ post, onOpenPost, onReactLocal }) {
  const INLINE_COUNT = 1;
  // const inlineComments = post.comments.slice(0, INLINE_COUNT);
  // const moreCount = Math.max(0, post.comments.length - INLINE_COUNT);

  const openModal = (options = {}) => onOpenPost(post, options);

  return (
    <article className="rounded-lg shadow-sm p-4 mb-6 bg-gray-200/80 ">
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

      <p className="mt-5 text-sm text-gray-800">{post.text}</p>
      {post.images.length == 1 && (
        <div
          className="mt-8 gap-2 bg-black p-2"
          onClick={() => openModal({ startImageIndex: 0 })}
        >
          {post.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-full h-90 object-cover rounded-md cursor-pointer"
            />
          ))}
        </div>
      )}
      {post.images.length == 2 && (
        <div
          className="rouned-xl mt-8 p-4 gap-5 bg-black grid grid-cols-2 max-sm:h-[15rem] md:h-[500px] flex items-center justify-center"
          onClick={() => openModal({ startImageIndex: 0 })}
        >
          {post.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-full h-full object-cover rounded-md cursor-pointer"
            />
          ))}
        </div>
      )}
      {post.images.length == 3 && (
        <div
          className="mt-8 px-5 py-8 gap-4 bg-black grid grid-cols-2 grid-rows-2 max-sm:h-[25rem] md:h-[500px]"
          onClick={() => openModal({ startImageIndex: 0 })}
        >
          <img
            src={post.images[0]}
            alt=""
            className="w-full h-full object-cover col-span-1 row-span-2 rounded-lg cursor-pointer"
          />

          <img
            src={post.images[1]}
            alt=""
            className="w-full h-full object-cover col-span-1 row-span-1 rounded-lg cursor-pointer"
          />

          <img
            src={post.images[2]}
            alt=""
            className="w-full h-full object-cover col-span-1 row-span-1 rounded-lg cursor-pointer"
          />
        </div>
      )}
      {post.images.length == 4 && (
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
        </div>
      )}
      {post.images.length > 4 && (
        <div className="mt-2 grid grid-cols-2 gap-2 bg-black p-2 rounded-xl">
          {post.images.slice(0, 3).map((src, i) => (
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

      <footer className="mt-5">
        <ReactionBar
          post={post}
          onReact={onReactLocal}
          onCommentClick={() => openModal({ openComments: true })}
        />
      </footer>
    </article>
  );
}
