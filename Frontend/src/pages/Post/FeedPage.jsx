// src/pages/FeedPage.jsx
import React, { useState } from "react";
import CreatePost from "../../components/Post/CreatPost";
import PostCard from "../../components/Post/PostCard";
import PostModal from "../../components/Post/PostModal";
import { useNavbar } from "../../hook/useNavbar";

/**
 * FeedPage: quản lý state posts + modal
 * - currentUser mặc định là "Bạn" (thay bằng auth thật nếu có)
 */

export default function FeedPage() {
  const currentUser = { name: "Bạn" };
  const { setShowNavbar } = useNavbar();
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: { name: "Nguyễn A" },
      text:
        "Hôm nay đi dọn biển, cực nhưng vui quá! " + "Lorem ipsum ".repeat(50),
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000",
        "https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=1000",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1000",
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1000",
      ],
      createdAt: new Date().toISOString(),
      comments: [
        {
          id: 32,
          ownerId: "10",
          postId: 1,
          parentId: null,
          content: "Tuyệt vời! Mình cũng muốn tham gia lần sau.",
          createdAt: "2025-11-09T17:12:55.508245",
          updatedAt: "2025-11-09T17:12:55.508277",
        },
        {
          id: 33,
          ownerId: "1",
          postId: 1,
          parentId: null,
          content: "Cảm ơn bạn đã góp sức cho cộng đồng!",
          createdAt: "2025-11-09T20:34:46.464156",
          updatedAt: "2025-11-09T20:34:46.4643",
        },
        {
          id: 34,
          ownerId: "2",
          postId: 1,
          parentId: null,
          content: "Hoạt động rất ý nghĩa. Khi nào có hoạt động tiếp theo nhỉ?",
          createdAt: "2025-11-10T08:15:30.123456",
          updatedAt: "2025-11-10T08:15:30.123490",
        },
        {
          id: 35,
          ownerId: "3",
          postId: 1,
          parentId: null,
          content: "Môi trường sạch là sức khỏe của chúng ta. Làm tốt lắm!",
          createdAt: "2025-11-10T14:22:10.789123",
          updatedAt: "2025-11-10T14:22:10.789156",
        },
        {
          id: 36,
          ownerId: "4",
          postId: 1,
          parentId: null,
          content: "Đẹp quá! Nhìn bãi biển sạch thế này thấy vui ghê 😊",
          createdAt: "2025-11-10T16:45:22.345678",
          updatedAt: "2025-11-10T16:45:22.345712",
        },
        {
          id: 37,
          ownerId: "5",
          postId: 1,
          parentId: null,
          content:
            "Cần nhiều người như các bạn hơn. Hẹn gặp lại trong hoạt động sau!",
          createdAt: "2025-11-11T09:30:15.567890",
          updatedAt: "2025-11-11T09:30:15.567923",
        },
        {
          id: 38,
          ownerId: "6",
          postId: 1,
          parentId: null,
          content:
            "Mình đã share bài viết này để nhiều người biết đến hoạt động tình nguyện của các bạn nhé!",
          createdAt: "2025-11-11T11:20:45.234567",
          updatedAt: "2025-11-11T11:20:45.234601",
        },
        {
          id: 39,
          ownerId: "7",
          postId: 1,
          parentId: null,
          content:
            "Lần sau có hoạt động dọn dẹp công viên thì báo mình với nhé!",
          createdAt: "2025-11-11T15:10:33.890123",
          updatedAt: "2025-11-11T15:10:33.890157",
        },
        {
          id: 40,
          ownerId: "8",
          postId: 1,
          parentId: null,
          content:
            "Các bạn làm việc rất chuyên nghiệp và nhiệt tình. Cảm ơn các bạn rất nhiều!",
          createdAt: "2025-11-12T07:25:18.123456",
          updatedAt: "2025-11-12T07:25:18.123490",
        },
        {
          id: 41,
          ownerId: "10",
          postId: 1,
          parentId: null,
          content:
            "Cảm ơn mọi người đã ủng hộ! Mình sẽ thông báo hoạt động tiếp theo sớm nhất có thể 💪",
          createdAt: "2025-11-12T10:15:42.456789",
          updatedAt: "2025-11-12T10:15:42.456823",
        },
        {
          id: 42,
          ownerId: "2",
          postId: 1,
          parentId: 32,
          content:
            "Mình cũng vậy! Chúng ta có thể tạo nhóm để cùng tham gia nhé!",
          createdAt: "2025-11-12T11:20:15.123456",
          updatedAt: "2025-11-12T11:20:15.123490",
        },
        {
          id: 43,
          ownerId: "10",
          postId: 1,
          parentId: 32,
          content: "Ý tưởng hay đấy! Mình sẽ tạo group chat nhé 👍",
          createdAt: "2025-11-12T12:10:30.234567",
          updatedAt: "2025-11-12T12:10:30.234601",
        },
        {
          id: 44,
          ownerId: "3",
          postId: 1,
          parentId: 34,
          content:
            "Có lẽ tháng sau sẽ có hoạt động trồng cây. Bạn có muốn tham gia không?",
          createdAt: "2025-11-12T13:15:45.345678",
          updatedAt: "2025-11-12T13:15:45.345712",
        },
        {
          id: 45,
          ownerId: "1",
          postId: 1,
          parentId: 34, // Facebook style: point to root comment, not to reply 44
          content:
            "@Lê Văn C Tuyệt! Mình rất thích trồng cây. Nhớ tag mình nhé!",
          createdAt: "2025-11-12T14:05:22.456789",
          updatedAt: "2025-11-12T14:05:22.456823",
        },
        {
          id: 46,
          ownerId: "5",
          postId: 1,
          parentId: 36,
          content: "Cảm ơn bạn đã share! Hy vọng nhiều người tham gia hơn 🙏",
          createdAt: "2025-11-12T15:30:10.567890",
          updatedAt: "2025-11-12T15:30:10.567923",
        },
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
      comments: [
        {
          id: 50,
          ownerId: "1",
          postId: 2,
          parentId: null,
          content:
            "Đúng vậy! Mỗi người một ý thức là môi trường sẽ xanh sạch đẹp!",
          createdAt: "2025-11-11T08:20:30.123456",
          updatedAt: "2025-11-11T08:20:30.123490",
        },
        {
          id: 51,
          ownerId: "3",
          postId: 2,
          parentId: null,
          content:
            "Bắt đầu từ những việc nhỏ nhất thôi, như không xả rác bừa bãi.",
          createdAt: "2025-11-11T12:45:15.234567",
          updatedAt: "2025-11-11T12:45:15.234601",
        },
        {
          id: 52,
          ownerId: "10",
          postId: 2,
          parentId: null,
          content:
            "Đồng ý! Mình cũng đang cố gắng giảm thiểu rác thải nhựa mỗi ngày.",
          createdAt: "2025-11-12T09:30:22.345678",
          updatedAt: "2025-11-12T09:30:22.345712",
        },
      ],
      reactions: { like: 2, love: 0 },
      userReaction: null,
    },
  ]);

  const [activePost, setActivePost] = useState(null);
  const [modalOptions, setModalOptions] = useState({
    startImageIndex: 0,
    openComments: false,
  });

  // Create new post
  const handleCreate = (newPost) => {
    const normalized = {
      ...newPost,
      images: newPost.images || [],
      comments: newPost.comments || [],
      reactions: newPost.reactions || { like: 0, love: 0 },
      userReaction: newPost.userReaction ?? null,
    };
    setPosts((prev) => [normalized, ...prev]);
  };

  // Open modal
  const openPost = (post, options = {}) => {
    setShowNavbar(false);
    setActivePost(post);
    setModalOptions({
      startImageIndex: options.startImageIndex ?? 0,
      openComments: Boolean(options.openComments),
    });
  };

  const closePost = () => {
    setShowNavbar(true);
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
  const editComment = (postId, commentId, newContent) => {
    const now = new Date().toISOString();
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId
                  ? { ...c, content: newContent, updatedAt: now }
                  : c
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
              c.id === commentId
                ? { ...c, content: newContent, updatedAt: now }
                : c
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
        onAddComment={addComment}
        onEditComment={editComment}
        onDeleteComment={deleteComment}
        onReact={reactTo}
      />
    </div>
  );
}
