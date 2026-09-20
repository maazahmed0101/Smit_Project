import { NavLink } from "react-router-dom";
import Icon from "../Icon/Icon.jsx";
import { mainNav } from "../Sidebar/navItems.js";
import "./MobileNav.css";

// Bottom tab bar shown on phones (<768px) — replaces the sidebar.
export default function MobileNav() {
  return (
    <nav className="mobilenav" aria-label="Main">
      {mainNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `mobilenav__item ${isActive ? "is-active" : ""}`}
          aria-label={item.label}
        >
          <Icon name={item.icon} size={24} />
        </NavLink>
      ))}
    </nav>
  );
}
