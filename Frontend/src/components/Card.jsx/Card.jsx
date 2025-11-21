import React from "react";

function Card({ children }) {
  return (
    <div className="border-1 border-gray-600/20 p-5 rounded-xl bg-white">
      {children}
    </div>
  );
}

export default Card;
