import { useEffect, useMemo, useRef } from "react";
import styles from "@/styles/modules/event-timer.module.scss";
import {
    differenceInMinutes,
    getHours,
    setHours,
    setMinutes,
    setSeconds,
} from "date-fns";

import EventRegion, { TimeRow } from "./EventComponents";
import { useTimer } from "@/utils/hooks/useTimer";
import useTimerValue from "@/utils/hooks/useTimerValue";
import { useResizeDetector } from "react-resize-detector";

const META_EVENTS = [
    {
        key: "core_tyria",
        name: "CORE",
        color: "muted",
        sub_areas: [
            {
                key: "world_bosses",
                name: "World Bosses",
                color: "muted",
                phases: [
                    {
                        name: "Svanir Shaman Chief",
                        start: 15,
                        duration: 15,
                        frequency: 120,
                    },
                ],
            },
            {
                key: "ley_line_anomaly",
                name: "Ley-Line Anomaly",
                color: "muted",
                phases: [
                    {
                        name: "Svanir Shaman Chief",
                        start: 15,
                        duration: 15,
                        frequency: 120,
                    },
                ],
            },
            {
                key: "primary-test",
                name: "Primary Test",
                color: "primary",
                phases: [],
            },
            {
                key: "secondary-test",
                name: "Secondary Test",
                color: "secondary",
                phases: [],
            },
            {
                key: "nav-background-test",
                name: "Nav Background Test",
                color: "backgroundNav",
                phases: [],
            },
            {
                key: "body-test",
                name: "Body Test",
                color: "body",
                phases: [],
            },
            {
                key: "success",
                name: "Success",
                color: "success",
                phases: [],
            },
            {
                key: "danger",
                name: "Danger",
                color: "danger",
                phases: [],
            },
            {
                key: "warning",
                name: "Warning",
                color: "warning",
                phases: [],
            },
            {
                key: "info",
                name: "Info",
                color: "info",
                phases: [],
            },
        ],
    },
];

const getCurrentTimeBlockStart = () => {
    const now = new Date();
    const hoursSinceMidnight = getHours(now);
    const hoursSinceLastBlock = hoursSinceMidnight % 2;
    const timeBlockStart = setSeconds(
        setMinutes(setHours(now, hoursSinceMidnight - hoursSinceLastBlock), 0),
        0
    );

    return timeBlockStart;
};

const CurrentTimeIndicator = ({ currentTimeBlockStart, parentWidth }) => {
    const { now } = useTimer();

    const leftPixels = useMemo(() => {
        const totalMinutesInBlock = 120;
        const minutesSinceStartOfBlock = differenceInMinutes(
            now,
            currentTimeBlockStart
        );
        const percentage = Number(
            minutesSinceStartOfBlock / totalMinutesInBlock
        ).toFixed(4);

        return Math.round(parentWidth * percentage);
    }, [now, currentTimeBlockStart, parentWidth]);

    return (
        <div
            className={styles.currentTimeIndicator}
            style={{
                left: leftPixels,
            }}
        />
    );
};

const EventTimers = () => {
    const scrollParentRef = useRef(null);
    const { ref: eventContainerRef } = useResizeDetector();
    const eventContainerWidth = eventContainerRef?.current?.scrollWidth || 0;

    const currentTimeBlockStart = useTimerValue(
        getCurrentTimeBlockStart(),
        getCurrentTimeBlockStart
    );

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
        <div className={styles.eventTimer}>
            <div className={styles.leftFrame}>Left</div>
            <div className={styles.rightFrame} ref={scrollParentRef}>
                <TimeRow currentTimeBlockStart={currentTimeBlockStart} />
                <div className={styles.eventContainer} ref={eventContainerRef}>
                    <CurrentTimeIndicator
                        currentTimeBlockStart={currentTimeBlockStart}
                        parentWidth={eventContainerWidth}
                    />

                    <div className={styles.regions}>
                        {META_EVENTS.map(region => (
                            <EventRegion key={region.key} region={region} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventTimers;
