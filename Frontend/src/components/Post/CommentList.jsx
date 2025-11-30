import React from "react";
import CommentItem from "./CommentItem";

export default function CommentList({
  comments,
  postId,
  onEditComment,
  onDeleteComment,
  onReplyComment,
}) {
  // Build nested comment
  const buildCommentTree = (comments) => {
    const commentMap = {};
    const rootComments = [];

    comments.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    // tree parse
    comments.forEach((comment) => {
      if (comment.parentId === null) {
        rootComments.push(commentMap[comment.id]);
      } else if (commentMap[comment.parentId]) {
        commentMap[comment.parentId].replies.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  };

  const commentTree = buildCommentTree(comments);

  if (comments.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-20">
      {commentTree.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          onEdit={onEditComment}
          onDelete={onDeleteComment}
          onReply={onReplyComment}
          replies={comment.replies}
          depth={0}
        />
      ))}
    </div>
  );
}
