import "@/styles/globals.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";

import { TITLE_SUFFIX } from "@/utils/constants";
import { AuthProvider } from "@/utils/auth-provider";
import { ThemeProvider } from "@/utils/theme-provider";
import Login from "@/views/Login";
import Layout from "@/components/Layout";

import useApp from "@/useApp";
import { TimerProvider } from "./utils/timer-provider";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

function App({ renderLogin }) {
    const {
        themeState,
        muiTheme,
        authState,

        setThemeKey,
        setFontType,
        setFontSize,
        setTimeFormat,
        login,
        logout,
    } = useApp();

    return (
        <>
            <Helmet>
                <title>{TITLE_SUFFIX}</title>
            </Helmet>
            <QueryClientProvider client={queryClient}>
                <MuiThemeProvider theme={muiTheme}>
                    <ThemeProvider
                        value={{
                            ...themeState,
                            setThemeKey,
                            setFontType,
                            setFontSize,
                            setTimeFormat,
                        }}
                    >
                        <AuthProvider
                            value={{
                                ...authState,
                                login,
                                logout,
                            }}
                        >
                            <TimerProvider>
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
                            </TimerProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </MuiThemeProvider>
            </QueryClientProvider>
        </>
    );
}

export default App;
