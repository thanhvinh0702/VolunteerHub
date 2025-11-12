import React, { useState } from "react";
import { Camera } from "lucide-react";

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
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <form onSubmit={submit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you think about this event?"
          className="w-full resize-none p-2 border rounded-md focus:ring-2 focus:border-blue-500"
          rows={4}
        />

        {images.length > 0 && (
          <div className="mt-3 grid gap-2 grid-cols-4">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img.url}
                  alt=""
                  className="h-40 w-full object-cover rounded-md cursor-pointer aspect-square"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <Camera className="w-5 h-5" />
            <span>Upload Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
              className="hidden"
            />
          </label>
          <button
            disabled={!text.trim() && !images.length}
            className="bg-blue-600 text-white px-4 py-1 rounded-md disabled:opacity-60"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
