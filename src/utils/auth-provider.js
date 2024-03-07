import { createContext, useContext } from "react";
import { ACCESS_TOKEN_KEY } from "@/utils/constants";

export const DEFAULT_AUTH_STATE = {
    accessToken: null,
    // TODO: Change this to false, set up auth server
    isLoggedIn: true,
};

export const AuthContext = createContext(DEFAULT_AUTH_STATE);
export const AuthProvider = AuthContext.Provider;

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider.");
    }
    return context;
}

export function AuthReducer(state, { key, payload }) {
    switch (key) {
        case "LOGIN": {
            localStorage.setItem(ACCESS_TOKEN_KEY, payload);
            return {
                ...state,
                accessToken: payload,
                isLoggedIn: true,
            };
        }
        case "LOGOUT": {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            return {
                ...state,
                accessToken: undefined,
                isLoggedIn: false,
            };
        }
        default: {
            throw new Error(`No reducer available for ${key}.`);
        }
    }
}
