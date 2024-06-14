import { createContext, useContext } from "react";
import { SCHEMES } from "./color-schemes";
import { getLocalItem } from "./util";
import { LOCAL_STORAGE_KEYS } from "@/useApp";

export const DEFAULT_THEME_STATE = {
    ...SCHEMES.dark,
    colorScheme: "dark",
    fontType: "monospace",
    fontSize: "md",
    timeFormat: "12h",
};

export const ThemeContext = createContext(DEFAULT_THEME_STATE);
export const ThemeProvider = ThemeContext.Provider;

const getTheme = themeName => {
    const theme = SCHEMES[themeName];
    let primary;
    if (themeName === "dark" || themeName === "light") {
        primary = getLocalItem(LOCAL_STORAGE_KEYS.primaryColor);
    }
    return {
        ...theme,
        colors: {
            ...theme.colors,
            primary: primary || theme.colors.primary,
        },
    };
};

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider.");
    }
    return context;
}

export function ThemeReducer(state, { key, payload }) {
    switch (key) {
        case "SET_THEME": {
            const { themeKey, ...rest } = payload;
            const themeValues = getTheme(themeKey);
            return {
                ...state,
                ...rest,
                ...themeValues,
                colorScheme: themeKey,
            };
        }
        case "SET_PRIMARY_COLOR": {
            const color = payload;
            return {
                ...state,
                colors: {
                    ...state.colors,
                    primary: color,
                },
            };
        }
        case "SET_THEME_KEY": {
            const themeKey = payload;
            const themeValues = getTheme(themeKey);
            return {
                ...state,
                ...themeValues,
                colorScheme: themeKey,
            };
        }
        case "SET_FONT_TYPE": {
            return {
                ...state,
                fontType: payload,
            };
        }
        case "SET_FONT_SIZE": {
            return {
                ...state,
                fontSize: payload,
            };
        }
        case "SET_TIME_FORMAT": {
            return {
                ...state,
                timeFormat: payload,
            };
        }
        default: {
            throw new Error(`No reducer available for ${key}.`);
        }
    }
}
