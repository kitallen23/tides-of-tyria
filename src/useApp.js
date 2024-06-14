import { useReducer, useMemo, useEffect } from "react";
import { alpha, createTheme } from "@mui/material";

import "@/styles/globals.scss";
import { detectTheme, getLocalItem } from "@/utils/util";

import { ThemeReducer, DEFAULT_THEME_STATE } from "@/utils/theme-provider";
import { SCHEMES } from "@/utils/color-schemes";

export const LOCAL_STORAGE_KEYS = {
    theme: "tot_theme",
    fontSize: "tot_font_size",
    fontType: "tot_font_type",
    timeFormat: "tot_time_format",
    isTimerCollapsed: "tot_is_timer_collapsed",
    primaryColor: "tot_primary_color",
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
        orange: {
            main: theme.colors.orange,
        },
        yellow: {
            main: theme.colors.yellow,
        },
        green: {
            main: theme.colors.green,
        },
        aqua: {
            main: theme.colors.aqua,
        },
        blue: {
            main: theme.colors.blue,
        },
        purple: {
            main: theme.colors.purple,
        },
        pink: {
            main: theme.colors.pink,
        },
        gray: {
            main: theme.colors.gray,
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
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(
                            theme.palette[ownerState.color]?.main ||
                                theme.palette.primary.main,
                            0.5
                        ),
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                            theme.palette[ownerState.color]?.main ||
                            theme.palette.primary.main,
                    },
                }),
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
        fontType = "regular",
        fontSize = "md",
        timeFormat = "12h",
        primaryColor = "",
    }) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.theme, themeKey);
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.fontType,
            fontType === "regular" ? "regular" : "monospace"
        );
        localStorage.setItem(LOCAL_STORAGE_KEYS.fontSize, fontSize);
        localStorage.setItem(LOCAL_STORAGE_KEYS.timeFormat, timeFormat);
        if (themeKey === "light" || themeKey === "dark") {
            localStorage.setItem(LOCAL_STORAGE_KEYS.primaryColor, primaryColor);
        }
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
    const setPrimaryColor = color => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.primaryColor, color);
        dispatchTheme({
            key: "SET_PRIMARY_COLOR",
            payload: color || SCHEMES[themeState.colorScheme].colors.primary,
        });
    };

    useMemo(() => {
        const themeKey = detectTheme();
        const fontType = getLocalItem(LOCAL_STORAGE_KEYS.fontType, "regular");
        const fontSize = getLocalItem(LOCAL_STORAGE_KEYS.fontSize, "md");
        const timeFormat = getLocalItem(LOCAL_STORAGE_KEYS.timeFormat, "12h");
        let primaryColor;
        if (themeKey === "dark" || themeKey === "light") {
            primaryColor = getLocalItem(LOCAL_STORAGE_KEYS.primaryColor, "");
        }
        initialiseTheme({
            themeKey,
            fontType,
            fontSize,
            timeFormat,
            primaryColor,
        });
        document
            .querySelector('meta[name="theme-color"]')
            .setAttribute(
                "content",
                primaryColor || SCHEMES[themeKey].colors.primary
            );
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
        setPrimaryColor,
    };
};

export default useApp;
