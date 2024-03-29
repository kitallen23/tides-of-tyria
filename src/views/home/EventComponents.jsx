import { useContext, useEffect, useMemo } from "react";
import {
    addMinutes,
    differenceInMinutes,
    differenceInSeconds,
    format,
    subMinutes,
} from "date-fns";
import { nanoid } from "nanoid";
import classNames from "classnames";
import { useResizeDetector } from "react-resize-detector";

import styles from "@/styles/modules/event-timer.module.scss";
import globalStyles from "@/styles/modules/global-styles.module.scss";

import { useTheme } from "@/utils/theme-provider";
import { blendColors, isLight, opacityToHex } from "@/utils/util";
import { useTimer } from "@/utils/hooks/useTimer";
import EventTimerContext from "./EventTimerContext";

const ID_LENGTH = 6;
const DOWNTIME_OPACITY = 0.2;
const DOWNTIME_OPACITY_HEX = opacityToHex(DOWNTIME_OPACITY);
export const TIME_BLOCK_MINS = 120;

export const RegionIndicator = ({ region, isHovered }) => {
    const { colors } = useTheme();
    const highlightColor = useMemo(
        () => (region.color === "muted" ? "primary" : region.color),
        [region.color]
    );
    const highlightBorderColor = useMemo(
        () => colors?.[highlightColor] || undefined,
        [highlightColor, colors]
    );

    return (
        <div
            className={styles.regionIndicator}
            id={`region-indicator-${region.key}`}
            style={{
                borderRightColor: isHovered ? highlightBorderColor : undefined,
                color: isHovered ? highlightBorderColor : undefined,
            }}
        >
            <div
                className={styles.regionBorder}
                style={{
                    borderBottomColor: isHovered
                        ? highlightBorderColor
                        : undefined,
                }}
            />
            <div className={styles.regionTitle}>{region.name}</div>
            <div
                className={styles.regionBorder}
                style={{
                    borderBottomColor: isHovered
                        ? highlightBorderColor
                        : undefined,
                }}
            />
        </div>
    );
};

