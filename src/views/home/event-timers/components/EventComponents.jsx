import { useContext, useEffect, useMemo, useRef } from "react";
import {
    addHours,
    addMinutes,
    differenceInMinutes,
    format,
    isAfter,
    isBefore,
    subMinutes,
} from "date-fns";
import { nanoid } from "nanoid";
import classNames from "classnames";
import { useResizeDetector } from "react-resize-detector";
import { toast } from "react-hot-toast";

import styles from "@/styles/modules/event-timer.module.scss";
import { useTheme } from "@/utils/theme-provider";
import {
    adjustLuminance,
    blendColors,
    ensureContrast,
    isContrastEnough,
    isLight,
} from "@/utils/color";
import { useTimer } from "@/utils/hooks/useTimer";
import { copyToClipboard } from "@/utils/util";

import EventTimerContext from "../EventTimerContext";
import HoveredEventIndicator from "./HoveredEventIndicator";
import {
    HIGHLIGHT_SCHEMES,
    HOVER_DELAY,
    MINS_IN_DAY,
    TIME_BLOCK_MINS,
    UPCOMING_MINS,
} from "../utils";
import CurrentTimeIndicator from "./CurrentTimeIndicator";

const ID_LENGTH = 6;
const DOWNTIME_OPACITY = 0.2;

export const RegionIndicator = ({ region, isHovered }) => {
    const { colors, mode } = useTheme();
    const { selectedEvent } = useContext(EventTimerContext);
    const schemeColorString = useMemo(
        () => (region.color === "gray" ? "primary" : region.color),
        [region.color]
    );

    const highlightColor = useMemo(() => {
        const schemeColor = colors?.[schemeColorString] ?? undefined;
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
    }, [schemeColorString, colors, mode]);

    const isActive = useMemo(
        () => isHovered || selectedEvent?.region?.key === region?.key,
        [selectedEvent?.region?.key, region?.key, isHovered]
    );

    return (
        <div
            className={styles.regionIndicator}
            id={`region-indicator-${region.key}`}
            style={{
                borderRightColor: isActive ? highlightColor : undefined,
                color: isActive ? highlightColor : undefined,
            }}
        >
            <div
                className={styles.regionBorder}
                style={{
                    borderBottomColor: isActive ? highlightColor : undefined,
                }}
            />
            <div className={styles.regionTitle}>{region.name}</div>
            <div
                className={styles.regionBorder}
                style={{
                    borderBottomColor: isActive ? highlightColor : undefined,
                }}
            />
        </div>
    );
};

