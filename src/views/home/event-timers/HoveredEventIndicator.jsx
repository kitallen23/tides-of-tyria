import { useContext, useEffect, useMemo, useState } from "react";

import styles from "@/styles/modules/event-timer.module.scss";
import { format } from "date-fns";
import { useTheme } from "@/utils/theme-provider";
import EventTimerContext from "./EventTimerContext";
import { ensureContrast, isContrastEnough } from "@/utils/color";

const HoveredEventIndicator = ({ showLabel }) => {
    const { colors, timeFormat, mode } = useTheme();
    const { currentTimeBlockStart, eventWrapperRef, width: parentWidth } =
        useContext(EventTimerContext);
    const formatString = useMemo(
        () => (timeFormat === "12h" ? "h:mmaaa" : "H:mm"),
        [timeFormat]
    );

    const { hoveredEvent, selectedEvent } = useContext(EventTimerContext);
    const [hoveredEventLeftPixels, setHoveredEventLeftPixels] = useState(0);

    const activeEvent = useMemo(
        () => selectedEvent || hoveredEvent || undefined,
        [selectedEvent, hoveredEvent]
    );

    const highlightThemeColor = useMemo(
        () =>
            activeEvent?.color === "gray"
                ? "primary"
                : activeEvent?.color ?? undefined,
        [activeEvent]
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
                return ensureContrast(
                    schemeColor,
                    background,
                    mode === "light" ? "darken" : "lighten"
                );
            }
        } else {
            return undefined;
        }
    }, [highlightThemeColor, colors, mode]);

    useEffect(() => {
        if (activeEvent?.id && eventWrapperRef.current) {
            const hoveredElement = eventWrapperRef.current.querySelector(
                `#${activeEvent.id}`
            );
            if (hoveredElement) {
                const distanceFromLeft = hoveredElement.offsetLeft;
                setHoveredEventLeftPixels(distanceFromLeft);
            }
        }
    }, [eventWrapperRef, currentTimeBlockStart, activeEvent?.id, parentWidth]);

    const shouldRender = useMemo(
        () => (activeEvent ? true : false),
        [activeEvent]
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
                    {activeEvent?.isContinued ? "…" : ""}
                    {format(activeEvent?.startDate, formatString)}
                </div>
            ) : undefined}
        </div>
    );
};

export default HoveredEventIndicator;
