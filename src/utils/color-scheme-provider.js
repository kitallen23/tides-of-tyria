import { createContext, useContext } from "react";
import { SCHEMES } from "./color-schemes";

export const DEFAULT_COLOR_SCHEME_STATE = {
    ...SCHEMES.kanagawa,
    colorScheme: "kanagawa",
};

export const ColorSchemeContext = createContext(DEFAULT_COLOR_SCHEME_STATE);
export const ColorSchemeProvider = ColorSchemeContext.Provider;

const getScheme = schemeName => {
    return SCHEMES[schemeName];
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
            const schemeName = payload;
            const schemeValues = getScheme(schemeName);
            return {
                ...state,
                ...schemeValues,
                colorScheme: payload,
            };
        }
        default: {
            throw new Error(`No reducer available for ${key}.`);
        }
    }
}
