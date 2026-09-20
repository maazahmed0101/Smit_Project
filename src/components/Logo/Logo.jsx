import { useId } from "react";
import { Link } from "react-router-dom";
import "./Logo.css";

// PLAY logomark: gradient play triangle behind a circular "PLAY" badge.
export default function Logo({ size = 40, to = "/" }) {
  const uid = useId().replace(/:/g, "");
  return (
    <Link to={to} className="logo" aria-label="PLAY home">
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`lg-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="0.5" stopColor="#ae7aff" />
            <stop offset="1" stopColor="#ff4d9d" />
          </linearGradient>
        </defs>
        <circle cx="21" cy="20" r="18" fill="#000" stroke="#fff" strokeWidth="1.5" />
        <path d="M4 3v32l24-16z" fill={`url(#lg-${uid})`} />
        <text x="24.5" y="24" fill="#fff" fontFamily="Inter, system-ui, sans-serif" fontSize="9.5" fontWeight="800" textAnchor="middle" letterSpacing="0.2">
          PLAY
        </text>
      </svg>
    </Link>
  );
}
