import { useEffect, useRef, useState } from "react";
import {
    getHours,
    isEqual,
    setHours,
    setMilliseconds,
    setMinutes,
    setSeconds,
} from "date-fns";
import styles from "@/styles/modules/event-timer.module.scss";

import EventRegion, { CurrentTimeIndicator, TimeRow } from "./EventComponents";
import META_EVENTS from "@/utils/meta_events";
import { useTimer } from "@/utils/hooks/useTimer";
import EventTimerContext from "./EventTimerContext";
import { useResizeDetector } from "react-resize-detector";

// Obtains the start time of a "time block"; a 2-hour period of time, relative to the
// local timezone, that started on the last 1-hour time window.
// A time block may be 1pm - 3pm, or 2am - 4am.
const getCurrentTimeBlockStart = (offset = 0) => {
    const now = new Date();
    const hoursSinceMidnight = getHours(now);
    const timeBlockStart = setMilliseconds(
        setSeconds(
            setMinutes(setHours(now, hoursSinceMidnight + offset), 0),
            0
        ),
        0
    );

    return timeBlockStart;
};

const EventTimers = ({ offset }) => {
    const scrollParentRef = useRef(null);

    // This is the width of the entire timer component.
    // We calculate this using a special "ruler" element, to ensure that its
    // value is always correct (as this ruler never gains any content)
    const { ref: widthRulerRef } = useResizeDetector();
    const width = widthRulerRef?.current?.scrollWidth || 0;

    // Stores the start moment of the selected 2-hour time window
    // (defaults to the current one)
    // Note that this is relative to the local time, e.g. the first window of
    // today is always 12:00am local time
    const { key } = useTimer();
    const [currentTimeBlockStart, setCurrentTimeBlockStart] = useState(
        getCurrentTimeBlockStart()
    );

    // Update the current time block, but only when necessary
    useEffect(() => {
        const newCurrentTimeBlockStart = getCurrentTimeBlockStart(offset);
        if (!isEqual(currentTimeBlockStart, newCurrentTimeBlockStart)) {
            setCurrentTimeBlockStart(newCurrentTimeBlockStart);
        }
    }, [key, currentTimeBlockStart, offset]);

    useEffect(() => {
        if (scrollParentRef?.current) {
            const children = scrollParentRef.current.children;
            const container0 = children?.[1];
            const container1 = children?.[2];

            if (!container0 || !container1) {
                return;
            }

            const handleScroll0 = () => {
                container1.scrollLeft = container0.scrollLeft;
            };

            const handleScroll1 = () => {
                container0.scrollLeft = container1.scrollLeft;
            };

            container0.addEventListener("scroll", handleScroll0);
            container1.addEventListener("scroll", handleScroll1);

            // Cleanup function
            return () => {
                container0.removeEventListener("scroll", handleScroll0);
                container1.removeEventListener("scroll", handleScroll1);
            };
        }
    }, [scrollParentRef]);

    return (
        <EventTimerContext.Provider value={{ width, currentTimeBlockStart }}>
            <div className={styles.eventTimer}>
                <div className={styles.leftFrame}>Left</div>
                <div className={styles.rightFrame} ref={scrollParentRef}>
                    <div className={styles.widthRuler}>
                        <div ref={widthRulerRef} />
                    </div>
                    <TimeRow />
                    <div className={styles.eventContainer}>
                        <CurrentTimeIndicator />

                        <div className={styles.regions}>
                            {META_EVENTS.map(region => (
                                <EventRegion
                                    key={region.key}
                                    region={region}
                                    currentTimeBlockStart={
                                        currentTimeBlockStart
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </EventTimerContext.Provider>
    );
};

export default EventTimers;
