import "@/styles/globals.scss";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";

import { TITLE_SUFFIX } from "@/utils/constants";
import { ThemeProvider } from "@/utils/theme-provider";
import Layout from "@/components/Layout";

import useApp from "@/useApp";
import { TimerProvider } from "./utils/timer-provider";
import { Toaster } from "react-hot-toast";

function App() {
    const {
        themeState,
        muiTheme,

        setThemeKey,
        setFontType,
        setFontSize,
        setTimeFormat,
    } = useApp();

    return (
        <>
            <Helmet>
                <title>{TITLE_SUFFIX}</title>
            </Helmet>
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
                    <TimerProvider>
                        <Layout>
                            <Outlet />
                        </Layout>
                        <Toaster
                            position="top-center"
                            reverseOrder={false}
                            containerStyle={{
                                top: 66,
                            }}
                            toastOptions={{
                                className: "toaster",
                                style: {
                                    background: themeState.colors.backgroundNav,
                                    color: themeState.colors.body,
                                },
                                success: {
                                    iconTheme: {
                                        primary: themeState.colors.success,
                                        secondary:
                                            themeState.colors.backgroundNav,
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: themeState.colors.error,
                                        secondary:
                                            themeState.colors.backgroundNav,
                                    },
                                },
                            }}
                        />
                    </TimerProvider>
                </ThemeProvider>
            </MuiThemeProvider>
        </>
    );
}

export default App;
