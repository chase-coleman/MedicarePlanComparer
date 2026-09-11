import { HeroUIProvider } from "@heroui/react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { makeStore } from "../store";

// A throwaway store per test, built from the app's real reducer map so the
// tests break if a slice is renamed or dropped from the store.
export const createTestStore = (preloadedState) => makeStore(preloadedState);

/**
 * Render a component inside the providers the app gives it in production.
 *
 * @param ui              element to render
 * @param preloadedState  initial Redux state (merged per-slice by RTK)
 * @param store           an existing store, when a test needs to share one
 * @param route           initial router entry, for anything using links/NavLink
 * @param withRouter      set false for components that need no router context
 */
export const renderWithProviders = (
  ui,
  { preloadedState, store = createTestStore(preloadedState), route = "/", withRouter = true, ...options } = {},
) => {
  const Wrapper = ({ children }) => {
    const tree = withRouter ? (
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    ) : (
      children
    );
    // disableAnimation keeps HeroUI off framer-motion's lazily imported
    // feature bundle, which otherwise resolves after a test has torn its
    // environment down.
    return (
      <Provider store={store}>
        <HeroUIProvider disableAnimation>{tree}</HeroUIProvider>
      </Provider>
    );
  };

  return {
    store,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
};

/**
 * Render a component that needs no Redux or router context, still inside the
 * HeroUI provider so animations stay off.
 */
export const renderUI = (ui, options = {}) => ({
  user: userEvent.setup(),
  ...render(ui, {
    wrapper: ({ children }) => (
      <HeroUIProvider disableAnimation>{children}</HeroUIProvider>
    ),
    ...options,
  }),
});

export * from "@testing-library/react";
export { userEvent };
