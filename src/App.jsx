import "@/styles/globals.scss";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";

import { TITLE_SUFFIX } from "@/utils/constants";
import { ThemeProvider } from "@/utils/theme-provider";
import { TimerProvider } from "@/utils/timer-provider";

import useApp from "@/useApp";
import Layout from "@/components/Layout/Layout";
import useViewportHeight from "@/utils/hooks/useViewportHeight";
import SearchModal from "@/components/Search/SearchModal";
import { SearchModalProvider } from "@/components/Search/SearchModalContext";

function App() {
    const {
        themeState,
        muiTheme,

        setThemeKey,
        setFontType,
        setFontSize,
        setTimeFormat,
        setPrimaryColor,
    } = useApp();
    useViewportHeight();

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
                        <SearchModalProvider>
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
                                        background:
                                            themeState.colors.backgroundNav,
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
                            <SearchModal />
                        </SearchModalProvider>
                    </TimerProvider>
                </ThemeProvider>
            </MuiThemeProvider>
        </>
    );
}

export default App;
