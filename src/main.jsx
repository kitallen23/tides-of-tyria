import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/styles/globals.scss";
import App from "@/App";
import RootError from "@/views/errors/RootError";

import Settings from "@/views/settings/Settings";
import Home from "@/views/home/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <RootError />,
        children: [
            {
                path: "settings",
                element: <Settings />,
            },
            {
                path: "",
                element: <Home />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
