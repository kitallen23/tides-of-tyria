import "@/styles/globals.scss";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";

import { TITLE_SUFFIX } from "@/utils/constants";
import { ThemeProvider } from "@/utils/theme-provider";
import { TimerProvider } from "@/utils/timer-provider";
import useGlobalHotkeys from "@/utils/hooks/useGlobalHotkeys";

import useApp from "@/useApp";
import Layout from "@/components/Layout/Layout";
import useViewportHeight from "@/utils/hooks/useViewportHeight";
import SearchModal from "@/components/SearchModal";

function App() {
    const {
        themeState,
        muiTheme,

        setThemeKey,
        setFontType,
        setFontSize,
        setTimeFormat,
        setPrimaryColor,

        isSearchOpen,
        handleCloseSearch,
        handleOpenSearch,
    } = useApp();
    useViewportHeight();

    useGlobalHotkeys({
        "/": handleOpenSearch,
    });

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
                        setPrimaryColor,
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
                        <SearchModal
                            open={isSearchOpen}
                            onClose={handleCloseSearch}
                        />
                    </TimerProvider>
                </ThemeProvider>
            </MuiThemeProvider>
        </>
    );
}

export default App;
