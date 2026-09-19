import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router";
import store from "./store";
import { Provider } from "react-redux";
import { resetScrollOnReload } from "./functions/scrollRestoration";

// Runs before the first render, so a reload starts at the top of the page
// rather than wherever the visitor had scrolled to.
resetScrollOnReload();

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
);