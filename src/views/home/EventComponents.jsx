import { useContext, useEffect, useMemo } from "react";
import {
    addMinutes,
    differenceInMinutes,
    differenceInSeconds,
    format,
    subMinutes,
} from "date-fns";
import { nanoid } from "nanoid";
import { useResizeDetector } from "react-resize-detector";

import styles from "@/styles/modules/event-timer.module.scss";
import globalStyles from "@/styles/modules/global-styles.module.scss";

import { useTheme } from "@/utils/theme-provider";
import { isLight } from "@/utils/util";
import { useTimer } from "@/utils/hooks/useTimer";
import EventTimerContext from "./EventTimerContext";
import classNames from "classnames";

const ID_LENGTH = 6;
export const TIME_BLOCK_MINS = 120;

export const CurrentTimeIndicator = ({ parentWidth }) => {
    const { currentTimeBlockStart } = useContext(EventTimerContext);
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

    return (
        <div
            className={styles.currentTimeIndicator}
            style={{
                left: leftPixels,
            }}
        />
    );
};

export const TimeRow = ({ setWidth }) => {
    const { currentTimeBlockStart } = useContext(EventTimerContext);
    const { ref: timeRowRef } = useResizeDetector();
    const timeRowWidth = timeRowRef?.current?.scrollWidth || 0;
    useEffect(() => {
        setWidth(timeRowWidth);
    }, [timeRowWidth, setWidth]);

    const { timeFormat, colors } = useTheme();
    const formatString = useMemo(
        () => (timeFormat === "12h" ? "h:mm" : "H:mm"),
        [timeFormat]
    );

    return (
        <div
            className={styles.timeRow}
            style={{ background: colors.background }}
            ref={timeRowRef}
        >
            <CurrentTimeIndicator
                currentTimeBlockStart={currentTimeBlockStart}
                parentWidth={timeRowWidth}
            />
            <div className={styles.timeRowInnerWrapper}>
                <div>
                    <div className={styles.timeMarker} />
                    <div className={styles.timeLabel}>
                        {format(currentTimeBlockStart, formatString)}
                    </div>
                </div>
                <div>
                    <div className={styles.timeMarker} />
                </div>
                <div>
                    <div className={styles.timeMarker} />
                    <div className={styles.timeLabel}>
                        {format(
                            addMinutes(currentTimeBlockStart, 30),
                            formatString
                        )}
                    </div>
                </div>
                <div>
                    <div className={styles.timeMarker} />
                </div>
                <div>
                    <div className={styles.timeMarker} />
                    <div className={styles.timeLabel}>
                        {format(
                            addMinutes(currentTimeBlockStart, 60),
                            formatString
                        )}
                    </div>
                </div>
                <div>
                    <div className={styles.timeMarker} />
                </div>
                <div>
                    <div className={styles.timeMarker} />
                    <div className={styles.timeLabel}>
                        {format(
                            addMinutes(currentTimeBlockStart, 90),
                            formatString
                        )}
                    </div>
                </div>
                <div>
                    <div className={styles.timeMarker} />
                </div>
            </div>
            <div className={styles.spacer} />
        </div>
    );
};

const getEventStartTimesWithinWindow = ({
    phase,
    currentTimeBlockStart,
    dailyReset,
}) => {
    const { start, duration, frequency } = phase;

    // Bring forward the current time block start by the duration of this event,
    // which ensures we always catch the start time of any events.
    // E.g. if current time block start is 8pm and event duration is 45 mins,
    // the adjusted time block will start at 7:15pm
    const adjustedCurrentTimeBlockStart = subMinutes(
        currentTimeBlockStart,
        duration
    );
    const currentTimeBlockEnd = addMinutes(
        currentTimeBlockStart,
        TIME_BLOCK_MINS
    );

    const minutesSinceStartOfDay = differenceInMinutes(
        adjustedCurrentTimeBlockStart,
        dailyReset
    );

    // First event time represents the first event within the time window,
    // represented as minutes since daily reset
    const firstEventTime =
        start +
        Math.ceil((minutesSinceStartOfDay - start) / frequency) * frequency;

    const eventStartTimes = [];
    for (
        let time = firstEventTime;
        time < firstEventTime + duration + TIME_BLOCK_MINS;
        time += frequency
    ) {
        const eventStart = addMinutes(dailyReset, time);
        const eventEnd = addMinutes(eventStart, duration);

        // Logic here:
        // Add event into our array if:
        // - Event's start time is in current time window, OR
        // - Event's end time is in current time window
        if (
            (eventStart >= currentTimeBlockStart &&
                eventStart < currentTimeBlockEnd) ||
            (eventEnd > currentTimeBlockStart &&
                eventEnd <= currentTimeBlockEnd)
        ) {
            eventStartTimes.push({
                ...phase,
                startDate: eventStart,
            });
        }
    }

    return eventStartTimes;
};

