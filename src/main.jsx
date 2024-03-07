import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/styles/globals.scss";
import App from "@/App";
import RootError from "@/views/errors/RootError";

import Placeholder from "@/views/Placeholder";
import Logout from "@/views/Logout";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <App renderLogin={true} />,
        errorElement: <RootError />,
    },
    {
        path: "/",
        element: <App />,
        errorElement: <RootError />,
        children: [
            {
                path: "logout",
                element: <Logout />,
            },
            {
                path: "",
                element: <Placeholder />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