export const TimeRow = () => {
    const { currentTimeBlockStart, hoveredEvent, selectedEvent } =
        useContext(EventTimerContext);

    const { timeFormat, colors } = useTheme();
    const formatString = useMemo(
        () => (timeFormat === "12h" ? "h:mmaaa" : "H:mm"),
        [timeFormat]
    );

    const shouldHide = !!hoveredEvent || !!selectedEvent;

    return (
        <div
            className={classNames(styles.timeRow, {
                [styles.hideLabels]: shouldHide,
            })}
            style={{ background: colors.background }}
        >
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
                <CurrentTimeIndicator />
                <HoveredEventIndicator showLabel={true} />
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
    isDulledBackgroundLight,
    isLast,
    isAreaComplete,
}) => {
    const { colors } = useTheme();
    const { now, dailyReset } = useTimer();
    const {
        width: parentWidth,
        hoveredEvent,
        setHoveredEvent,
        selectedEvent,
        setSelectedEvent,
        highlightScheme,
    } = useContext(EventTimerContext);

    const isSelected = useMemo(
        () => selectedEvent?.id === item.id,
        [item.id, selectedEvent]
    );

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
            (isLast ? 0 : 4)
        );
    }, [item, parentWidth, isLast]);

    const isComplete = useMemo(() => {
        if (isAreaComplete) {
            return true;
        } else if (
            item.lastCompletion &&
            !isBefore(item.lastCompletion, dailyReset) &&
            isBefore(item.lastCompletion, addHours(dailyReset, 24))
        ) {
            return true;
        }
        return false;
    }, [item, isAreaComplete, dailyReset]);

    const isDowntime = useMemo(
        () => item.key === "downtime" || item.type === "downtime",
        [item.key, item.type]
    );
    const isClickable = useMemo(
        () => !isDowntime || (isDowntime && !!item.wikiUrl),
        [isDowntime, item.wikiUrl]
    );

    const eventTimeText = useMemo(() => {
        if (item.type === "downtime" || item.key === "downtime") {
            return "";
        }
        // 5 mins ago
        if (addMinutes(item.startDate, 5 + 1) < now) {
            return "";
        }
        // 120 mins in the future
        if (item.startDate >= addMinutes(now, 120)) {
            return "";
        }

        const isInFuture = item.startDate > now;
        const minDiff = differenceInMinutes(item.startDate, now);

        if (!isInFuture) {
            if (minDiff < 0) {
                return `${minDiff * -1} min${minDiff === -1 ? "" : "s"} ago`;
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

    const hoverTimeout = useRef(null);
    const onHoverIn = () => {
        if (!isDowntime) {
            hoverTimeout.current = setTimeout(() => {
                setHoveredEvent(item);
            }, HOVER_DELAY);
        }
    };
    const onHoverOut = () => {
        clearTimeout(hoverTimeout.current);
        setHoveredEvent(null);
    };

    const onClick = () => {
        if (!isClickable) {
            return;
        }
        setSelectedEvent(item);
    };

    const onDoubleClick = () => {
        if (item.waypoint) {
            copyToClipboard(item.waypoint, {
                onSuccess: () => toast.success("Waypoint copied to clipboard!"),
                onError: () =>
                    toast.error(
                        "Something went wrong when copying to clipboard."
                    ),
            });
        }
    };

    const borderColor = useMemo(
        () => adjustLuminance(eventBackground, -40),
        [eventBackground]
    );

    const isDulledBecauseOfScheme = useMemo(() => {
        if (highlightScheme === HIGHLIGHT_SCHEMES.upcoming) {
            let start = new Date(item.startDate);
            let end = addMinutes(start, item.duration);

            const horizon = addMinutes(now, UPCOMING_MINS);
            if (isBefore(end, now)) {
                return true;
            } else if (isAfter(start, horizon)) {
                return true;
            }
            return false;
        }
    }, [highlightScheme, now, item]);

    const isDulled = useMemo(() => {
        return isDowntime
            ? true
            : hoveredEvent && item.id === hoveredEvent?.id
              ? false
              : selectedEvent?.id === item.id
                ? false
                : (hoveredEvent && item.id !== hoveredEvent?.id) ||
                    (selectedEvent && selectedEvent.id !== item?.id)
                  ? true
                  : isComplete
                    ? true
                    : isDulledBecauseOfScheme;
    }, [
        isDowntime,
        hoveredEvent,
        selectedEvent,
        item.id,
        isComplete,
        isDulledBecauseOfScheme,
    ]);

    const style = useMemo(
        () => ({
            background: `${eventBackground}${isDulled ? "33" : ""}`,
            width,
            borderColor: isSelected ? borderColor : undefined,
            color: `${
                isDulled
                    ? isDulledBackgroundLight
                        ? colors.bodyDark
                        : colors.bodyLight
                    : isBackgroundLight
                      ? colors.bodyDark
                      : colors.bodyLight
            }${isDulled ? "66" : ""}`,
        }),
        [
            isDulled,
            width,
            isSelected,
            borderColor,
            colors,
            isBackgroundLight,
            isDulledBackgroundLight,
            eventBackground,
        ]
    );

    return (
        <div
            className={classNames(`${styles.phase}`, {
                [styles.isSelected]: selectedEvent?.id === item.id,
                [styles.isClickable]: isClickable,
                "event-phase": isClickable,
            })}
            style={style}
            id={item.id}
            onMouseEnter={onHoverIn}
            onMouseLeave={onHoverOut}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
        >
            {isDowntime ? (
                item.wikiUrl ? (
                    <div
                        className={styles.title}
                        style={{
                            textDecoration: isComplete
                                ? "line-through"
                                : undefined,
                        }}
                    >
                        {item.isContinued ? "…" : ""}
                        {item.name}
                    </div>
                ) : item.name ? (
                    <div
                        className={styles.title}
                        style={{
                            textDecoration: isComplete
                                ? "line-through"
                                : undefined,
                        }}
                    >
                        {item.isContinued ? "…" : ""}
                        {item.name}
                    </div>
                ) : null
            ) : (
                <>
                    <div
                        className={styles.title}
                        style={{
                            textDecoration: isComplete
                                ? "line-through"
                                : undefined,
                        }}
                    >
                        {item.isContinued ? "…" : ""}
                        {item.name}
                    </div>
                    <div className={styles.timeUntil}>{eventTimeText}</div>
                </>
            )}
        </div>
    );
};

const PeriodicArea = ({ area, region }) => {
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
            allEvents.push(
                ...(eventStartTimes || []).map(item => ({
                    ...item,
                    area: { ...area, phases: undefined },
                    region,
                }))
            );
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
    }, [dailyReset, currentTimeBlockStart, area, region]);

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
                    id: `d${nanoid(ID_LENGTH)}`,
                    key: "downtime",
                    windowStartMinute: mins,
                    windowEndMinute: TIME_BLOCK_MINS,
                    color: area.color,
                });
                mins += TIME_BLOCK_MINS - mins;
            } else if (mins < nextEvent.windowStartMinute) {
                minuteBlocks.push({
                    ...downtime,
                    id: `d${nanoid(ID_LENGTH)}`,
                    key: "downtime",
                    windowStartMinute: mins,
                    windowEndMinute: nextEvent.windowStartMinute,
                    color: area.color,
                });

                // Advance mins by the duration of this downtime, up until the
                // next event
                mins += nextEvent.windowStartMinute - mins;
            } else {
                const windowEndMinute =
                    nextEvent.windowStartMinute + nextEvent.duration;

                minuteBlocks.push({
                    ...nextEvent,
                    id: `e${nanoid(ID_LENGTH)}`,
                    windowEndMinute: Math.min(TIME_BLOCK_MINS, windowEndMinute),
                    windowStartMinute: Math.max(nextEvent.windowStartMinute, 0),
                    isContinued: nextEvent.windowStartMinute < 0,
                    isCutOff: windowEndMinute > TIME_BLOCK_MINS,
                    color: area.color,
                });
                const durationInWindow =
                    Math.min(TIME_BLOCK_MINS, windowEndMinute) -
                    Math.max(nextEvent.windowStartMinute, 0);
                mins += durationInWindow;
                eventIndex++;
            }
        }
        return minuteBlocks;
    }, [areaEvents, downtime, area.color]);

    const { colors } = useTheme();
    const eventBackground = useMemo(
        () => colors[area.color],
        [area.color, colors]
    );
    const isBackgroundLight = useMemo(
        () => isLight(eventBackground),
        [eventBackground]
    );
    const isDulledBackgroundLight = useMemo(() => {
        const effectiveEventBackgroundColor = blendColors({
            opacity: DOWNTIME_OPACITY,
            color: eventBackground,
            backgroundColor: colors.background,
        });
        return isLight(effectiveEventBackgroundColor);
    }, [eventBackground, colors.background]);

    const isComplete = useMemo(() => {
        if (
            area.lastCompletion &&
            !isBefore(area.lastCompletion, dailyReset) &&
            isBefore(area.lastCompletion, addHours(dailyReset, 24))
        ) {
            return true;
        }
        return false;
    }, [area, dailyReset]);

    return (
        <div className={styles.area}>
            {(minuteBlocks || []).map((item, i) => (
                <AreaEventPhase
                    key={item.id}
                    item={item}
                    eventBackground={eventBackground}
                    isBackgroundLight={isBackgroundLight}
                    isDulledBackgroundLight={isDulledBackgroundLight}
                    isLast={i === minuteBlocks.length - 1}
                    isAreaComplete={isComplete}
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

    const _eventStartTimes = times
        .map(eventStart => {
            let _eventStart = eventStart;

            if (
                windowEnd > MINS_IN_DAY &&
                eventStart + MINS_IN_DAY < windowEnd
            ) {
                // Window is wrapping to the next day, so add MINS_IN_DAY to
                // event start time
                _eventStart = eventStart + MINS_IN_DAY;
            } else if (
                windowStart < 0 &&
                eventStart - MINS_IN_DAY >= windowStart
            ) {
                // Window is wrapping to the previous day, so subtract
                // MINS_IN_DAY from event start time
                _eventStart = eventStart - MINS_IN_DAY;
            }
            return _eventStart;
        })
        .filter(eventStart => {
            const eventEnd = eventStart + duration;
            return (
                (eventStart >= windowStart && eventStart < windowEnd) ||
                (eventEnd > windowStart && eventEnd <= windowEnd) ||
                (eventStart <= windowStart && eventEnd >= windowEnd)
            );
        });
    const eventStartTimes = _eventStartTimes.map(eventStartMinutes => ({
        ...phase,
        startDate: addMinutes(dailyReset, eventStartMinutes),
    }));

    return eventStartTimes;
};

const FixedTimeArea = ({ area, region }) => {
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
            allEvents.push(
                ...(eventStartTimes || []).map(item => ({
                    ...item,
                    area: { ...area, phases: undefined },
                    region,
                }))
            );
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
    }, [dailyReset, currentTimeBlockStart, area, region]);

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
                    id: `d${nanoid(ID_LENGTH)}`,
                    key: "downtime",
                    windowStartMinute: mins,
                    windowEndMinute: TIME_BLOCK_MINS,
                    color: area.color,
                });
                mins += TIME_BLOCK_MINS - mins;
            } else if (mins < nextEvent.windowStartMinute) {
                minuteBlocks.push({
                    ...downtime,
                    id: `d${nanoid(ID_LENGTH)}`,
                    key: "downtime",
                    windowStartMinute: mins,
                    windowEndMinute: nextEvent.windowStartMinute,
                    color: area.color,
                });

                // Advance mins by the duration of this downtime, up until the
                // next event
                mins += nextEvent.windowStartMinute - mins;
            } else {
                const windowEndMinute =
                    nextEvent.windowStartMinute + nextEvent.duration;

                minuteBlocks.push({
                    ...nextEvent,
                    id: `e${nanoid(ID_LENGTH)}`,
                    windowEndMinute: Math.min(TIME_BLOCK_MINS, windowEndMinute),
                    windowStartMinute: Math.max(nextEvent.windowStartMinute, 0),
                    isContinued: nextEvent.windowStartMinute < 0,
                    isCutOff: windowEndMinute > TIME_BLOCK_MINS,
                    color: area.color,
                });
                const durationInWindow =
                    Math.min(TIME_BLOCK_MINS, windowEndMinute) -
                    Math.max(nextEvent.windowStartMinute, 0);
                mins += durationInWindow;
                eventIndex++;
            }
        }
        return minuteBlocks;
    }, [areaEvents, downtime, area.color]);

    const { colors } = useTheme();
    const eventBackground = useMemo(
        () => colors[area.color],
        [area.color, colors]
    );
    const isBackgroundLight = useMemo(
        () => isLight(eventBackground),
        [eventBackground]
    );
    const isDulledBackgroundLight = useMemo(() => {
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
                    isDulledBackgroundLight={isDulledBackgroundLight}
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

    const regionData = useMemo(
        () => ({ ...region, sub_areas: undefined }),
        [region]
    );

    return (
        <div
            className={styles.region}
            ref={ref}
            onMouseEnter={() => setHoveredRegion(region.key)}
            onMouseLeave={() => setHoveredRegion("")}
        >
            {region.sub_areas.map(area =>
                area.type === "fixed_time" ? (
                    <FixedTimeArea
                        key={area.key}
                        area={area}
                        region={regionData}
                    />
                ) : (
                    <PeriodicArea
                        key={area.key}
                        area={area}
                        region={regionData}
                    />
                )
            )}
        </div>
    );
};

export default EventRegion;
