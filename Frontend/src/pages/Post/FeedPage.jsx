// src/pages/FeedPage.jsx
import React, { useState } from "react";
import CreatePost from "../../components/Post/CreatPost";
import PostCard from "../../components/Post/PostCard";
import PostModal from "../../components/Post/PostModal";

/**
 * FeedPage: quản lý state posts + modal
 * - currentUser mặc định là "Bạn" (thay bằng auth thật nếu có)
 */

export default function FeedPage() {
  const currentUser = { name: "Bạn" };

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: { name: "Nguyễn A" },
      text:
        "Hôm nay đi dọn biển, cực nhưng vui quá! " + "Lorem ipsum ".repeat(10),
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000",
        "https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=1000",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1000",
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1000",
      ],
      createdAt: new Date().toISOString(),
      comments: [
        { id: 11, author: "Bình", text: "Cảm ơn bạn đã góp sức!" },
        { id: 12, author: "Lan", text: "Mình muốn tham gia lần sau." },
        { id: 13, author: "Bạn", text: "Tuyệt vời!" },
        { id: 14, author: "Nam", text: "Làm tốt lắm!" },
        { id: 15, author: "Hà", text: "Chúc mừng!" },
        { id: 16, author: "Linh", text: "Tuyệt quá!" },
      ],
      reactions: { like: 5, love: 2 },
      userReaction: null,
    },
    {
      id: 2,
      author: { name: "Trần B" },
      text: "Giữ gìn môi trường là phải làm hàng ngày.",
      images: [],
      createdAt: new Date().toISOString(),
      comments: [],
      reactions: { like: 2, love: 0 },
      userReaction: null,
    },
  ]);

  const [activePost, setActivePost] = useState(null);
  const [modalOptions, setModalOptions] = useState({
    startImageIndex: 0,
    openComments: false,
  });

  // Create new post (được gọi từ CreatePost)
  const handleCreate = (newPost) => {
    // ensure structure consistent
    const normalized = {
      ...newPost,
      images: newPost.images || [],
      comments: newPost.comments || [],
      reactions: newPost.reactions || { like: 0, love: 0 },
      userReaction: newPost.userReaction ?? null,
    };
    setPosts((prev) => [normalized, ...prev]);
  };

  // Open modal (options: { startImageIndex, openComments })
  const openPost = (post, options = {}) => {
    setActivePost(post);
    setModalOptions({
      startImageIndex: options.startImageIndex ?? 0,
      openComments: Boolean(options.openComments),
    });
  };

  const closePost = () => {
    setActivePost(null);
    setModalOptions({ startImageIndex: 0, openComments: false });
  };

  // Add comment
  const addComment = (postId, comment) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      )
    );
    // if modal open for same post, update activePost too
    setActivePost((ap) =>
      ap && ap.id === postId
        ? { ...ap, comments: [...ap.comments, comment] }
        : ap
    );
  };

  // Edit comment (only basic)
  const editComment = (postId, commentId, newText) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId ? { ...c, text: newText } : c
              ),
            }
          : p
      )
    );
    setActivePost((ap) =>
      ap && ap.id === postId
        ? {
            ...ap,
            comments: ap.comments.map((c) =>
              c.id === commentId ? { ...c, text: newText } : c
            ),
          }
        : ap
    );
  };

  // Delete comment
  const deleteComment = (postId, commentId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
          : p
      )
    );
    setActivePost((ap) =>
      ap && ap.id === postId
        ? { ...ap, comments: ap.comments.filter((c) => c.id !== commentId) }
        : ap
    );
  };

  // React (like/love) with toggle logic
  const reactTo = (postId, type) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const already = p.userReaction === type;
        let newReactions = { ...p.reactions };
        let newUserReaction = p.userReaction;
        if (already) {
          // remove
          newReactions[type] = Math.max(0, (newReactions[type] || 0) - 1);
          newUserReaction = null;
        } else {
          // switch or add
          if (p.userReaction) {
            newReactions[p.userReaction] = Math.max(
              0,
              (newReactions[p.userReaction] || 0) - 1
            );
          }
          newReactions[type] = (newReactions[type] || 0) + 1;
          newUserReaction = type;
        }
        return { ...p, reactions: newReactions, userReaction: newUserReaction };
      })
    );

    // also update activePost if it's the same
    setActivePost((ap) => {
      if (!ap || ap.id !== postId) return ap;
      const p = posts.find((x) => x.id === postId) || ap;
      const already = p.userReaction === type;
      let newReactions = { ...p.reactions };
      let newUserReaction = p.userReaction;
      if (already) {
        newReactions[type] = Math.max(0, (newReactions[type] || 0) - 1);
        newUserReaction = null;
      } else {
        if (p.userReaction)
          newReactions[p.userReaction] = Math.max(
            0,
            (newReactions[p.userReaction] || 0) - 1
          );
        newReactions[type] = (newReactions[type] || 0) + 1;
        newUserReaction = type;
      }
      return { ...ap, reactions: newReactions, userReaction: newUserReaction };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <CreatePost
          onCreate={(p) =>
            handleCreate({
              ...p,
              author: { name: currentUser.name },
              createdAt: new Date().toISOString(),
            })
          }
        />

        <div>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onOpenPost={openPost}
              onReactLocal={reactTo}
            />
          ))}
        </div>
      </div>

      <PostModal
        open={!!activePost}
        post={activePost}
        startImageIndex={modalOptions.startImageIndex}
        initialOpenComments={modalOptions.openComments}
        onClose={closePost}
        onAddComment={(postId, comment) =>
          addComment(postId, {
            ...comment,
            author: comment.author || currentUser.name,
          })
        }
        onEditComment={editComment}
        onDeleteComment={deleteComment}
        onReact={reactTo}
      />
    </div>
  );
}
