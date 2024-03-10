import { useReducer, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { createTheme } from "@mui/material";

import "@/styles/globals.scss";
import { ACCESS_TOKEN_KEY } from "@/utils/constants";
import { detectTheme } from "@/utils/util";
import { AuthReducer, DEFAULT_AUTH_STATE } from "@/utils/auth-provider";

import { ThemeReducer, DEFAULT_THEME_STATE } from "@/utils/theme-provider";
import { SCHEMES } from "@/utils/color-schemes";

const getDesignTokens = theme => ({
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
        fontFamily: ["Noto Sans Mono"],
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
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

    const initialiseTheme = ({ themeKey, fontType }) => {
        localStorage.setItem("theme", themeKey);
        localStorage.setItem(
            "font_type",
            fontType === "regular" ? "regular" : "monospace"
        );
        dispatchTheme({
            key: "SET_THEME",
            payload: { themeKey, fontType },
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

    useMemo(() => {
        const themeKey = detectTheme();
        const fontType = localStorage.getItem("font_type");
        initialiseTheme({ themeKey, fontType });
        document
            .querySelector('meta[name="theme-color"]')
            .setAttribute("content", SCHEMES[themeKey].colors.primary);
    }, []);

    const themeKey = useMemo(
        () => themeState.colorScheme,
        [themeState?.colorScheme]
    );
    const fontType = useMemo(() => themeState.fontType, [themeState?.fontType]);

    useMemo(() => {
        // Set document with a `data-theme` attribute
        document.documentElement.setAttribute("data-theme", themeKey);
    }, [themeKey]);
    useMemo(() => {
        // Set document with a `data-font-type` attribute
        document.documentElement.setAttribute("data-font-type", fontType);
    }, [fontType]);

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
    const muiTheme = useMemo(
        () => createTheme(getDesignTokens(themeState)),
        [themeState]
    );

    return {
        themeState,
        muiTheme,
        authState,

        setThemeKey,
        setFontType,
        login,
        logout,
    };
};

export default useApp;
