import React, { useState } from "react";
import { Camera, Smile, Tag, Heart } from "lucide-react";

export default function CreatePost({ onCreate }) {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);

  function handleImages(e) {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...mapped].slice(0, 6));
  }

  function removeImage(i) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, idx) => idx !== i);
    });
  }

  function submit(e) {
    e.preventDefault();
    if (!text.trim() && images.length === 0) return;
    const newPost = {
      id: Date.now(),
      author: { name: "Bạn" },
      text: text.trim(),
      images: images.map((i) => i.url),
      createdAt: new Date().toISOString(),
      comments: [],
      reactions: { like: 0, love: 0 },
      userReaction: null,
    };
    onCreate(newPost);
    images.forEach((i) => URL.revokeObjectURL(i.url));
    setText("");
    setImages([]);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-blue-100">
      <form onSubmit={submit}>
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Hãy chia sẻ suy nghĩ của bạn về sự kiện này... ✨
Bạn nghĩ sao về hoạt động tình nguyện? Ai đã truyền cảm hứng cho bạn?"
            className="w-full resize-none p-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:border-blue-500 focus:outline-none text-gray-700 placeholder-gray-400 text-base leading-relaxed"
            rows={4}
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              type="button"
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              title="Thêm emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              title="Tag người khác"
            >
              <Tag className="w-5 h-5" />
            </button>
          </div>
        </div>

        {images.length > 0 && (
          <div className="mt-4 grid gap-3 grid-cols-4">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={img.url}
                  alt=""
                  className="h-32 w-full object-cover rounded-lg cursor-pointer aspect-square border-2 border-blue-100"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">
              <Camera className="w-5 h-5" />
              <span className="font-medium">Ảnh</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                className="hidden"
              />
            </label>
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
              title="Biểu cảm"
            >
              <Heart className="w-5 h-5" />
              <span className="font-medium">Cảm xúc</span>
            </button>
          </div>
          <button
            disabled={!text.trim() && !images.length}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            Đăng bài
          </button>
        </div>
      </form>
    </div>
  );
}
