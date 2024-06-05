import "@/styles/globals.scss";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";

import { TITLE_SUFFIX } from "@/utils/constants";
import { ThemeProvider } from "@/utils/theme-provider";
import Layout from "@/components/Layout";

import useApp from "@/useApp";
import { TimerProvider } from "./utils/timer-provider";

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
                        <ToastContainer
                            autoClose={8000}
                            hideProgressBar={true}
                        />
                    </TimerProvider>
                </ThemeProvider>
            </MuiThemeProvider>
        </>
    );
}

export default App;
