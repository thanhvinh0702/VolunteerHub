// ReactionButton.jsx
import React, { useEffect, useRef, useState } from "react";

const REACTIONS = [
  { key: "like", label: "👍" },
  { key: "love", label: "❤️" },
  { key: "haha", label: "😂" },
  { key: "wow", label: "😮" },
  { key: "sad", label: "😢" },
  { key: "angry", label: "😡" },
];

export default function ReactionButton({
  initialReaction = null,
  onReact,
  small = false,
}) {
  const [current, setCurrent] = useState(initialReaction);
  const [showBar, setShowBar] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const holderRef = useRef(null);
  const barRef = useRef(null);
  const pressTimer = useRef(null);
  const hideTimer = useRef(null);

  useEffect(() => {
    setCurrent(initialReaction);
  }, [initialReaction]);

  useEffect(() => {
    return () => {
      clearTimeout(pressTimer.current);
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, []);

  const cancelHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const choose = (key) => {
    setCurrent(key);
    setShowBar(false);
    setHoverIndex(-1);
    onReact?.(key);
  };

  const clear = () => {
    setCurrent(null);
    onReact?.(null);
  };

  const closeBar = () => {
    cancelHideTimer();
    setShowBar(false);
    setHoverIndex(-1);
  };

  const closeBarSoon = () => {
    cancelHideTimer();
    hideTimer.current = setTimeout(() => {
      hideTimer.current = null;
      setShowBar(false);
      setHoverIndex(-1);
    }, 150);
  };

  // toggle on quick click
  const handleClick = () => {
    // if bar was open (due to hover), don't treat as toggle
    if (showBar) return;
    if (current === "like") clear();
    else choose("like");
  };

  // pointer (long-press) logic
  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    cancelHideTimer();
    pressTimer.current = setTimeout(() => {
      setShowBar(true);
      updateHoverFromPointer(e);
    }, 350);
    holderRef.current?.setPointerCapture?.(e.pointerId);
  };
  const onPointerUp = (e) => {
    clearTimeout(pressTimer.current);
    if (showBar) {
      if (hoverIndex >= 0) choose(REACTIONS[hoverIndex].key);
      else closeBar();
    } else {
      // handled in onClick
    }
    try {
      holderRef.current?.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore if pointer capture was not set */
    }
  };
  const onPointerMove = (e) => {
    if (!showBar) return;
    updateHoverFromPointer(e);
  };
  const onPointerCancel = () => {
    clearTimeout(pressTimer.current);
    closeBar();
  };

  // hover for desktop: show popup after small delay on hover
  const hoverTimer = useRef(null);
  const onMouseEnter = () => {
    cancelHideTimer();
    hoverTimer.current = setTimeout(() => setShowBar(true), 400);
  };
  const onMouseLeave = (e) => {
    clearTimeout(hoverTimer.current);
    const nextTarget = e.relatedTarget;
    const barEl = barRef.current;
    if (barEl && nextTarget && barEl.contains(nextTarget)) {
      return;
    }
    closeBarSoon();
  };

  const updateHoverFromPointer = (e) => {
    const bar = barRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX;
    const rel = Math.max(0, Math.min(rect.width, x - rect.left));
    const itemW = rect.width / REACTIONS.length;
    const centerIdx = Math.floor((rel + itemW / 2) / itemW);
    setHoverIndex(Math.max(0, Math.min(REACTIONS.length - 1, centerIdx)));
  };

  const onBarPointerMove = (e) => {
    updateHoverFromPointer(e);
  };

  const onBarPointerEnter = () => {
    cancelHideTimer();
  };

  const onBarPointerLeave = (e) => {
    const holderEl = holderRef.current;
    if (holderEl && e.relatedTarget && holderEl.contains(e.relatedTarget)) {
      setHoverIndex(-1);
      return;
    }
    closeBarSoon();
  };

  const onBarPointerUp = () => {
    if (hoverIndex >= 0) choose(REACTIONS[hoverIndex].key);
    else closeBar();
  };

  return (
    <div className="relative inline-block">
      {/* Reaction popup */}
      {showBar && (
        <div
          ref={barRef}
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 select-none z-90"
          onPointerEnter={onBarPointerEnter}
          onPointerMove={onBarPointerMove}
          onPointerLeave={onBarPointerLeave}
          onPointerUp={onBarPointerUp}
        >
          <div className="bg-white rounded-3xl px-1 py-2 shadow-lg flex items-center gap-2">
            {REACTIONS.map((r, i) => {
              const isHover = i === hoverIndex;
              return (
                <div
                  key={r.key}
                  className={`w-10 h-10 flex items-center justify-center text-xl transition-transform duration-150 ${
                    isHover ? "transform -translate-y-2 scale-125" : ""
                  }`}
                >
                  <span>{r.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Button holder */}
      <div
        ref={holderRef}
        role="button"
        tabIndex={0}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-md ${
          current ? "bg-blue-50" : "bg-transparent"
        } text-sm cursor-pointer select-none`}
        onClick={handleClick}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        onPointerCancel={onPointerCancel}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className={`w-6 h-6 flex items-center justify-center text-lg`}>
          {current ? "👍" : "👍"}
        </div>
        <span className="font-semibold">{small ? "" : "Like"}</span>
      </div>
    </div>
  );
}
