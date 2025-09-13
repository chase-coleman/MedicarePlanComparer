import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import ComparePage from "./pages/ComparePage"
import FindAMeetingPage from "./pages/FindAMeeting";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "/explore",
        element: <ExplorePage />,
      },
      {
        path:"/compare",
        element: <ComparePage />
      },
      {
        path:"/find-us",
        element: <FindAMeetingPage />
      }
    ],
  },
]);

export default router;