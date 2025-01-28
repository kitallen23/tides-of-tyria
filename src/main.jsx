import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/styles/globals.scss";
import App from "@/App";
import RootError from "@/views/errors/RootError";
import { ChecklistPage, HomePage, SettingsPage } from "@/lazyRoutes";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <RootError />,
        children: [
            {
                path: "settings",
                element: <SettingsPage />,
            },
            {
                path: "",
                element: <HomePage />,
            },
            {
                path: "/checklist",
                element: <ChecklistPage />,
            },
        ],
    },
]);

window.addEventListener("vite:preloadError", () => {
    window.location.reload();
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
