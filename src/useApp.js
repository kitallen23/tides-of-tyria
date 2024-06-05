import { useReducer, useMemo } from "react";
import { createTheme } from "@mui/material";

import "@/styles/globals.scss";
import { detectTheme, getLocalItem } from "@/utils/util";

import { ThemeReducer, DEFAULT_THEME_STATE } from "@/utils/theme-provider";
import { SCHEMES } from "@/utils/color-schemes";

export const LOCAL_STORAGE_KEYS = {
    theme: "tot_theme",
    fontSize: "tot_font_size",
    fontType: "tot_font_type",
    timeFormat: "tot_time_format",
};

export const getDesignTokens = theme => ({
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
        muted: {
            main: theme.colors.muted,
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
        fontFamily: [
            theme.fontType === "regular" ? "Noto Sans" : "Noto Sans Mono",
        ],
        fontSize:
            theme.fontSize === "sm" ? 12 : theme.fontSize === "lg" ? 16 : 14,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    fontSize: "1em",
                },
            },
        },
    },
});

const useApp = () => {
    // Initialise color scheme
    const [themeState, dispatchTheme] = useReducer(
        ThemeReducer,
        DEFAULT_THEME_STATE
    );

    const initialiseTheme = ({
        themeKey,
        fontType = "monospace",
        fontSize = "md",
        timeFormat = "12h",
    }) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.theme, themeKey);
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.fontType,
            fontType === "regular" ? "regular" : "monospace"
        );
        localStorage.setItem(LOCAL_STORAGE_KEYS.fontSize, fontSize);
        localStorage.setItem(LOCAL_STORAGE_KEYS.timeFormat, timeFormat);
        dispatchTheme({
            key: "SET_THEME",
            payload: { themeKey, fontType, fontSize, timeFormat },
        });
    };
    const setThemeKey = themeKey => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.theme, themeKey);
        dispatchTheme({
            key: "SET_THEME_KEY",
            payload: themeKey,
        });
    };
    const setFontType = fontType => {
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.fontType,
            fontType === "regular" ? "regular" : "monospace"
        );
        dispatchTheme({
            key: "SET_FONT_TYPE",
            payload: fontType,
        });
    };
    const setFontSize = fontSize => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.fontSize, fontSize);
        dispatchTheme({
            key: "SET_FONT_SIZE",
            payload: fontSize,
        });
    };
    const setTimeFormat = timeFormat => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.timeFormat, timeFormat);
        dispatchTheme({
            key: "SET_TIME_FORMAT",
            payload: timeFormat,
        });
    };

    useMemo(() => {
        const themeKey = detectTheme();
        const fontType = getLocalItem(LOCAL_STORAGE_KEYS.fontType, "monospace");
        const fontSize = getLocalItem(LOCAL_STORAGE_KEYS.fontSize, "md");
        const timeFormat = getLocalItem(LOCAL_STORAGE_KEYS.timeFormat, "12h");
        initialiseTheme({ themeKey, fontType, fontSize, timeFormat });
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

    // MUI theme
    const muiTheme = useMemo(() => {
        const theme = getDesignTokens(themeState);
        return createTheme(theme);
    }, [themeState]);

    return {
        themeState,
        muiTheme,

        setThemeKey,
        setFontType,
        setFontSize,
        setTimeFormat,
    };
};

export default useApp;
