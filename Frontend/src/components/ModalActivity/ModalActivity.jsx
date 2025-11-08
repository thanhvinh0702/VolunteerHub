import React from "react";

function ModalActivity({ title, subtile, children }) {
  return (
    <div className="p-5 flex flex-col gap-2 border-1 border-gray-600/20 rounded-xl bg-white">
      <div className="text-2xl font-bold">{title}</div>
      <div className="text-sm text-gray-500">{subtile}</div>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

export default ModalActivity;
