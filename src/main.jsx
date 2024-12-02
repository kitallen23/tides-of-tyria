import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/styles/globals.scss";
import App from "@/App";
import RootError from "@/views/errors/RootError";

import SettingsPage from "@/views/settings/SettingsPage";
import HomePage from "@/views/home/HomePage";
import ChecklistPage from "@/views/checklist/ChecklistPage";

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

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
