import React from "react";
import { Home, Users, Syringe, FileText, LogOut } from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ onMenuChange }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <div className="logo">🏫 DPS</div>
          <h1 className="portal-title">Vaccination Portal</h1>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => onMenuChange("dashboard")}>
            <Home className="nav-icon" /> Dashboard
          </div>
          <div className="nav-item" onClick={() => onMenuChange("students")}>
            <Users className="nav-icon" /> Students
          </div>
          <div className="nav-item" onClick={() => onMenuChange("drives")}>
            <Syringe className="nav-icon" /> Vaccination Drives
          </div>
          <div className="nav-item" onClick={() => onMenuChange("reports")}>
            <FileText className="nav-icon" /> Reports
          </div>
          <div className="nav-item" onClick={() => onMenuChange("logout")}>
            <LogOut className="nav-icon" /> Logout
          </div>
        </nav>
      </div>

      <div className="sidebar-footer">© 2025 DPS Portal</div>
    </aside>
  );
};

export default Sidebar;
