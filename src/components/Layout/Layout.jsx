import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../Navbar/Navbar.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import MobileNav from "../MobileNav/MobileNav.jsx";
import AuthModal from "../AuthModal/AuthModal.jsx";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary.jsx";
import "./Layout.css";

// Shared shell: navbar, sidebar (icon-only on the watch page), page outlet, bottom bar on phones.
export default function Layout() {
  const { pathname } = useLocation();
  const compact = pathname.startsWith("/watch/");

  // start every navigation at the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <div className="app__body">
        <Sidebar variant={compact ? "compact" : "full"} />
        <main id="main" className="app__main" tabIndex={-1}>
          {/* resetKeys via key: a crash on one page does not stick after navigating away */}
          <ErrorBoundary key={pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
      <MobileNav />
      <AuthModal />
    </div>
  );
}
