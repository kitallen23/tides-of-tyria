import { useContext, useEffect, useMemo, useState } from "react";

import styles from "@/styles/modules/event-timer.module.scss";
import { format } from "date-fns";
import { useTheme } from "@/utils/theme-provider";
import EventTimerContext from "./EventTimerContext";
import { ensureContrast, isContrastEnough } from "@/utils/color";

const HoveredEventIndicator = ({ showLabel }) => {
    const { colors, timeFormat, mode } = useTheme();
    const { currentTimeBlockStart, eventWrapperRef } =
        useContext(EventTimerContext);
    const formatString = useMemo(
        () => (timeFormat === "12h" ? "h:mmaaa" : "H:mm"),
        [timeFormat]
    );

    const { hoveredEvent } = useContext(EventTimerContext);
    const [hoveredEventLeftPixels, setHoveredEventLeftPixels] = useState(0);

    const highlightThemeColor = useMemo(
        () =>
            hoveredEvent?.color === "gray"
                ? "primary"
                : hoveredEvent?.color ?? undefined,
        [hoveredEvent]
    );
    const highlightColor = useMemo(() => {
        const schemeColor = colors?.[highlightThemeColor] ?? undefined;
        const background = colors.background;
        if (schemeColor) {
            const schemeColorHasEnoughContrast = isContrastEnough(
                schemeColor,
                colors.background
            );
            if (schemeColorHasEnoughContrast) {
                return schemeColor;
            } else {
                return ensureContrast(schemeColor, background, mode === "light" ? "darken" : "lighten");
            }
        } else {
            return undefined;
        }
    }, [highlightThemeColor, colors, mode]);

    useEffect(() => {
        if (hoveredEvent?.id && eventWrapperRef.current) {
            const hoveredElement = eventWrapperRef.current.querySelector(
                `#${hoveredEvent.id}`
            );
            if (hoveredElement) {
                const distanceFromLeft = hoveredElement.offsetLeft;
                setHoveredEventLeftPixels(distanceFromLeft);
            }
        }
    }, [eventWrapperRef, currentTimeBlockStart, hoveredEvent?.id]);

    const shouldRender = useMemo(
        () => (hoveredEvent ? true : false),
        [hoveredEvent]
    );

    if (!shouldRender) {
        return null;
    }
    return (
        <div
            className={styles.hoveredEventIndicator}
            style={{
                left: hoveredEventLeftPixels,
                borderColor: highlightColor,
            }}
        >
            {showLabel ? (
                <div
                    className={styles.timeLabel}
                    style={{ color: highlightColor }}
                >
                    {hoveredEvent?.isContinued ? "…" : ""}
                    {format(hoveredEvent?.startDate, formatString)}
                </div>
            ) : undefined}
        </div>
    );
};

export default HoveredEventIndicator;
