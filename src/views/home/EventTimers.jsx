import { useEffect, useRef, useState } from "react";
import {
    getHours,
    isEqual,
    setHours,
    setMilliseconds,
    setMinutes,
    setSeconds,
} from "date-fns";
import { useResizeDetector } from "react-resize-detector";
import styles from "@/styles/modules/event-timer.module.scss";

import EventRegion, { CurrentTimeIndicator, TimeRow } from "./EventComponents";
import META_EVENTS from "@/utils/meta_events";
import { useTimer } from "@/utils/hooks/useTimer";
import EventTimerContext from "./EventTimerContext";

// Obtains the start time of a "time block"; a period of time, relative to the
// local timezone, that started on the last 2-hour time window.
// E.g. 12am, 2am, 4am, etc.
const getCurrentTimeBlockStart = () => {
    const now = new Date();
    const hoursSinceMidnight = getHours(now);
    const hoursSinceLastBlock = hoursSinceMidnight % 2;
    const timeBlockStart = setMilliseconds(
        setSeconds(
            setMinutes(
                setHours(now, hoursSinceMidnight - hoursSinceLastBlock),
                0
            ),
            0
        ),
        0
    );

    return timeBlockStart;
};

const EventTimers = () => {
    const scrollParentRef = useRef(null);
    const { ref: eventContainerRef } = useResizeDetector();
    const eventContainerWidth = eventContainerRef?.current?.scrollWidth || 0;

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
        const newCurrentTimeBlockStart = getCurrentTimeBlockStart();
        if (!isEqual(currentTimeBlockStart, newCurrentTimeBlockStart)) {
            setCurrentTimeBlockStart(newCurrentTimeBlockStart);
        }
    }, [key, currentTimeBlockStart]);

    useEffect(() => {
        if (scrollParentRef?.current) {
            const children = scrollParentRef.current.children;
            const container0 = children?.[0];
            const container1 = children?.[1];

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
        <EventTimerContext.Provider value={{ eventContainerWidth, currentTimeBlockStart }}>
            <div className={styles.eventTimer}>
                <div className={styles.leftFrame}>Left</div>
                <div className={styles.rightFrame} ref={scrollParentRef}>
                    <TimeRow currentTimeBlockStart={currentTimeBlockStart} />
                    <div
                        className={styles.eventContainer}
                        ref={eventContainerRef}
                    >
                        <CurrentTimeIndicator
                            currentTimeBlockStart={currentTimeBlockStart}
                            parentWidth={eventContainerWidth}
                        />

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
