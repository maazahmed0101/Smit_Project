import "./Avatar.css";

// Round avatar image. Decorative by default (name is shown next to it).
export default function Avatar({ src, name = "", size = 40, online = false, className = "" }) {
  return (
    <span className={`avatar ${className}`} style={{ width: size, height: size }}>
      <img src={src} alt="" width={size} height={size} loading="lazy" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
      {online && <span className="avatar__dot" aria-label={`${name} is online`} role="img" />}
    </span>
  );
}
