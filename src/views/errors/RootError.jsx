import { useEffect, useMemo, useReducer } from "react";
import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button, createTheme } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "@/styles/modules/errors.module.scss";

import {
    ThemeProvider,
    ThemeReducer,
    DEFAULT_THEME_STATE,
} from "@/utils/theme-provider";
import { SCHEMES } from "@/utils/color-schemes";
import { getTitle, detectTheme, getLocalItem } from "@/utils/util";
import { getDesignTokens } from "@/useApp";
import Logo from "@/components/Logo";

const RootError = () => {
    // Initialise color scheme
    const [themeState, dispatchTheme] = useReducer(
        ThemeReducer,
        DEFAULT_THEME_STATE
    );

    const initialiseTheme = ({
        themeKey,
        fontType = "monospace",
        fontSize = "md",
    }) => {
        localStorage.setItem("theme", themeKey);
        localStorage.setItem(
            "font_type",
            fontType === "regular" ? "regular" : "monospace"
        );
        localStorage.setItem("font_size", fontSize);
        dispatchTheme({
            key: "SET_THEME",
            payload: { themeKey, fontType, fontSize },
        });
    };

    useMemo(() => {
        const themeKey = detectTheme();
        const fontType = getLocalItem("font_type", "monospace");
        const fontSize = getLocalItem("font_size", "md");
        initialiseTheme({ themeKey, fontType, fontSize });
        document
            .querySelector('meta[name="theme-color"]')
            .setAttribute("content", SCHEMES[themeKey].colors.primary);
    }, []);

    const themeKey = useMemo(
        () => themeState.colorScheme,
        [themeState?.colorScheme]
    );
    const fontType = useMemo(() => themeState.fontType, [themeState?.fontType]);
    const fontSize = useMemo(() => themeState.fontSize, [themeState?.fontSize]);

    useMemo(() => {
        // Set document with a `data-theme` attribute
        document.documentElement.setAttribute("data-theme", themeKey);
    }, [themeKey]);
    useMemo(() => {
        // Set document with a `data-font-type` attribute
        document.documentElement.setAttribute("data-font-type", fontType);
    }, [fontType]);
    useMemo(() => {
        // Set document with a `data-font-size` attribute
        document.documentElement.setAttribute("data-font-size", fontSize);
    }, [fontSize]);

    const error = useRouteError();
    useEffect(() => {
        console.error(`Error: `, error);
    }, [error]);

    const errorText = useMemo(() => {
        if (isRouteErrorResponse(error)) {
            if (error.status === 404) {
                return "This page doesn't exist!";
            }

            if (error.status === 401) {
                return "You aren't authorized to see this.";
            }

            if (error.status === 503) {
                return "Looks like our API is down.";
            }
            return "Something went wrong.";
        }
    }, [error]);
    const errorStatus = useMemo(() => {
        if (error.status === 404) {
            return "404";
        }
        if (error.status === 401) {
            return "401";
        }
        if (error.status === 503) {
            return "503";
        }
        return;
    }, [error]);

    const title = useMemo(
        () => getTitle(errorStatus || "Error"),
        [errorStatus]
    );

    // MUI theme
    const muiTheme = useMemo(() => {
        const theme = getDesignTokens(themeState);
        return createTheme(theme);
    }, [themeState]);

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <MuiThemeProvider theme={muiTheme}>
                <ThemeProvider
                    value={{
                        ...themeState,
                    }}
                >
                    <div className={styles.errorPage}>
                        <div className={styles.innerWrapper}>
                            <div className={styles.logo}>
                                <Logo
                                    color={themeState.colors.body}
                                    size={100}
                                />
                            </div>
                            <div className={styles.text}>
                                <div>{errorStatus || "Error"}</div>
                                <div>
                                    {errorText || "Something went wrong."}
                                </div>
                            </div>
                            <div className={styles.buttons}>
                                <Link to="/" className={globalStyles.internalLink}>
                                    <Button color="primary">
                                        Return to homepage
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </ThemeProvider>
            </MuiThemeProvider>
        </>
    );
};

export default RootError;
