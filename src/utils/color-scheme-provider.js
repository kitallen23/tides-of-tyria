import { createContext, useContext } from "react";
import { COLORS, STATUS_COLORS } from "./constants";

export const DEFAULT_COLOR_SCHEME_STATE = {
    ...STATUS_COLORS,
    colorScheme: "light",
};

export const ColorSchemeContext = createContext(DEFAULT_COLOR_SCHEME_STATE);
export const ColorSchemeProvider = ColorSchemeContext.Provider;

const getColors = scheme => {
    if (scheme === "dark") {
        return {
            primary: COLORS.primaryLight,
            secondary: COLORS.secondaryLight,
            body: COLORS.bodyLight,
        };
    } else {
        return {
            primary: COLORS.primary,
            secondary: COLORS.secondary,
            body: COLORS.body,
        };
    }
};

export function useColorScheme() {
    const context = useContext(ColorSchemeContext);
    if (!context) {
        throw new Error(
            "useColorScheme must be used within a ColorSchemeProvider."
        );
    }
    return context;
}

export function ColorSchemeReducer(state, { key, payload }) {
    switch (key) {
        case "SET_COLOR_SCHEME": {
            const scheme = payload;
            const colors = getColors(scheme);
            return {
                ...state,
                ...colors,
                colorScheme: payload,
            };
        }
        default: {
            throw new Error(`No reducer available for ${key}.`);
        }
    }
}
