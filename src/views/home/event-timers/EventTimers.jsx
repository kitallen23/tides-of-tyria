import { useEffect, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import classNames from "classnames";
import styles from "@/styles/modules/event-timer.module.scss";
import globalStyles from "@/styles/modules/global-styles.module.scss";
import layoutStyles from "@/styles/modules/home.module.scss";
import { Button } from "@mui/material";
import {
    ChevronLeftSharp,
    ChevronRightSharp,
    HistorySharp,
    HourglassTopSharp,
    MoreVertSharp,
} from "@mui/icons-material";
import {
    getHours,
    isEqual,
    setHours,
    setMilliseconds,
    setMinutes,
    setSeconds,
    addMinutes,
    min,
} from "date-fns";

import META_EVENTS from "@/utils/meta_events";
import { getLocalItem } from "@/utils/util";
import { LOCAL_STORAGE_KEYS } from "@/utils/constants";
import { useTimer } from "@/utils/hooks/useTimer";
import { useTheme } from "@/utils/theme-provider";

import EventRegion, {
    RegionIndicator,
    TimeRow,
} from "./components/EventComponents";
import {
    HIGHLIGHT_SCHEMES,
    cleanEventConfig,
    markAllEventsIncomplete,
    markEventComplete,
} from "./utils";
import EventTimerContext from "./EventTimerContext";
import OptionsMenu from "./components/OptionsMenu";
import CurrentTimeIndicator from "./components/CurrentTimeIndicator";
import HoveredEventIndicator from "./components/HoveredEventIndicator";
import EventInfoMenu from "./components/EventInfoMenu";

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

const EventTimers = () => {
    const { colors } = useTheme();
    const scrollParentRef = useRef(null);
    const indicatorWrapperRef = useRef(null);
    const eventWrapperRef = useRef(null);
    const { now, dailyReset } = useTimer();

    const [hoveredRegion, setHoveredRegion] = useState("");
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [eventConfig, setEventConfig] = useState(null);

    const { key } = useTimer();
    const [offset, setOffset] = useState(0);

    // Stores the start moment of the selected 2-hour time window
    // (defaults to the current one)
    // Note that this is relative to the local time, e.g. the first window of
    // today is always 12:00am local time
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

    // Take event config from local storage, clean it, set in state, then save
    // back to local storage
    const initialiseEventConfig = (eventConfigString, dailyReset) => {
        try {
            if (!eventConfigString) {
                localStorage.setItem(
                    LOCAL_STORAGE_KEYS.eventConfig,
                    JSON.stringify(META_EVENTS)
                );
                setEventConfig(META_EVENTS);
                return;
            }
            let eventConfig = JSON.parse(eventConfigString);
            eventConfig = cleanEventConfig(eventConfig, dailyReset);
            setEventConfig(eventConfig);
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.eventConfig,
                JSON.stringify(eventConfig)
            );
        } catch (err) {
            console.error(
                `Error parsing event configuration from local storage: `,
                err
            );
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.eventConfig,
                JSON.stringify(META_EVENTS)
            );
            setEventConfig(META_EVENTS);
        }
    };

    useEffect(() => {
        const eventConfigString = getLocalItem(
            LOCAL_STORAGE_KEYS.eventConfig,
            ""
        );
        initialiseEventConfig(eventConfigString, dailyReset);
        // console.log(
        //     `Minutes until next reset: `,
        //     differenceInMinutes(addHours(dailyReset, 24), new Date())
        // );
    }, [dailyReset]);

    const onComplete = event => {
        const eventEnd = addMinutes(event.startDate, event.duration);
        const completionDate = min([eventEnd, now]);
        const _eventConfig = markEventComplete(
            eventConfig,
            event,
            completionDate
        );
        setEventConfig(_eventConfig);
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.eventConfig,
            JSON.stringify(_eventConfig)
        );
        setSelectedEvent(null);
    };

    const onResetCompletedEvents = () => {
        const _eventConfig = markAllEventsIncomplete(eventConfig);
        setEventConfig(_eventConfig);
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.eventConfig,
            JSON.stringify(_eventConfig)
        );
        setSelectedEvent(null);
    };

    // Unset the selected event whenever the current time block changes
    useEffect(() => {
        if (currentTimeBlockStart) {
            setSelectedEvent(null);
        }
    }, [currentTimeBlockStart]);

    const _setSelectedEvent = event => {
        if (selectedEvent?.id === event?.id) {
            setSelectedEvent(null);
        } else {
            setSelectedEvent(event);
        }
    };

    const handleClickOutside = event => {
        if (
            !event.target.closest(".event-phase") &&
            !event.target.closest(".event-phase-menu")
        ) {
            setSelectedEvent(null);
        }
    };

    useEffect(() => {
        const handleKeydown = event => {
            if (event.key === "Escape") {
                setSelectedEvent(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeydown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeydown);
        };
    }, []);

    // This is the width of the entire timer component.
    // We calculate this using a special "ruler" element, to ensure that its
    // value is always correct (as this ruler never gains any content)
    const { ref: widthRulerRef } = useResizeDetector();
    const width = widthRulerRef?.current?.scrollWidth || 0;

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
    }, [scrollParentRef, width]);

    const [isTimerCollapsed, setIsTimerCollapsed] = useState(() => {
        const isTimerCollapsed = getLocalItem(
            LOCAL_STORAGE_KEYS.isTimerCollapsed,
            "false"
        );
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.isTimerCollapsed,
            isTimerCollapsed
        );
        return isTimerCollapsed === "true";
    });

    const toggleIsTimerCollapsed = () => {
        const _isTimerCollapsed = !isTimerCollapsed;
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.isTimerCollapsed,
            _isTimerCollapsed
        );
        setIsTimerCollapsed(_isTimerCollapsed);
    };

    const [highlightScheme, setHighlightScheme] = useState(() => {
        const highlightScheme = getLocalItem(
            LOCAL_STORAGE_KEYS.highlightScheme,
            HIGHLIGHT_SCHEMES.all
        );
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.highlightScheme,
            highlightScheme
        );
        return highlightScheme;
    });

    const onHighlightSchemeChange = scheme => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.highlightScheme, scheme);
        setHighlightScheme(scheme);
    };

    const [showCompleted, setShowCompleted] = useState(() => {
        const showCompleted = getLocalItem(
            LOCAL_STORAGE_KEYS.showCompleted,
            "false"
        );
        localStorage.setItem(LOCAL_STORAGE_KEYS.showCompleted, showCompleted);
        return showCompleted === "true";
    });
    const toggleShowCompleted = () => {
        const _showCompleted = !showCompleted;
        localStorage.setItem(LOCAL_STORAGE_KEYS.showCompleted, _showCompleted);
        setShowCompleted(_showCompleted);
    };

    const [menuAnchor, setMenuAnchor] = useState(null);
    const isMenuOpen = Boolean(menuAnchor);

    const onMenuButtonClick = event => {
        setMenuAnchor(event.currentTarget);
    };
    const onMenuClose = () => {
        setMenuAnchor(null);
    };

    if (!eventConfig) {
        return null;
    }

    return (
        <div className={layoutStyles.group}>
            <div className={globalStyles.centeredContent}>
                <div className={layoutStyles.headingRow}>
                    <h3 className={layoutStyles.heading}>
                        <HourglassTopSharp style={{ marginRight: "0.25rem" }} />
                        Event Timers
                        <span
                            style={{
                                color: colors.muted,
                                fontSize: "0.85em",
                                fontWeight: "normal",
                            }}
                            className={globalStyles.hideBelowMd}
                        >
                            &nbsp;| Click an event to see info
                        </span>
                    </h3>
                    <div className={layoutStyles.buttonGroup}>
                        <Button
                            variant="text"
                            sx={{ minWidth: 0 }}
                            color="muted"
                            onClick={onMenuButtonClick}
                        >
                            <MoreVertSharp sx={{ fontSize: "1.17em" }} />
                        </Button>
                        <OptionsMenu
                            anchorEl={menuAnchor}
                            open={isMenuOpen}
                            isTimerCollapsed={isTimerCollapsed}
                            onClose={onMenuClose}
                            onReset={onResetCompletedEvents}
                            toggleIsTimerCollapsed={toggleIsTimerCollapsed}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            highlightScheme={highlightScheme}
                            onHighlightSchemeChange={onHighlightSchemeChange}
                            showCompleted={showCompleted}
                            toggleShowCompleted={toggleShowCompleted}
                        />
                        <Button
                            variant="text"
                            sx={{ minWidth: 0 }}
                            color="muted"
                            onClick={() => setOffset(offset - 1)}
                        >
                            <ChevronLeftSharp sx={{ fontSize: "1.17em" }} />
                        </Button>
                        <Button
                            variant="text"
                            sx={{
                                minWidth: 0,
                                ":disabled": {
                                    color: `${colors.muted}80`,
                                },
                            }}
                            color="muted"
                            onClick={() => setOffset(0)}
                            disabled={offset === 0}
                        >
                            <HistorySharp sx={{ fontSize: "1.17em" }} />
                        </Button>
                        <Button
                            variant="text"
                            sx={{ minWidth: 0 }}
                            color="muted"
                            onClick={() => setOffset(offset + 1)}
                        >
                            <ChevronRightSharp sx={{ fontSize: "1.17em" }} />
                        </Button>
                    </div>
                </div>
            </div>
            <EventTimerContext.Provider
                value={{
                    width,
                    currentTimeBlockStart,
                    hoveredEvent,
                    setHoveredEvent,
                    selectedEvent,
                    setSelectedEvent: _setSelectedEvent,
                    eventWrapperRef,
                    widthRulerRef,
                    onComplete,
                    highlightScheme,
                }}
            >
                <div
                    className={classNames(styles.eventTimer, {
                        [styles.isCollapsed]: isTimerCollapsed,
                    })}
                >
                    <div className={styles.innerWrapper}>
                        <div
                            className={styles.leftFrame}
                            ref={indicatorWrapperRef}
                        >
                            <div className={styles.spacer} />
                            <div className={styles.regionIndicatorContainer}>
                                {eventConfig.map(region => (
                                    <RegionIndicator
                                        key={region.key}
                                        region={region}
                                        isHovered={hoveredRegion === region.key}
                                    />
                                ))}
                            </div>
                        </div>
                        <div
                            className={styles.rightFrame}
                            ref={scrollParentRef}
                        >
                            <div className={styles.widthRuler}>
                                <div ref={widthRulerRef} />
                            </div>
                            <TimeRow />
                            <div className={styles.eventContainer}>
                                <CurrentTimeIndicator />
                                <HoveredEventIndicator />

                                <div
                                    className={styles.regions}
                                    ref={eventWrapperRef}
                                >
                                    {eventConfig.map(region => (
                                        <EventRegion
                                            key={region.key}
                                            region={region}
                                            currentTimeBlockStart={
                                                currentTimeBlockStart
                                            }
                                            indicatorWrapperRef={
                                                indicatorWrapperRef
                                            }
                                            setHoveredRegion={setHoveredRegion}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <EventInfoMenu />
            </EventTimerContext.Provider>
        </div>
    );
};

export default EventTimers;
