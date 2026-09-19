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

export default resetScrollOnReload;
