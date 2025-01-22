import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";

import "@/styles/globals.scss";
import { TITLE_SUFFIX } from "@/utils/constants";
import { ThemeProvider } from "@/utils/theme-provider";
import { TimerProvider } from "@/utils/timer-provider";
import useViewportHeight from "@/utils/hooks/useViewportHeight";

import useApp from "@/useApp";
import Layout from "@/components/Layout/Layout";
import SearchModal from "@/components/Search/SearchModal";
import { SearchModalProvider } from "@/components/Search/SearchModalContext";
import useAnalytics from "./utils/hooks/useAnalytics";
import JsonLd from "./components/JsonLd";
import SkeletonChecklistPage from "@/views/skeleton/SkeletonChecklistPage";
import SkeletonEventTimerPage from "@/views/skeleton/SkeletonEventTimerPage";
import SkeletonSettingsPage from "@/views/skeleton/SkeletonSettingsPage";

const FALLBACKS = {
    "/checklist": <SkeletonChecklistPage />,
    "/settings": <SkeletonSettingsPage />,
    "/": <SkeletonEventTimerPage />,
};

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
    useAnalytics();
    const { pathname } = useLocation();

    return (
        <>
            <Helmet>
                <title>{TITLE_SUFFIX}</title>
            </Helmet>
            <JsonLd />
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
                                <Suspense
                                    fallback={
                                        FALLBACKS[pathname] ?? (
                                            <SkeletonEventTimerPage />
                                        )
                                    }
                                >
                                    <Outlet />
                                </Suspense>
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
