import "@/styles/globals.scss";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

import { TITLE_SUFFIX } from "@/utils/constants";
import { ThemeProvider } from "@/utils/theme-provider";
import { TimerProvider } from "@/utils/timer-provider";
import useGlobalHotkeys from "@/utils/hooks/useGlobalHotkeys";

import useApp from "@/useApp";
import Layout from "@/components/Layout";
import HelpModal from "@/components/HelpModal";

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

    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    useGlobalHotkeys({
        "?": () => setIsHelpModalOpen(true),
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
                        <HelpModal
                            isOpen={isHelpModalOpen}
                            onClose={() => setIsHelpModalOpen(false)}
                        />
                    </TimerProvider>
                </ThemeProvider>
            </MuiThemeProvider>
        </>
    );
}

export default App;
