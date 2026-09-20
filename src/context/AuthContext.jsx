import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";
import { DEMO_CHANNEL_ID, USER_AVATARS, channelMap } from "../data/channels.js";
import { isPlainObject, isString } from "../utils/storage.js";
import { makeId } from "../utils/format.js";

// Local, mock "account". There is no server and no password: the user object
// only lives in this browser's localStorage (key "play:user").
const AuthContext = createContext(null);

const isValidUser = (u) =>
  u === null ||
  (isPlainObject(u) && isString(u.id) && isString(u.name) && isString(u.handle) && isString(u.channelId));

const toHandle = (name) => `@${name.replace(/[^a-zA-Z0-9]+/g, "") || "user"}`;

function pickAvatar(seed) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return USER_AVATARS[h % USER_AVATARS.length];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("user", null, isValidUser);
  const [authModal, setAuthModal] = useState({ open: false, mode: "login", reason: "" });
  const pendingAction = useRef(null);

  const openAuth = useCallback((mode = "login", reason = "") => {
    setAuthModal({ open: true, mode, reason });
  }, []);

  const closeAuth = useCallback(() => {
    pendingAction.current = null;
    setAuthModal((m) => ({ ...m, open: false }));
  }, []);

  const finishLogin = useCallback(
    (nextUser) => {
      setUser(nextUser);
      setAuthModal((m) => ({ ...m, open: false }));
      const pending = pendingAction.current;
      pendingAction.current = null;
      if (pending) setTimeout(() => pending(nextUser), 0);
    },
    [setUser],
  );

  // mode "login" or "signup". Both just create/refresh the local profile.
  const login = useCallback(
    ({ name, email }) => {
      const cleanEmail = String(email || "").trim().toLowerCase();
      const cleanName =
        String(name || "").trim() || cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9 ]+/g, " ").trim() || "New User";
      const id = makeId("user");
      finishLogin({
        id,
        name: cleanName,
        email: cleanEmail,
        handle: toHandle(cleanName),
        avatar: pickAvatar(cleanEmail || cleanName),
        channelId: `user-${id}`,
        description: "Welcome to my channel.",
      });
    },
    [finishLogin],
  );

  const loginAsDemo = useCallback(() => {
    const seed = channelMap[DEMO_CHANNEL_ID];
    finishLogin({
      id: "demo",
      name: seed.name,
      email: "demo@play.local",
      handle: seed.handle,
      avatar: seed.avatar,
      channelId: seed.id,
      description: seed.description,
    });
  }, [finishLogin]);

  const logout = useCallback(() => setUser(null), [setUser]);

  const updateProfile = useCallback(
    (patch) => {
      setUser((u) => (u ? { ...u, ...patch } : u));
    },
    [setUser],
  );

  // Runs `action(user)` now if logged in; otherwise opens the login modal and
  // runs it (with the freshly created user) right after a successful login.
  const requireAuth = useCallback(
    (action, reason = "Log in to continue.") => {
      if (user) {
        action(user);
        return true;
      }
      pendingAction.current = action;
      openAuth("login", reason);
      return false;
    },
    [user, openAuth],
  );

  const value = useMemo(
    () => ({ user, authModal, openAuth, closeAuth, login, loginAsDemo, logout, updateProfile, requireAuth }),
    [user, authModal, openAuth, closeAuth, login, loginAsDemo, logout, updateProfile, requireAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
