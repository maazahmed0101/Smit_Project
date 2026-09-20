import { NavLink } from "react-router-dom";
import Icon from "../Icon/Icon.jsx";
import { footerNav, mainNav } from "./navItems.js";
import "./Sidebar.css";

function Item({ item, compact }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) => `sidebar__item ${isActive ? "is-active" : ""}`}
      aria-label={compact ? item.label : undefined}
      title={compact ? item.label : undefined}
    >
      <Icon name={item.icon} size={24} />
      <span className="sidebar__label">{item.label}</span>
    </NavLink>
  );
}

// variant "full": icons + labels (collapses to icons below 1100px)
// variant "compact": icons only (used on the watch page like the Figma)
export default function Sidebar({ variant = "full" }) {
  const compact = variant === "compact";
  return (
    <aside className={`sidebar sidebar--${variant}`}>
      <nav aria-label="Main" className="sidebar__group sidebar__group--top">
        {mainNav.map((item) => (
          <Item key={item.to} item={item} compact={compact} />
        ))}
      </nav>
      <nav aria-label="Help and settings" className="sidebar__group sidebar__group--bottom">
        {footerNav.map((item) => (
          <Item key={item.to} item={item} compact={compact} />
        ))}
      </nav>
    </aside>
  );
}
