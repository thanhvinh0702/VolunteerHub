import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import ImageLightbox from "./ImageLightbox";
import { FaCommentAlt } from "react-icons/fa";
import { useNavbar } from "../../hook/useNavbar";

export default function PostModal({
  open,
  post,
  initialOpenComments = false,
  onClose,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onReact,
  startImageIndex,
}) {
  const [text, setText] = useState("");

  const commentsRef = useRef(null);
  const inputRef = useRef(null);
  const [showMore, setShowMore] = useState(false);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

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
    const newComment = {
      id: Date.now(),
      ownerId: "10", // Current user ID
      postId: post.id,
      parentId: null,
      content: text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onAddComment(post.id, newComment);
    setText("");
  }

  return (
    <div className="min-w-[95vw] min-h-[95vh] max-md:min-w-[100vw] max-md:min-h-[100vh]">
      <Modal open={open} onClose={onClose}>
        <div className="grid grid-cols-8 w-full h-full gap-1 md:overflow-hidden max-md:flex max-md:flex-col max-md:gap-4 max-md:p-4 max-md:overflow-y-auto">
          <div className="md:col-span-6 flex justify-center items-center bg-black md:rounded-l-lg max-md:rounded-lg md:h-full max-md:h-auto">
            <div className="w-full h-full">
              <ImageLightbox
                images={post.images}
                startIndex={startImageIndex}
              />
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col bg-white md:rounded-r-lg max-md:rounded-lg md:h-full md:overflow-hidden">
            <div className="md:flex-1 md:overflow-y-auto px-6 py-4 pr-4 max-md:px-4 max-md:py-4">
              <div className="flex flex-col gap-2 lg:mt-10 max-md:mt-4">
                <div className="flex items-center gap-2 flex-row">
                  <div className="flex items-center gap-2 flex-row">
                    <img
                      src={"https://api.dicebear.com/7.x/avataaars/svg?seed=b"}
                      alt=""
                      className="object-cover w-12 h-12 rounded-full bg-red-400"
                    />
                  </div>
                  <div className="text-lg text-black">
                    <p>{post.author.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="">
                  <p
                    className={`text-start line-clamp-5 ${
                      showMore ? "line-clamp-none" : ""
                    }`}
                  >
                    {post.text}
                  </p>
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={toggleShowMore}
                  >
                    {showMore ? "Show less" : "Show more"}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-around gap-4">
                <div>
                  <button onClick={() => onReact(post.id, "like")}>
                    👍 {post.reactions.like}
                  </button>
                  <button onClick={() => onReact(post.id, "love")}>
                    ❤️ {post.reactions.love}
                  </button>
                </div>
                <div className="text-gray-600">
                  <button onClick={() => onReact(post.id, "love")}>
                    <p className="inline-flex items-center gap-2">
                      <span>
                        <FaCommentAlt />
                      </span>{" "}
                      <span>Comments ({post.comments.length})</span>
                    </p>
                  </button>
                </div>
              </div>

              <div ref={commentsRef} className="flex-1 flex-col flex px-0 py-4">
                <h4 className="font-semibold mb-4">
                  Comments ({post.comments.length})
                </h4>
                <CommentList
                  comments={post.comments}
                  postId={post.id}
                  onEditComment={onEditComment}
                  onDeleteComment={onDeleteComment}
                  onReplyComment={onAddComment}
                />
              </div>
            </div>
            <div className="bg-blue-500 border-t md:sticky md:-bottom-4 px-4 md:px-0">
              <CommentInput
                value={text}
                onChange={(e) => setText(e.target.value)}
                onSubmit={submit}
                inputRef={inputRef}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* <ImageLightbox
        images={post.images}
        open={lightboxOpen}
        startIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      /> */}
    </div>
  );
}