export const CurrentTimeIndicator = () => {
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

export const TimeRow = () => {
    const { currentTimeBlockStart } = useContext(EventTimerContext);

    const { timeFormat, colors } = useTheme();
    const formatString = useMemo(
        () => (timeFormat === "12h" ? "h:mmaaa" : "H:mm"),
        [timeFormat]
    );

    return (
        <div
            className={styles.timeRow}
            style={{ background: colors.background }}
        >
            <CurrentTimeIndicator
                currentTimeBlockStart={currentTimeBlockStart}
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

const getPeriodicEventStartTimesWithinWindow = ({
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
        // - Event's start is before the current time window, and the event's
        //    end is after the current time window
        if (
            (eventStart >= currentTimeBlockStart &&
                eventStart < currentTimeBlockEnd) ||
            (eventEnd > currentTimeBlockStart &&
                eventEnd <= currentTimeBlockEnd) ||
            (eventStart <= currentTimeBlockStart &&
                eventEnd >= currentTimeBlockEnd)
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
    isDowntimeBackgroundLight,
    isLast,
}) => {
    const { now } = useTimer();
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

    const isDowntime = useMemo(
        () => item.key === "downtime" || item.type === "downtime",
        [item.key, item.type]
    );

    const eventTimeText = useMemo(() => {
        if (item.type === "downtime" || item.key === "downtime") {
            return "";
        }
        if (addMinutes(item.startDate, 2) < now) {
            return "";
        }
        if (item.startDate >= addMinutes(now, 120)) {
            return "";
        }

        const isInFuture = item.startDate > now;
        const minDiff = differenceInMinutes(item.startDate, now);

        if (!isInFuture) {
            if (minDiff === -1) {
                return "1 min ago";
            } else if (minDiff === 0) {
                return "now";
            } else {
                return "";
            }
        } else {
            if (minDiff + 1 >= 60) {
                const hours = Math.floor((minDiff + 1) / 60);
                const mins = (minDiff + 1) % 60;
                return `in ${hours} hour${hours > 1 ? "s" : ""} ${
                    mins ? `${mins} mins` : ""
                }`;
            } else {
                return `in ${minDiff + 1} min${minDiff + 1 > 1 ? "s" : ""}`;
            }
        }
    }, [now, item]);

    return (
        <div
            className={classNames(
                `${styles.phase} ${
                    isDowntime
                        ? isDowntimeBackgroundLight
                            ? globalStyles.textDark
                            : globalStyles.textLight
                        : isBackgroundLight
                        ? globalStyles.textDark
                        : globalStyles.textLight
                }`
            )}
            style={{
                background: isDowntime
                    ? `${eventBackground}${DOWNTIME_OPACITY_HEX}`
                    : eventBackground,
                width,
            }}
            id={item.id}
        >
            {isDowntime ? (
                item.wikiUrl ? (
                    <div className={styles.title}>
                        <a
                            href={item.wikiUrl}
                            className={styles.titleLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {item.isContinued ? "…" : ""}
                            {item.name}
                        </a>
                    </div>
                ) : item.name ? (
                    <div className={styles.title}>
                        {item.isContinued ? "…" : ""}
                        {item.name}
                    </div>
                ) : null
            ) : (
                <>
                    <div className={styles.title}>
                        <a
                            href={item.wikiUrl}
                            className={styles.titleLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {item.isContinued ? "…" : ""}
                            {item.name}
                        </a>
                    </div>
                    <div className={styles.timeUntil}>{eventTimeText}</div>
                </>
            )}
        </div>
    );
};

const PeriodicArea = ({ area }) => {
    const { currentTimeBlockStart } = useContext(EventTimerContext);
    const { dailyReset } = useTimer();

    // Calculate all events that must be rendered inside this time window
    const [areaEvents, downtime] = useMemo(() => {
        const allEvents = [];
        area?.phases.forEach(phase => {
            const eventStartTimes = getPeriodicEventStartTimesWithinWindow({
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
        return [allEvents, area.downtime || null];
    }, [dailyReset, area, currentTimeBlockStart]);

    // Calculate all blocks to render, including "downtime".
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
                    ...downtime,
                    id: nanoid(ID_LENGTH),
                    key: "downtime",
                    windowStartMinute: mins,
                    windowEndMinute: TIME_BLOCK_MINS,
                });
                mins += TIME_BLOCK_MINS - mins;
            } else if (mins < nextEvent.windowStartMinute) {
                minuteBlocks.push({
                    ...downtime,
                    id: nanoid(ID_LENGTH),
                    key: "downtime",
                    windowStartMinute: mins,
                    windowEndMinute: nextEvent.windowStartMinute,
                });

                // Advance mins by the duration of this downtime, up until the
                // next event
                mins += nextEvent.windowStartMinute - mins;
            } else {
                const windowEndMinute =
                    nextEvent.windowStartMinute + nextEvent.duration;

                minuteBlocks.push({
                    ...nextEvent,
                    id: nanoid(ID_LENGTH),
                    windowEndMinute: Math.min(TIME_BLOCK_MINS, windowEndMinute),
                    windowStartMinute: Math.max(nextEvent.windowStartMinute, 0),
                    isContinued: nextEvent.windowStartMinute < 0,
                    isCutOff: windowEndMinute > TIME_BLOCK_MINS,
                });
                const durationInWindow =
                    Math.min(TIME_BLOCK_MINS, windowEndMinute) -
                    Math.max(nextEvent.windowStartMinute, 0);
                mins += durationInWindow;
                eventIndex++;
            }
        }
        return minuteBlocks;
    }, [areaEvents, downtime]);

    const { colors } = useTheme();
    const eventBackground = useMemo(
        () => colors[area.color],
        [area.color, colors]
    );
    const isBackgroundLight = useMemo(
        () => isLight(eventBackground),
        [eventBackground]
    );
    const isDowntimeBackgroundLight = useMemo(() => {
        const effectiveEventBackgroundColor = blendColors({
            opacity: DOWNTIME_OPACITY,
            color: eventBackground,
            backgroundColor: colors.background,
        });
        return isLight(effectiveEventBackgroundColor);
    }, [eventBackground, colors.background]);

    return (
        <div className={styles.area}>
            {(minuteBlocks || []).map((item, i) => (
                <AreaEventPhase
                    key={item.id}
                    item={item}
                    eventBackground={eventBackground}
                    isBackgroundLight={isBackgroundLight}
                    isDowntimeBackgroundLight={isDowntimeBackgroundLight}
                    isLast={i === minuteBlocks.length - 1}
                />
            ))}
        </div>
    );
};

const getFixedTimeEventStartTimesWithinWindow = ({
    phase,
    currentTimeBlockStart,
    dailyReset,
}) => {
    const { times, duration } = phase;

    const currentTimeBlockEnd = addMinutes(
        currentTimeBlockStart,
        TIME_BLOCK_MINS
    );

    const windowStart = differenceInMinutes(currentTimeBlockStart, dailyReset);
    const windowEnd = differenceInMinutes(currentTimeBlockEnd, dailyReset);

    const eventStartTimes = times
        .filter(eventStart => {
            const eventEnd = eventStart + duration;
            return (
                (eventStart >= windowStart && eventStart < windowEnd) ||
                (eventEnd > windowStart && eventEnd <= windowEnd) ||
                (eventStart <= windowStart && eventEnd >= windowEnd)
            );
        })
        .map(eventStartMinutes => ({
            ...phase,
            startDate: addMinutes(dailyReset, eventStartMinutes),
        }));

    return eventStartTimes;
};

const FixedTimeArea = ({ area }) => {
    const { currentTimeBlockStart } = useContext(EventTimerContext);
    const { dailyReset } = useTimer();

    // Calculate all events that must be rendered inside this time window
    const [areaEvents, downtime] = useMemo(() => {
        const allEvents = [];
        area?.phases.forEach(phase => {
            const eventStartTimes = getFixedTimeEventStartTimesWithinWindow({
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
        return [allEvents, area.downtime || null];
    }, [dailyReset, area, currentTimeBlockStart]);

    // Calculate all blocks to render, including "downtime".
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
                    ...downtime,
                    id: nanoid(ID_LENGTH),
                    key: "downtime",
                    windowStartMinute: mins,
                    windowEndMinute: TIME_BLOCK_MINS,
                });
                mins += TIME_BLOCK_MINS - mins;
            } else if (mins < nextEvent.windowStartMinute) {
                minuteBlocks.push({
                    ...downtime,
                    id: nanoid(ID_LENGTH),
                    key: "downtime",
                    windowStartMinute: mins,
                    windowEndMinute: nextEvent.windowStartMinute,
                });

                // Advance mins by the duration of this downtime, up until the
                // next event
                mins += nextEvent.windowStartMinute - mins;
            } else {
                const windowEndMinute =
                    nextEvent.windowStartMinute + nextEvent.duration;

                minuteBlocks.push({
                    ...nextEvent,
                    id: nanoid(ID_LENGTH),
                    windowEndMinute: Math.min(TIME_BLOCK_MINS, windowEndMinute),
                    windowStartMinute: Math.max(nextEvent.windowStartMinute, 0),
                    isContinued: nextEvent.windowStartMinute < 0,
                    isCutOff: windowEndMinute > TIME_BLOCK_MINS,
                });
                const durationInWindow =
                    Math.min(TIME_BLOCK_MINS, windowEndMinute) -
                    Math.max(nextEvent.windowStartMinute, 0);
                mins += durationInWindow;
                eventIndex++;
            }
        }
        return minuteBlocks;
    }, [areaEvents, downtime]);

    const { colors } = useTheme();
    const eventBackground = useMemo(
        () => colors[area.color],
        [area.color, colors]
    );
    const isBackgroundLight = useMemo(
        () => isLight(eventBackground),
        [eventBackground]
    );
    const isDowntimeBackgroundLight = useMemo(() => {
        const effectiveEventBackgroundColor = blendColors({
            opacity: DOWNTIME_OPACITY,
            color: eventBackground,
            backgroundColor: colors.background,
        });
        return isLight(effectiveEventBackgroundColor);
    }, [eventBackground, colors.background]);

    return (
        <div className={styles.area}>
            {(minuteBlocks || []).map((item, i) => (
                <AreaEventPhase
                    key={item.id}
                    item={item}
                    eventBackground={eventBackground}
                    isBackgroundLight={isBackgroundLight}
                    isDowntimeBackgroundLight={isDowntimeBackgroundLight}
                    isLast={i === minuteBlocks.length - 1}
                />
            ))}
        </div>
    );
};

const EventRegion = ({ region, setHoveredRegion, indicatorWrapperRef }) => {
    const { height, ref } = useResizeDetector();
    useEffect(() => {
        if (height && indicatorWrapperRef.current) {
            const regionIndicator = indicatorWrapperRef.current.querySelector(
                `#region-indicator-${region.key}`
            );
            regionIndicator.style.height = `${height}px`;
        }
    }, [height, indicatorWrapperRef, region]);

    return (
        <div
            className={styles.region}
            ref={ref}
            onMouseEnter={() => setHoveredRegion(region.key)}
            onMouseLeave={() => setHoveredRegion("")}
        >
            {region.sub_areas.map(area =>
                area.type === "fixed_time" ? (
                    <FixedTimeArea key={area.key} area={area} />
                ) : (
                    <PeriodicArea key={area.key} area={area} />
                )
            )}
        </div>
    );
};

export default EventRegion;
