import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import ComparePage from "./pages/ComparePage"

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
      }
    ],
  },
]);

export default router;