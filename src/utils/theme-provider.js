import { createContext, useContext } from "react";
import { SCHEMES } from "./color-schemes";

export const DEFAULT_THEME_STATE = {
    ...SCHEMES.kanagawa,
    colorScheme: "kanagawa",
    fontType: "monospace",
};

export const ThemeContext = createContext(DEFAULT_THEME_STATE);
export const ThemeProvider = ThemeContext.Provider;

const getTheme = themeName => {
    return SCHEMES[themeName];
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
        default: {
            throw new Error(`No reducer available for ${key}.`);
        }
    }
}
