import { NavLink } from "react-router-dom";
import "./Tabs.css";

// Route-based tabs (each tab is a real link so refresh / back / share work).
// tabs: [{ to, label, end? }]
export default function Tabs({ tabs, label = "Sections" }) {
  return (
    <nav className="tabs" aria-label={label}>
      {tabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => `tabs__tab ${isActive ? "is-active" : ""}`}>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
