import { useReducer, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { createTheme } from "@mui/material";

import "@/styles/globals.scss";
import { ACCESS_TOKEN_KEY } from "@/utils/constants";
import { detectTheme, getLocalItem } from "@/utils/util";
import { AuthReducer, DEFAULT_AUTH_STATE } from "@/utils/auth-provider";

import { ThemeReducer, DEFAULT_THEME_STATE } from "@/utils/theme-provider";
import { SCHEMES } from "@/utils/color-schemes";

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
    const setThemeKey = themeKey => {
        localStorage.setItem("theme", themeKey);
        dispatchTheme({
            key: "SET_THEME_KEY",
            payload: themeKey,
        });
    };
    const setFontType = fontType => {
        localStorage.setItem(
            "font_type",
            fontType === "regular" ? "regular" : "monospace"
        );
        dispatchTheme({
            key: "SET_FONT_TYPE",
            payload: fontType,
        });
    };
    const setFontSize = fontSize => {
        localStorage.setItem("font_size", fontSize);
        dispatchTheme({
            key: "SET_FONT_SIZE",
            payload: fontSize,
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

    // Initialise auth state
    const [authState, dispatchAuth] = useReducer(
        AuthReducer,
        DEFAULT_AUTH_STATE
    );
    const login = accessToken =>
        dispatchAuth({
            key: "LOGIN",
            payload: accessToken,
        });
    const logout = () =>
        dispatchAuth({
            key: "LOGOUT",
        });

    useMemo(() => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || "";
        if (!accessToken) {
            return;
        }

        const decodedToken = jwtDecode(accessToken);
        const tokenExpiry = decodedToken.exp * 1000;
        const now = new Date();

        if (accessToken && now.getTime() < tokenExpiry) {
            login(accessToken);
        }
    }, []);

    // MUI theme
    const muiTheme = useMemo(() => {
        // console.log(`>>> Theme state: `, themeState);
        const theme = getDesignTokens(themeState);
        // console.log(`>>> MUI theme: `, theme);
        return createTheme(theme);
    }, [themeState]);

    return {
        themeState,
        muiTheme,
        authState,

        setThemeKey,
        setFontType,
        setFontSize,
        login,
        logout,
    };
};

export default useApp;
