import { useState, useRef } from "react";
import { Camera, Smile, Tag, Heart, Loader2 } from "lucide-react";
import { useCreatePost } from "../../hook/useCommunity";
import toast from "react-hot-toast";

const CreatPost = ({ user, onCreate, eventId }) => {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]); // {file, url}
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const { mutate: createPost, isLoading, isPending } = useCreatePost(eventId);
  const loading = isLoading || isPending;

  const handleImageChange = (e) => {
    if (loading) return;
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => {
      const merged = [...prev, ...newImages].slice(0, 6);
      return merged;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (loading) return;
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const newImages = imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => {
      const merged = [...prev, ...newImages].slice(0, 6);
      return merged;
    });
  };

  const removeImage = (index) => {
    if (loading) return;
    setImages((prev) => {
      const next = [...prev];
      const removed = next.splice(index, 1)[0];
      if (removed?.url) URL.revokeObjectURL(removed.url);
      return next;
    });
  };

  const resetForm = () => {
    setText("");
    images.forEach((img) => img?.url && URL.revokeObjectURL(img.url));
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = () => {
    const content = text.trim();
    const imageFiles = images.map((i) => i.file).filter(Boolean);
    if (!content && imageFiles.length === 0) return;
    if (!eventId) return; // cần eventId để gửi bài viết

    createPost(
      { content, imageFiles },
      {
        onSuccess: (created) => {
          if (onCreate) {
            onCreate(
              created || {
                id: Date.now(),
                content,
                images: images.map((i) => i.url),
                author: user,
                createdAt: new Date().toISOString(),
              }
            );
          }
          resetForm();
        },
        onError: () => {
          // giữ form để thử lại
          toast.error("Error when create post. Please try again.");
        },
      }
    );
  };

  return (
    <div className="w-full bg-white rounded-md p-4 shadow-sm border border-gray-200 relative" aria-busy={loading}>
      <div className={`flex items-start gap-3 ${loading ? "pointer-events-none" : ""}`}>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your post content..."
            className="w-full resize-none rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
          />

          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img.url}
                    alt={`preview-${idx}`}
                    className="h-24 w-full object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div
              className={`flex items-center gap-2 ${
                isDragging ? "ring-2 ring-blue-300 rounded-md p-1" : ""
              }`}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <button
                type="button"
                className="rounded px-2 py-1 text-sm bg-gradient-to-r from-purple-400 to-blue-600 text-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="flex items-center">
                  <Camera className="w-4 h-4 mr-1" />
                  <span>Image</span>
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-xs text-gray-500">
                Drag and drop images here or click to select
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={
                loading || (!text.trim() && images.length === 0) || !eventId
              }
              className="px-3 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Đang đăng..." : "Đăng bài"}
            </button>
            {loading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-md flex items-center justify-center z-10">
                <div className="flex items-center gap-2 text-gray-700">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang đăng...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatPost;
