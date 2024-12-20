import { blendColors, isLight } from "@/utils/color";

const colorCache = new Map();

/**
 * @typedef {Object} UseEventColorsParams
 * @property {string} color
 * @property {Object} colors
 * @property {number} downtimeOpacity
 */

/**
 * Custom hook to compute and cache event colors.
 *
 * @param {UseEventColorsParams} params
 * @returns {Object}
 */
const useEventColors = ({ color, colors, downtimeOpacity }) => {
    const key = `${color}-${downtimeOpacity}-${JSON.stringify(colors)}`;

    if (colorCache.has(key)) {
        return colorCache.get(key);
    }

    const computedValues = {
        eventBackground: colors?.[color] || "",
        backgroundLight: colors?.light || "",
        backgroundDark: colors?.dark || "",
        backgroundMiddle: blendColors({
            opacity: 0.5,
            color: colors.light,
            backgroundColor: colors.dark,
        }),
        isBackgroundLight: isLight(colors?.[color] || ""),
        isMiddleBackgroundLight: isLight(
            blendColors({
                opacity: 0.5,
                color: colors.light,
                backgroundColor: colors.dark,
            })
        ),
        isDarkBackgroundLight: isLight(colors?.dark || ""),
        isDulledBackgroundLight: isLight(
            blendColors({
                opacity: downtimeOpacity,
                color: colors?.[color] || "",
                backgroundColor: colors.background,
            })
        ),
        isDulledDarkBackgroundLight: isLight(
            blendColors({
                opacity: downtimeOpacity,
                color: colors?.dark || "",
                backgroundColor: colors.background,
            })
        ),
    };

    colorCache.set(key, computedValues);
    return computedValues;
};

export default useEventColors;
