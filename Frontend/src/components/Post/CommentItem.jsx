import React, { useState } from "react";

export default function CommentItem({
  comment,
  postId,
  onEdit,
  onDelete,
  onReply,
  replies = [],
  currentUserId = "10",
  depth = 0,
}) {
  // Thêm vào đầu component (sau line 15)
  const [showAllReplies, setShowAllReplies] = useState(false);

  const INITIAL_REPLIES_SHOW = 0; // Số replies hiển thị ban đầu
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyToUser, setReplyToUser] = useState(null);

  // Check if this comment belongs to current user
  const isOwnComment = comment.ownerId === currentUserId;
  const hasReplies = replies.length > 0;
  const isReply = depth > 0; // If depth > 0, this is a reply

  const visibleReplies = showAllReplies
    ? replies
    : replies.slice(0, INITIAL_REPLIES_SHOW);

  const hiddenRepliesCount = replies.length;
  const hasHiddenReplies = hiddenRepliesCount > 0;

  const handleEdit = () => {
    const newContent = prompt("Sửa bình luận:", comment.content);
    if (newContent !== null && newContent.trim()) {
      onEdit(postId, comment.id, newContent);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      onDelete(postId, comment.id);
    }
  };

  const handleReplyClick = (targetComment) => {
    setShowReplyInput(true);
    setReplyToUser({
      id: targetComment.ownerId,
      name: getUserName(targetComment.ownerId),
    });
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Facebook style: Always use the root comment's ID as parentId
    // If this is already a reply (depth > 0), find the root parent
    const rootParentId = isReply ? comment.parentId || comment.id : comment.id;

    // Add mention if replying to a reply
    const content =
      replyToUser && isReply ? `@${replyToUser.name} ${replyText}` : replyText;

    const newReply = {
      id: Date.now(),
      ownerId: currentUserId,
      postId: postId,
      parentId: rootParentId,
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replyToUserId: replyToUser ? replyToUser.id : null,
    };

    onReply(postId, newReply);
    setReplyText("");
    setShowReplyInput(false);
    setReplyToUser(null);
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 48) return "Hôm qua";
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className={`${isReply ? "ml-8 mt-2" : ""}`}>
      <div
        className={`p-3 rounded-lg ${
          isOwnComment ? "bg-blue-50" : "bg-gray-50"
        }`}
      >
        <div className="flex gap-2">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
              {getUserName(comment.ownerId)[0]}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Comment content */}
            <div className="bg-gray-100 rounded-2xl px-3 py-2">
              <div className="font-semibold text-sm">
                {getUserName(comment.ownerId)}
              </div>
              <div className="text-sm text-gray-800 break-words">
                {comment.content}
              </div>
            </div>

            <div className="mt-1 px-3 flex items-center gap-4 text-xs">
              <button
                onClick={() => handleReplyClick(comment)}
                className="text-gray-600 hover:underline font-semibold"
              >
                Trả lời
              </button>
              <span className="text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
              {isOwnComment && (
                <>
                  <button
                    onClick={handleEdit}
                    className="text-gray-600 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-gray-600 hover:underline"
                  >
                    Xóa
                  </button>
                </>
              )}
            </div>

            {showReplyInput && (
              <form onSubmit={handleReplySubmit} className="mt-2 flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {getUserName(currentUserId)[0]}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={
                      replyToUser && isReply
                        ? `Trả lời ${replyToUser.name}...`
                        : "Viết câu trả lời..."
                    }
                    className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 text-sm font-semibold"
                  >
                    ↵
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {!isReply && hasReplies && (
        <div className="mt-1">
          {!showAllReplies && hasHiddenReplies && (
            <button
              onClick={() => setShowAllReplies(true)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-semibold"
            >
              <span className="text-lg">⤷</span>
              <span>Xem thêm {hiddenRepliesCount}</span>
            </button>
          )}
          {visibleReplies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onEdit={onEdit}
              onDelete={onDelete}
              onReply={onReply}
              replies={[]}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
          {showAllReplies && hasHiddenReplies && (
            <button
              onClick={() => setShowAllReplies(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 font-semibold"
            >
              <span className="text-lg">⤴</span>
              <span>Ẩn bớt phản hồi</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
