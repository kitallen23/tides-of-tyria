import { useContext, useMemo } from "react";
import { addMinutes, differenceInSeconds } from "date-fns";

import styles from "../event-timer.module.scss";
import { useTimer } from "@/utils/hooks/useTimer";

import EventTimerContext from "../EventTimerContext";
import { TIME_BLOCK_MINS } from "../utils";

const CurrentTimeIndicator = () => {
    const { currentTimeBlockStart, width: parentWidth } =
        useContext(EventTimerContext);
    const { now } = useTimer();

    const leftPixels = useMemo(() => {
        const totalSecondsInBlock = TIME_BLOCK_MINS * 60;
        const secondsSinceStartOfBlock = differenceInSeconds(
            now,
            currentTimeBlockStart
        );
        const percentage = Number(
            secondsSinceStartOfBlock / totalSecondsInBlock
        ).toFixed(4);

        return Math.round(parentWidth * percentage);
    }, [now, currentTimeBlockStart, parentWidth]);

    const shouldRender = useMemo(() => {
        const currentTimeBlockEnd = addMinutes(
            currentTimeBlockStart,
            TIME_BLOCK_MINS
        );
        if (now >= currentTimeBlockStart && now <= currentTimeBlockEnd) {
            return true;
        }
        return false;
    }, [currentTimeBlockStart, now]);

    if (!shouldRender) {
        return null;
    }
    return (
        <div
            className={styles.currentTimeIndicator}
            style={{
                left: leftPixels,
            }}
        />
    );
};

export default CurrentTimeIndicator;
