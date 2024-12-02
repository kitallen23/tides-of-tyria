import {
    LOCAL_STORAGE_KEYS,
    STALE_TIME_IN_SECONDS,
    TITLE_SUFFIX,
} from "@/utils/constants";
import {
    subHours as _subHours,
    format as _format,
    isAfter as _isAfter,
    formatDistanceToNow as _formatDistanceToNow,
} from "date-fns";
import { isLight } from "@/utils/color";

export function getTitle(string) {
    return `${string} | ${TITLE_SUFFIX}`;
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function relativeDateFormat({
    value,
    format = "h:mmaaa, do MMM yyyy",
    hoursHorizon = 168,
}) {
    let nowDate = new Date();
    let valueDate = new Date(value);
    let hoursHorizonDate = _subHours(nowDate, hoursHorizon);

    if (_isAfter(valueDate, hoursHorizonDate)) {
        // Time is within the horizon, so show a "relative" date
        return _formatDistanceToNow(valueDate, { addSuffix: true });
    }

    return _format(valueDate, format);
}

// See here for details:
// https://stackoverflow.com/questions/56300132/how-to-override-css-prefers-color-scheme-setting
export function detectTheme() {
    let theme = "dark";

    if (getLocalItem(LOCAL_STORAGE_KEYS.theme, false)) {
        theme = localStorage.getItem(LOCAL_STORAGE_KEYS.theme);
    } else if (window?.matchMedia("(prefers-color-scheme: dark)")?.matches) {
        // OS theme setting detected as dark
        theme = "dark";
    }

    return theme || "dark";
}

export function getLocalItem(key, defaultValue = "") {
    const value = localStorage.getItem(key);
    if (!value || value === "null") {
        return defaultValue;
    }
    return value;
}

export function getStaleTime(key) {
    return STALE_TIME_IN_SECONDS?.[key]
        ? STALE_TIME_IN_SECONDS[key] * 1000
        : undefined;
}

export function copyToClipboard(text, options) {
    try {
        navigator.clipboard.writeText(text);
        options?.onSuccess?.();
        return true;
    } catch (e) {
        console.error("Error writing text to clipboard: ", e);
        options?.onError?.();
        return false;
    }
}
export function isHexValid(c) {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    return hexPattern.test(c);
}

export function setSelectionStyle({ background, textDark, textLight }) {
    const style = document.createElement("style");
    const isBackgroundLight = isLight(background);
    style.innerHTML = `
::selection {
    background: ${background};
    color: ${isBackgroundLight ? textDark : textLight};
}`;
    document.head.appendChild(style);
}

/**
 * Checks if a string is a valid HTTP or HTTPS URL.
 * @param {string} str - The string to validate.
 * @returns {boolean} - True if valid URL, else false.
 */
export const isValidUrl = str => {
    try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};
