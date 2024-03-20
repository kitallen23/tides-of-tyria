import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: "0.0.0.0",
    },
    plugins: [
        react({
            jsxImportSource: "@emotion/react",
            babel: {
                plugins: ["@emotion/babel-plugin"],
            },
        }),
    ],
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
