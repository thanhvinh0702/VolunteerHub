import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import ImageLightbox from "./ImageLightbox";
import ReactionBar from "./ReactionBar";
import { X } from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
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
  const [lightboxIndex, setLightboxIndex] = useState(startImageIndex ?? 0);
  const [showMore, setShowMore] = useState(false);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  const focusComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (open) {
      setLightboxIndex(startImageIndex ?? 0);
    }
  }, [startImageIndex, open]);

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
    <div className="min-w-[95vw] min-h-[95vh] max-md:min-w-[100vw] max-md:min-h-[100vh] max-sm:flex max-sm:justify-start relative">
      <Modal open={true} onClose={onClose}>
        <div className="flex flex-col md:grid md:grid-cols-8 w-full h-full gap-1 md:overflow-hidden max-md:gap-0 max-md:px-1 max-md:overflow-y-auto">
          <div className="md:col-span-6 order-1 flex justify-center items-center bg-black md:rounded-l-lg">
            <div className="w-full h-full max-sm:hidden">
              <ImageLightbox
                images={post.images}
                onIndexChange={(i) => setLightboxIndex(i)}
                startIndex={lightboxIndex}
                currentIndex={lightboxIndex}
                className=""
              />
            </div>
          </div>
          <div className="md:col-span-2 order-2 flex flex-col bg-white md:rounded-r-lg md:overflow-hidden">
            <div className="md:flex-1 md:overflow-y-auto px-6 py-4 pr-4 max-sm:pr-1 max-md:px-3 max-md:py-0">
              <div className="flex flex-col gap-2 lg:mt-10 max-md:mt-4">
                <div className="flex justify-start items-center p-0 border-b-1 border-gray-400 pb-2 lg:hidden ">
                  <IoMdArrowRoundBack className="text-white bg-black rounded-full p-0 h-5 w-5" />
                </div>
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
                <div className="max-sm:flex align-middle justify-center hidden max-sm:bg-black">
                  <ImageLightbox
                    images={post.images}
                    startIndex={lightboxIndex}
                    className=""
                    onIndexChange={(i) => setLightboxIndex(i)}
                  />
                </div>
                <div className="">
                  <p
                    className={`text-start line-clamp-5 max-sm:text-sm max-sm:pt-4 ${
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
              <div className="mt-4">
                <ReactionBar
                  post={post}
                  onReact={onReact}
                  onCommentClick={focusComments}
                />
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
