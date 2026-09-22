import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Browsers restore the previous scroll position when a page is reloaded, so a
// visitor who refreshes lands back in the middle of a plan list with no header
// or county buttons in view. Taking manual control hands that decision to us,
// and the explicit scrollTo covers browsers that have already restored the
// position by the time this runs.
export const resetScrollOnReload = (win = window) => {
  if (win?.history && "scrollRestoration" in win.history) {
    win.history.scrollRestoration = "manual";
  }
  if (typeof win?.scrollTo === "function") {
    win.scrollTo(0, 0);
  }
};

// React Router swaps pages without a browser navigation, so the window keeps
// the previous page's scroll position -- a visitor who scrolled down Explore
// and clicked "Compare plans" would land mid-way down the Compare page. App
// calls this once so every route change starts at the top of the new page.
export const useScrollToTopOnNavigate = (win = window) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof win?.scrollTo === "function") {
      win.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, win]);
};

export default resetScrollOnReload;
