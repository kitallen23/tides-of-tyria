import { CONTRAST_RATIO } from "@/utils/constants";
const THRESHOLD = 156;

/**
 * Converts a HEX color to RGB.
 *
 * @param {string} hex - The HEX color string.
 * @returns {number[]} - An array containing the RGB values [r, g, b].
 */
export function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let fullHex = hex.replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (_m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`
    );

    const bigint = parseInt(fullHex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

/**
 * Calculates the relative luminance of a color.
 *
 * @param {number} r - The red component (0-255).
 * @param {number} g - The green component (0-255).
 * @param {number} b - The blue component (0-255).
 * @returns {number} - The relative luminance.
 */
function luminance(r, g, b) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates the contrast ratio between two RGB colors.
 *
 * @param {number[]} rgb1 - An array containing the first RGB color values [r, g, b].
 * @param {number[]} rgb2 - An array containing the second RGB color values [r, g, b].
 * @returns {number} - The contrast ratio.
 */
function contrastRatio(rgb1, rgb2) {
    const lum1 = luminance(...rgb1);
    const lum2 = luminance(...rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Determines if the contrast ratio between two HEX colors is sufficient.
 *
 * @param {string} foregroundHex - The foreground HEX color string.
 * @param {string} backgroundHex - The background HEX color string.
 * @returns {boolean} - Returns true if the contrast ratio is sufficient,
 * otherwise false.
 */
export function isContrastEnough(foregroundHex, backgroundHex) {
    const foregroundRgb = hexToRgb(foregroundHex);
    const backgroundRgb = hexToRgb(backgroundHex);
    const ratio = contrastRatio(foregroundRgb, backgroundRgb);
    return ratio >= CONTRAST_RATIO;
}

/**
 * Converts RGB color values to a HEX color string.
 *
 * @param {number} r - The red component (0-255).
 * @param {number} g - The green component (0-255).
 * @param {number} b - The blue component (0-255).
 * @returns {string} - The HEX color string.
 */
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Adjusts the luminance of a HEX color.
 *
 * @param {string} hex - The HEX color string.
 * @param {number} amount - The amount to adjust the luminance by.
 * @returns {string} - The adjusted HEX color string.
 */
export function adjustLuminance(hex, amount) {
    let [r, g, b] = hexToRgb(hex);
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    return rgbToHex(r, g, b);
}

/**
 * Adjusts the luminance of a color until it has sufficient contrast with a
 * background color.
 *
 * @param {string} foregroundHex - The hex color code of the foreground color.
 * @param {string} backgroundHex - The hex color code of the background color.
 * @param {string} [mode="darken"] - The mode to adjust the color: "lighten" or "darken".
 * @returns {string} - The adjusted hex color code with sufficient contrast.
 */
export function ensureContrast(foregroundHex, backgroundHex, mode = "darken") {
    const adjustAmount = mode === "darken" ? -10 : 10;

    let adjustedColor = foregroundHex;

    while (!isContrastEnough(adjustedColor, backgroundHex)) {
        adjustedColor = adjustLuminance(adjustedColor, adjustAmount);
    }

    return adjustedColor;
}

/**
 * Determines if a color is light or dark based on a threshold value.
 *
 * @param {string} color - The color to be evaluated. Can be in HEX or RGB format.
 * @param {number} [threshold=THRESHOLD] - The threshold value to determine if the color is light. Default is the constant THRESHOLD.
 * @returns {boolean} - Returns true if the color is light, otherwise false.
 * @credit Taken from: https://awik.io/determine-color-bright-dark-using-javascript/
 */
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
        r = rgb?.[0] ?? 0;
        g = rgb?.[1] ?? 0;
        b = rgb?.[2] ?? 0;
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

/**
 * Converts an opacity value (between 0 and 1) to a two-character hex string.
 *
 * @param {number} opacity - The opacity value to convert, should be between 0 and 1.
 * @returns {string} - The corresponding two-character hex representation of the opacity.
 *
 * @example
 * // returns '00'
 * opacityToHex(0);
 *
 * @example
 * // returns '80'
 * opacityToHex(0.5);
 *
 * @example
 * // returns 'ff'
 * opacityToHex(1);
 */
export function opacityToHex(opacity) {
    const value = Math.round(opacity * 255);
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

/**
 * Blends two colors based on the given opacity.
 *
 * @param {Object} params - The parameters for blending colors.
 * @param {number} params.opacity - The opacity value (between 0 and 1) used to blend the colors.
 * @param {string} params.color - The hex color code of the foreground color.
 * @param {string} params.backgroundColor - The hex color code of the background color.
 * @returns {string} - The resulting hex color code after blending.
 *
 * @example
 * // Blends red with white at 50% opacity, resulting in a light pink color.
 * // returns '#ff8080'
 * blendColors({ opacity: 0.5, color: '#ff0000', backgroundColor: '#ffffff' });
 *
 * @example
 * // Blends blue with black at 25% opacity, resulting in a dark blue color.
 * // returns '#400000'
 * blendColors({ opacity: 0.25, color: '#0000ff', backgroundColor: '#000000' });
 */
export function blendColors({ opacity, color, backgroundColor }) {
    const color_rgb = hexToRgb(color);
    const background_rgb = hexToRgb(backgroundColor);

    const blendColor = (o, c1, c2) => Math.round(o * c1 + (1 - o) * c2);

    const new_r = blendColor(opacity, color_rgb[0], background_rgb[0]);
    const new_g = blendColor(opacity, color_rgb[1], background_rgb[1]);
    const new_b = blendColor(opacity, color_rgb[2], background_rgb[2]);

    return rgbToHex(new_r, new_g, new_b);
}
