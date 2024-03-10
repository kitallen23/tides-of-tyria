import { useEffect, useReducer, useMemo } from "react";
import "@/styles/globals.scss";
import { ACCESS_TOKEN_KEY, TITLE_SUFFIX } from "@/utils/constants";
import { detectColorScheme } from "@/utils/util";
import {
    AuthProvider,
    AuthReducer,
    DEFAULT_AUTH_STATE,
} from "@/utils/auth-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import Login from "@/views/Login";
import Layout from "@/components/Layout";
import {
    ColorSchemeProvider,
    ColorSchemeReducer,
    DEFAULT_COLOR_SCHEME_STATE,
} from "@/utils/color-scheme-provider";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ThemeProvider, createTheme } from "@mui/material";
import { SCHEMES } from "./utils/color-schemes";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const getDesignTokens = theme => ({
    status: {
        danger: theme.colors.danger,
        warning: theme.colors.warning,
        success: theme.colors.success,
        info: theme.colors.info,
    },
    palette: {
        mode: theme?.mode || "dark",
        primary: {
            main: theme.colors.primary,
        },
        secondary: {
            main: theme.colors.secondary,
        },
        body: {
            main: theme.colors.body,
        },
        white: {
            main: "#FFFFFF",
        },
        success: {
            main: theme.colors.success,
        },
        error: {
            main: theme.colors.danger,
        },
        warning: {
            main: theme.colors.warning,
        },
        info: {
            main: theme.colors.info,
        },
    },
    typography: {
        fontFamily: ["Noto Sans Mono"],
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
    },
});

function App({ renderLogin }) {
    // Initialise color scheme
    const [colorSchemeState, dispatchColorScheme] = useReducer(
        ColorSchemeReducer,
        DEFAULT_COLOR_SCHEME_STATE
    );
    const setColorScheme = colorScheme => {
        localStorage.setItem("theme", colorScheme);
        dispatchColorScheme({
            key: "SET_COLOR_SCHEME",
            payload: colorScheme,
        });
    };
    useEffect(() => {
        const colorScheme = detectColorScheme();
        setColorScheme(colorScheme);
        document
            .querySelector('meta[name="theme-color"]')
            .setAttribute("content", SCHEMES[colorScheme].colors.primary);
    }, []);

    const colorScheme = useMemo(
        () => colorSchemeState.colorScheme,
        [colorSchemeState]
    );

    useEffect(() => {
        // Set document with a `data-theme` attribute
        document.documentElement.setAttribute("data-theme", colorScheme);
    }, [colorScheme]);

    // Initialise auth state
    const [authState, dispatchAuth] = useReducer(
        AuthReducer,
        DEFAULT_AUTH_STATE
    );
    const login = accessToken =>
        dispatchAuth({
            key: "LOGIN",
            payload: accessToken,
        });
    const logout = () =>
        dispatchAuth({
            key: "LOGOUT",
        });

    useEffect(() => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || "";
        if (!accessToken) {
            return;
        }

        const decodedToken = jwtDecode(accessToken);
        const tokenExpiry = decodedToken.exp * 1000;
        const now = new Date();

        if (accessToken && now.getTime() < tokenExpiry) {
            login(accessToken);
        }
    }, []);

    // MUI theme
    const muiTheme = useMemo(
        () => createTheme(getDesignTokens(colorSchemeState)),
        [colorSchemeState]
    );

    return (
        <>
            <Helmet>
                <title>{TITLE_SUFFIX}</title>
            </Helmet>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={muiTheme}>
                    <ColorSchemeProvider
                        value={{ ...colorSchemeState, setColorScheme }}
                    >
                        <AuthProvider
                            value={{
                                ...authState,
                                login,
                                logout,
                            }}
                        >
                            {!authState.isLoggedIn || renderLogin ? (
                                <Login />
                            ) : (
                                <Layout>
                                    <Outlet />
                                </Layout>
                            )}
                            <ToastContainer
                                autoClose={8000}
                                hideProgressBar={true}
                            />
                        </AuthProvider>
                    </ColorSchemeProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </>
    );
}

export default App;
