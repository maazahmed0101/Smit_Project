import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../Logo/Logo.jsx";
import Icon from "../Icon/Icon.jsx";
import Button from "../Button/Button.jsx";
import Menu from "../Menu/Menu.jsx";
import Avatar from "../Avatar/Avatar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Navbar.css";

function SearchBar({ onDone }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const urlQuery = location.pathname === "/search" ? params.get("q") || "" : "";
  const [value, setValue] = useState(urlQuery);

  // keep the field in sync with the URL (back/forward, direct links)
  useEffect(() => setValue(urlQuery), [urlQuery]);

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    onDone?.();
  };

  return (
    <form className="searchbar" role="search" onSubmit={submit}>
      <label htmlFor="global-search" className="sr-only">
        Search videos
      </label>
      <Icon name="search" size={20} className="searchbar__icon" />
      <input
        id="global-search"
        className="searchbar__input"
        type="search"
        placeholder="Search"
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
}

export default function Navbar() {
  const { user, openAuth, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const guestItems = [
    { key: "login", label: "Log in", icon: "user-check", onClick: () => openAuth("login") },
    { key: "signup", label: "Sign up", icon: "user-plus", onClick: () => openAuth("signup") },
    { divider: true },
    { key: "support", label: "Support", icon: "help", to: "/support" },
    { key: "settings", label: "Settings", icon: "settings", to: "/settings" },
  ];
  const userItems = [
    { key: "mine", label: "My content", icon: "video", to: "/my-content" },
    { divider: true },
    { key: "support", label: "Support", icon: "help", to: "/support" },
    { key: "settings", label: "Settings", icon: "settings", to: "/settings" },
    { divider: true },
    {
      key: "logout",
      label: "Log out",
      icon: "log-out",
      danger: true,
      onClick: () => {
        logout();
        navigate("/");
      },
    },
  ];

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__logo">
          <Logo />
        </div>

        <div className={`navbar__search ${searchOpen ? "is-open" : ""}`}>
          <SearchBar onDone={() => setSearchOpen(false)} />
        </div>

        <div className="navbar__actions">
          <button
            type="button"
            className="navbar__search-toggle"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((o) => !o)}
          >
            <Icon name={searchOpen ? "x" : "search"} size={20} />
          </button>

          {/* desktop */}
          {user ? (
            <Menu
              label="Account menu"
              items={userItems}
              className="navbar__desktop"
              trigger={(props) => (
                <button {...props} className="navbar__avatar-btn">
                  <Avatar src={user.avatar} name={user.name} size={40} />
                </button>
              )}
            />
          ) : (
            <>
              <Menu label="More options" items={guestItems.slice(3)} className="navbar__desktop" />
              <Button variant="ghost" className="navbar__login navbar__desktop" onClick={() => openAuth("login")}>
                Log in
              </Button>
              <Button shadow className="navbar__signup navbar__desktop" onClick={() => openAuth("signup")}>
                Sign up
              </Button>
            </>
          )}

          {/* mobile: one menu with everything */}
          <Menu
            label="Menu"
            items={user ? userItems : guestItems}
            className="navbar__mobile"
            trigger={
              user
                ? (props) => (
                    <button {...props} className="navbar__avatar-btn">
                      <Avatar src={user.avatar} name={user.name} size={32} />
                    </button>
                  )
                : undefined
            }
          />
        </div>
      </div>
    </header>
  );
}
