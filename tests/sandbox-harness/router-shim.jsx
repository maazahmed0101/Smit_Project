// TEST-ONLY minimal stand-in for react-router-dom (real package could not be installed offline).
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
const Ctx = createContext(null);
const RouteCtx = createContext({ params: {}, outlet: null });

export function BrowserRouter({ children }) {
  const [loc, setLoc] = useState({ pathname: location.pathname, search: location.search });
  useEffect(() => {
    const on = () => setLoc({ pathname: location.pathname, search: location.search });
    window.addEventListener("popstate", on);
    return () => window.removeEventListener("popstate", on);
  }, []);
  const navigate = useCallback((to, opts = {}) => {
    if (typeof to === "number") return history.go(to);
    history[opts.replace ? "replaceState" : "pushState"]({}, "", to);
    setLoc({ pathname: location.pathname, search: location.search });
  }, []);
  return <Ctx.Provider value={{ loc, navigate }}>{children}</Ctx.Provider>;
}
export const useNavigate = () => useContext(Ctx).navigate;
export const useLocation = () => useContext(Ctx).loc;
export const useParams = () => useContext(RouteCtx).params;
export function useSearchParams() {
  const { loc, navigate } = useContext(Ctx);
  const p = useMemo(() => new URLSearchParams(loc.search), [loc.search]);
  return [p, (next) => navigate(loc.pathname + "?" + new URLSearchParams(next).toString())];
}
export function Route() { return null; }

function flatten(children, base, chain, out) {
  React.Children.forEach(children, (c) => {
    if (!c || c.type !== Route) return;
    const { path, index, element, children: kids } = c.props;
    const full = path ? (base + "/" + path).replace(/\/+/g, "/") : base;
    const nextChain = [...chain, element];
    if (kids) flatten(kids, full, nextChain, out);
    if (index || (path && !kids) ) out.push({ pattern: index ? base || "/" : full, chain: nextChain });
    else if (!path && !kids) out.push({ pattern: base || "/", chain: nextChain });
  });
}
function match(pattern, pathname) {
  const ps = pattern.split("/").filter(Boolean);
  const xs = pathname.split("/").filter(Boolean);
  const params = {};
  let i = 0;
  for (; i < ps.length; i++) {
    const s = ps[i];
    if (s === "*") return { params, score: 0 };
    if (s.startsWith(":")) {
      const opt = s.endsWith("?");
      const name = s.slice(1).replace("?", "");
      if (xs[i] === undefined) { if (opt) continue; return null; }
      params[name] = decodeURIComponent(xs[i]);
    } else if (s !== xs[i]) return null;
  }
  if (xs.length > ps.length) return null;
  return { params, score: ps.length + 1 };
}
export function Routes({ children }) {
  const { loc } = useContext(Ctx);
  const list = []; flatten(children, "", [], list);
  let best = null;
  for (const r of list) { const m = match(r.pattern, loc.pathname); if (m && (!best || m.score > best.m.score)) best = { r, m }; }
  if (!best) return null;
  let el = null;
  for (let i = best.r.chain.length - 1; i >= 0; i--) {
    const inner = el; const e = best.r.chain[i];
    el = <RouteCtx.Provider value={{ params: best.m.params, outlet: inner }}>{e}</RouteCtx.Provider>;
  }
  return el;
}
export const Outlet = () => useContext(RouteCtx).outlet;
export function Navigate({ to, replace }) { const nav = useNavigate(); useEffect(() => nav(to, { replace }), [to]); return null; }
export function Link({ to, onClick, children, ...rest }) {
  const nav = useNavigate();
  return <a href={to} {...rest} onClick={(e) => { onClick?.(e); if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey) return; e.preventDefault(); nav(to); }}>{children}</a>;
}
export function NavLink({ to, end, className, children, ...rest }) {
  const { loc } = useContext(Ctx);
  const path = to.split("?")[0];
  const isActive = end ? loc.pathname === path : loc.pathname === path || loc.pathname.startsWith(path.replace(/\/$/, "") + "/");
  return <Link to={to} className={typeof className === "function" ? className({ isActive }) : className} aria-current={isActive ? "page" : undefined} {...rest}>{children}</Link>;
}
