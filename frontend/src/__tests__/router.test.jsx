import { describe, it, expect } from "vitest";
import router from "../router";
import App from "../App";
import LandingPage from "../pages/LandingPage";
import ExplorePage from "../pages/ExplorePage";
import ComparePage from "../pages/ComparePage";
import FindAMeetingPage from "../pages/FindAMeeting";

const [root] = router.routes;
const childFor = (path) =>
  root.children.find((child) =>
    path === "index" ? child.index : child.path === path,
  );

describe("router", () => {
  it("mounts every page under the App shell", () => {
    expect(root.path).toBe("/");
    expect(root.element.type).toBe(App);
  });

  it("lands on the landing page at the root", () => {
    expect(childFor("index").element.type).toBe(LandingPage);
  });

  it.each([
    ["explore", ExplorePage],
    ["compare", ComparePage],
    ["find-meeting", FindAMeetingPage],
  ])("routes /%s to its page", (path, page) => {
    expect(childFor(path)).toBeDefined();
    expect(childFor(path).element.type).toBe(page);
  });

  it("defines no routes beyond the four pages", () => {
    expect(root.children).toHaveLength(4);
  });

  it("matches the paths the navbar links to", () => {
    const paths = root.children
      .filter((child) => child.path)
      .map((child) => `/${child.path}`);

    expect(paths).toEqual(
      expect.arrayContaining(["/explore", "/compare", "/find-meeting"]),
    );
  });
});
