import React, { useState } from "react";
import "./sidebar.css";

const Sidebar = ({ onFilterChange, onClose }) => {
  const [expanded, setExpanded] = useState({
    all: false,
    pending: false,
    completed: false,
  });

  const toggleExpand = (category) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className="sidebar">
      {/* Close button */}
      <button className="close-btn" onClick={onClose}>×</button>
      
      <h3>Filter Tasks</h3>
      <ul>
        {/* All Tasks */}
        <li onClick={() => toggleExpand("all")} className="expandable">
          All Tasks {expanded.all ? "▼" : "▶"}
        </li>
        {expanded.all && (
          <ul>
            <li onClick={() => onFilterChange("all", "all")}>All</li>
            <li onClick={() => onFilterChange("all", "work")}>Work</li>
            <li onClick={() => onFilterChange("all", "personal")}>Personal</li>
            <li onClick={() => onFilterChange("all", "urgent")}>Urgent</li>
          </ul>
        )}

        {/* Pending Tasks */}
        <li onClick={() => toggleExpand("pending")} className="expandable">
          Pending {expanded.pending ? "▼" : "▶"}
        </li>
        {expanded.pending && (
          <ul>
            <li onClick={() => onFilterChange("pending", "all")}>All</li>
            <li onClick={() => onFilterChange("pending", "work")}>Work</li>
            <li onClick={() => onFilterChange("pending", "personal")}>Personal</li>
            <li onClick={() => onFilterChange("pending", "urgent")}>Urgent</li>
          </ul>
        )}

        {/* Completed Tasks */}
        <li onClick={() => toggleExpand("completed")} className="expandable">
          Completed {expanded.completed ? "▼" : "▶"}
        </li>
        {expanded.completed && (
          <ul>
            <li onClick={() => onFilterChange("completed", "all")}>All</li>
            <li onClick={() => onFilterChange("completed", "work")}>Work</li>
            <li onClick={() => onFilterChange("completed", "personal")}>Personal</li>
            <li onClick={() => onFilterChange("completed", "urgent")}>Urgent</li>
          </ul>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
