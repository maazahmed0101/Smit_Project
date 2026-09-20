import { Link } from "react-router-dom";
import Icon from "../Icon/Icon.jsx";
import "./Button.css";

// variant: "primary" (purple), "secondary" (outlined), "light" (white), "ghost" (text only)
// Renders a <Link> when `to` is set, otherwise a <button>.
export default function Button({
  variant = "primary",
  size = "md",
  icon,
  shadow = false,
  to,
  className = "",
  children,
  type = "button",
  ...rest
}) {
  const cls = `btn btn--${variant} btn--${size} ${shadow ? "btn--shadow" : ""} ${className}`.trim();
  const content = (
    <>
      {icon && <Icon name={icon} size={size === "sm" ? 16 : 20} />}
      {children && <span>{children}</span>}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} {...rest}>
      {content}
    </button>
  );
}
