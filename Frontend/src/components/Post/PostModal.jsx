import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import CommentItem from "./CommentItem";
import ImageLightbox from "./ImageLightbox";

export default function PostModal({
  open,
  post,
  startImageIndex = 0,
  initialOpenComments = false,
  onClose,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onReact,
}) {
  const [text, setText] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(startImageIndex);
  const commentsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => setLightboxIndex(startImageIndex), [startImageIndex, open]);
  useEffect(() => {
    if (open && initialOpenComments) {
      setTimeout(() => {
        commentsRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, initialOpenComments]);

  if (!post) return null;

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(post.id, { id: Date.now(), author: "Bạn", text });
    setText("");
  }

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{post.author.name}</h3>
          <p className="mt-2">{post.text}</p>

          {post.images.length > 0 && (
            <img
              src={post.images[0]}
              alt=""
              className="mt-3 w-full max-h-[60vh] object-cover rounded-md cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            />
          )}

          <div className="mt-4 flex items-center gap-4">
            <button onClick={() => onReact(post.id, "like")}>
              👍 {post.reactions.like}
            </button>
            <button onClick={() => onReact(post.id, "love")}>
              ❤️ {post.reactions.love}
            </button>
          </div>

          <div ref={commentsRef} className="mt-6 space-y-2">
            <h4 className="font-semibold">
              Bình luận ({post.comments.length})
            </h4>
            {post.comments.length === 0 ? (
              <div className="text-sm text-gray-500">
                Chưa có bình luận nào.
              </div>
            ) : (
              post.comments.map((c) => (
                <div
                  key={c.id}
                  className={`p-2 rounded ${
                    c.author === "Bạn" ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">{c.author}</span>
                    {c.author === "Bạn" && (
                      <div className="space-x-2 text-xs">
                        <button
                          onClick={() => {
                            const newText = prompt("Sửa bình luận:", c.text);
                            if (newText !== null)
                              onEditComment(post.id, c.id, newText);
                          }}
                        >
                          Sửa
                        </button>
                        <button onClick={() => onDeleteComment(post.id, c.id)}>
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                  <div>{c.text}</div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={submit} className="mt-4 flex gap-2">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 border p-2 rounded-md"
              placeholder="Viết bình luận..."
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Gửi
            </button>
          </form>
        </div>
      </Modal>

      <ImageLightbox
        images={post.images}
        open={lightboxOpen}
        startIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