const AreaEventPhase = ({
    item,
    eventBackground,
    isBackgroundLight,
    isLast,
}) => {
    const { width: parentWidth } = useContext(EventTimerContext);

    const width = useMemo(() => {
        const totalMinutesInBlock = TIME_BLOCK_MINS;
        const minutesSinceStartOfBlock = item.windowStartMinute;
        const minutesSinceEndOfBlock = item.windowEndMinute;
        const percentageLeft = Number(
            minutesSinceStartOfBlock / totalMinutesInBlock
        ).toFixed(4);
        const percentageRight = Number(
            minutesSinceEndOfBlock / totalMinutesInBlock
        ).toFixed(4);

        // Percentage from right, minus percentage from left, gives us width.
        // Subtract 2px to ensure we have space to the right before the next
        // event block.
        return (
            Math.round(parentWidth * percentageRight) -
            Math.round(parentWidth * percentageLeft) -
            (isLast ? 0 : 2)
        );
    }, [item, parentWidth, isLast]);

    return (
        <div
            className={classNames(
                `${styles.phase} ${
                    isBackgroundLight
                        ? globalStyles.textDark
                        : globalStyles.textLight
                }`,
                { [styles.deadSpace]: item.key === "dead_space" }
            )}
            style={{
                background: eventBackground,
                width,
            }}
        >
            {item.key === "dead_space" ? null : (
                <>
                    <div className={styles.title}>{item.name}</div>
                    <div>In x mins</div>
                </>
            )}
        </div>
    );
};

const Area = ({ area }) => {
    const { currentTimeBlockStart } = useContext(EventTimerContext);
    const { dailyReset } = useTimer();

    // Calculate all events that must be rendered inside this time window
    const areaEvents = useMemo(() => {
        const allEvents = [];
        area?.phases.forEach(phase => {
            const eventStartTimes = getEventStartTimesWithinWindow({
                phase,
                dailyReset,
                currentTimeBlockStart,
            });
            allEvents.push(...(eventStartTimes || []));
        });
        allEvents.sort((a, b) => a.startDate - b.startDate);

        // Add "minutes from start of window" to each event
        allEvents.forEach((event, index) => {
            let windowStartMinute = differenceInMinutes(
                event.startDate,
                currentTimeBlockStart
            );
            allEvents[index].windowStartMinute = windowStartMinute;
        });
        return allEvents;
    }, [dailyReset, area, currentTimeBlockStart]);

    // Calculate all blocks to render, including "dead space".
    // These are given minute numbers that represent their start and end.
    // Doing so makes rendering easy, as we know exactly when each block should
    // start and stop.
    // Note that if an event starts at 0 and ends at 30, that means that the
    // event starts at the start of this time window, and ends just as the 30th
    // minute starts.
    const minuteBlocks = useMemo(() => {
        const minuteBlocks = [];
        let mins = 0;
        let eventIndex = 0;
        while (mins < TIME_BLOCK_MINS) {
            const nextEvent = areaEvents?.[eventIndex];
            if (!nextEvent) {
                minuteBlocks.push({
                    id: nanoid(ID_LENGTH),
                    key: "dead_space",
                    windowStartMinute: mins,
                    windowEndMinute: TIME_BLOCK_MINS,
                });
                mins += TIME_BLOCK_MINS - mins;
            } else if (mins < nextEvent.windowStartMinute) {
                minuteBlocks.push({
                    id: nanoid(ID_LENGTH),
                    key: "dead_space",
                    windowStartMinute: mins,
                    windowEndMinute: nextEvent.windowStartMinute,
                });

                // Advance mins by the duration of this dead space, up until the
                // next event
                mins += nextEvent.windowStartMinute - mins;
            } else {
                minuteBlocks.push({
                    ...nextEvent,
                    id: nanoid(ID_LENGTH),
                    windowEndMinute:
                        nextEvent.windowStartMinute + nextEvent.duration,
                });
                mins += nextEvent.duration;
                eventIndex++;
            }
        }
        return minuteBlocks;
    }, [areaEvents]);

    const { colors } = useTheme();
    const eventBackground = useMemo(
        () => colors[area.color],
        [area.color, colors]
    );
    const isBackgroundLight = useMemo(
        () => isLight(eventBackground),
        [eventBackground]
    );

    return (
        <div className={styles.area}>
            {(minuteBlocks || []).map((item, i) => (
                <AreaEventPhase
                    key={item.id}
                    item={item}
                    eventBackground={eventBackground}
                    isBackgroundLight={isBackgroundLight}
                    isLast={i === minuteBlocks.length - 1}
                />
            ))}
        </div>
    );
};

const EventRegion = ({ region }) => {
    return (
        <div className={styles.region}>
            {region.sub_areas.map(area => (
                <Area key={area.key} area={area} />
            ))}
        </div>
    );
};

export default EventRegion;
