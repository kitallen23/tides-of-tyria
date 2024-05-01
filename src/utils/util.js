import { STALE_TIME_IN_SECONDS, TITLE_SUFFIX } from "@/utils/constants";
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

    if (getLocalItem("tot-theme", false)) {
        theme = localStorage.getItem("tot-theme");
    } else if (window?.matchMedia("(prefers-color-scheme: dark)")?.matches) {
        // OS theme setting detected as dark
        theme = "kanagawa";
    }

    return theme;
}

export function getLocalItem(key, defaultValue = "") {
    const value = localStorage.getItem(key);
    if (!value || value === "null") {
        return defaultValue;
    }
    return value;
}

// export function isValidEmail(value) {
//     var re =
//         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(value));
// }

export function getStaleTime(key) {
    return STALE_TIME_IN_SECONDS?.[key]
        ? STALE_TIME_IN_SECONDS[key] * 1000
        : undefined;
}

const THRESHOLD = 156;

// Taken from: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (_, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}
export function rgbToHex(r, g, b) {
    const toHex = c => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Taken from: https://awik.io/determine-color-bright-dark-using-javascript/
export function isLight(color, threshold = THRESHOLD) {
    // Variables for red, green, blue values
    // let c: string | number | RegExp | RegExpMatchArray | boolean | null = color;
    let c = color;
    let r, g, b;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
        // If RGB --> store the red, green, blue values in separate variables
        c = color.match(
            /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
        );

        r = +color[1];
        g = +color[2];
        b = +color[3];
    } else {
        // If hex --> Convert it to RGB: NOT USED http://gist.github.com/983661

        const rgb = hexToRgb(c);
        r = (rgb && rgb.r) || 0;
        g = (rgb && rgb.g) || 0;
        b = (rgb && rgb.b) || 0;
    }

    // HSP equation from http://alienryderflex.com/hsp.html
    const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > threshold) {
        return true;
    } else {
        return false;
    }
}

export function opacityToHex(opacity) {
    const value = Math.round(opacity * 255);
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

export function blendColors({ opacity, color, backgroundColor }) {
    const color_rgb = hexToRgb(color);
    const background_rgb = hexToRgb(backgroundColor);

    const blendColor = (o, c1, c2) => Math.round(o * c1 + (1 - o) * c2);

    const new_r = blendColor(opacity, color_rgb.r, background_rgb.r);
    const new_g = blendColor(opacity, color_rgb.g, background_rgb.g);
    const new_b = blendColor(opacity, color_rgb.b, background_rgb.b);

    return rgbToHex(new_r, new_g, new_b);
}
