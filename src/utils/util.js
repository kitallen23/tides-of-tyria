import { LOCAL_STORAGE_KEYS } from "@/useApp";
import {
    STALE_TIME_IN_SECONDS,
    TITLE_SUFFIX,
} from "@/utils/constants";
import {
    subHours as _subHours,
    format as _format,
    isAfter as _isAfter,
    formatDistanceToNow as _formatDistanceToNow,
} from "date-fns";

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
    let theme = "kanagawa";

    if (getLocalItem(LOCAL_STORAGE_KEYS.theme, false)) {
        theme = localStorage.getItem(LOCAL_STORAGE_KEYS.theme);
    } else if (window?.matchMedia("(prefers-color-scheme: dark)")?.matches) {
        // OS theme setting detected as dark
        theme = "kanagawa";
    }

    return theme || "kanagawa";
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

