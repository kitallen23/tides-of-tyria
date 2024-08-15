import { useMemo } from "react";
import { blendColors, isLight } from "@/utils/color";

const useEventColors = ({ color, colors, downtimeOpacity }) => {
    const eventBackground = useMemo(
        () => colors?.[color] || "",
        [colors, color]
    );
    const backgroundLight = useMemo(() => colors?.light || "", [colors]);
    const backgroundDark = useMemo(() => colors?.dark || "", [colors]);
    const backgroundMiddle = useMemo(
        () =>
            blendColors({
                opacity: 0.5,
                color: colors.light,
                backgroundColor: colors.dark,
            }),
        [colors]
    );
    const isBackgroundLight = useMemo(
        () => isLight(eventBackground),
        [eventBackground]
    );
    const isMiddleBackgroundLight = useMemo(
        () => isLight(backgroundMiddle),
        [backgroundMiddle]
    );
    const isDarkBackgroundLight = useMemo(
        () => isLight(backgroundDark),
        [backgroundDark]
    );

    const isDulledBackgroundLight = useMemo(() => {
        const effectiveDulledBackgroundColor = blendColors({
            opacity: downtimeOpacity,
            color: eventBackground,
            backgroundColor: colors.background,
        });
        return isLight(effectiveDulledBackgroundColor);
    }, [eventBackground, colors, downtimeOpacity]);
    const isDulledDarkBackgroundLight = useMemo(() => {
        const effectiveDulledDarkBackgroundColor = blendColors({
            opacity: downtimeOpacity,
            color: colors.dark,
            backgroundColor: colors.background,
        });
        return isLight(effectiveDulledDarkBackgroundColor);
    }, [colors, downtimeOpacity]);

    return {
        eventBackground,
        backgroundLight,
        backgroundDark,
        backgroundMiddle,
        isBackgroundLight,
        isDarkBackgroundLight,
        isMiddleBackgroundLight,
        isDulledBackgroundLight,
        isDulledDarkBackgroundLight,
    };
};

export default useEventColors;
