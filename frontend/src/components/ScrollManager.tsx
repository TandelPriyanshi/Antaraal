import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Always scroll to top on every route change. This enforces that each page
// loads from the start, as requested.
export default function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch {}
    }
  }, []);

  useEffect(() => {
    // Scroll to the very top-left on any pathname/search change
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [location.pathname, location.search]);

  return null;
}
