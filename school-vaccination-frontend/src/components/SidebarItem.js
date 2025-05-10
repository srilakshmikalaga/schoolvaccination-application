import React from "react";

const SidebarItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 text-gray-700 cursor-pointer hover:text-green-600">
    <span>{icon}</span>
    <span>{label}</span>
  </div>
);

export default SidebarItem;
