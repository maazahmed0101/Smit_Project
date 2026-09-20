import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon/Icon.jsx";
import "./Menu.css";

// Small dropdown menu. `trigger` receives props to spread on the button.
// items: [{ key, label, icon?, to?, onClick?, danger? }]  (use { divider: true } for a separator)
export default function Menu({ label, items, trigger, align = "right", className = "" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerProps = {
    ref: btnRef,
    type: "button",
    "aria-label": label,
    "aria-haspopup": "menu",
    "aria-expanded": open,
    onClick: () => setOpen((o) => !o),
  };

  return (
    <div className={`menu ${className}`} ref={wrapRef}>
      {trigger ? (
        trigger(triggerProps)
      ) : (
        <button {...triggerProps} className="menu__trigger">
          <Icon name="dots-vertical" size={20} />
        </button>
      )}
      {open && (
        <ul className={`menu__list menu__list--${align}`} role="menu" aria-label={label}>
          {items.map((item, i) =>
            item.divider ? (
              <li key={`d${i}`} role="separator" className="menu__divider" />
            ) : (
              <li key={item.key || item.label} role="none">
                {item.to ? (
                  <Link role="menuitem" to={item.to} className="menu__item" onClick={() => setOpen(false)}>
                    {item.icon && <Icon name={item.icon} size={18} />}
                    {item.label}
                  </Link>
                ) : (
                  <button
                    role="menuitem"
                    type="button"
                    className={`menu__item ${item.danger ? "menu__item--danger" : ""}`}
                    onClick={() => {
                      setOpen(false);
                      item.onClick?.();
                    }}
                  >
                    {item.icon && <Icon name={item.icon} size={18} />}
                    {item.label}
                  </button>
                )}
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
