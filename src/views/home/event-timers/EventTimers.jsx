import { useEffect, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import classNames from "classnames";
import styles from "./event-timer.module.scss";
import globalStyles from "@/styles/modules/global-styles.module.scss";
import layoutStyles from "../home.module.scss";
import { Button, useMediaQuery } from "@mui/material";
import {
    ChevronLeftSharp,
    ChevronRightSharp,
    DoneSharp,
    HistorySharp,
    HourglassTopSharp,
    MoreVertSharp,
    RestartAltSharp,
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
// import { differenceInMinutes, addHours } from "date-fns";
import * as ScrollArea from "@radix-ui/react-scroll-area";

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
    MODES,
    UPCOMING_MINS,
    cleanEventConfig,
    markAllAreasVisible,
    markAllEventsIncomplete,
    markEventComplete,
    resetConfigToDefault,
    toggleAreaVisibility,
    togglePhaseVisibility,
} from "./utils";
import EventTimerContext from "./EventTimerContext";
import OptionsMenu from "./components/OptionsMenu";
import CurrentTimeIndicator from "./components/CurrentTimeIndicator";
import HoveredEventIndicator from "./components/HoveredEventIndicator";
import EventInfoMenu from "./components/EventInfoMenu";
import useEventConfig from "./useEventConfig";
import useGlobalHotkeys from "@/utils/hooks/useGlobalHotkeys";
import { toast } from "react-hot-toast";
import InfoIcon from "@/components/InfoIcon";
import CurrentSpecialEventPicker from "@/components/CurrentSpecialEventPicker";

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
    const isSmallScreen = useMediaQuery("(max-width: 768px)");
    const isTouchDevice = useMediaQuery("(pointer: coarse)");

    const [hoveredRegion, setHoveredRegion] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentSpecialEvent, setCurrentSpecialEvent] = useState(() => {
        const currentSpecialEvent = getLocalItem(
            LOCAL_STORAGE_KEYS.currentSpecialEvent,
            "none"
        );
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.currentSpecialEvent,
            currentSpecialEvent
        );
        return currentSpecialEvent;
    });

    const onCurrentSpecialEventChange = value => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.currentSpecialEvent, value);
        setCurrentSpecialEvent(value);
    };

    const [_eventConfig, set_eventConfig] = useState(null);

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
                set_eventConfig(META_EVENTS);
                return;
            }
            let eventConfig = JSON.parse(eventConfigString);
            eventConfig = cleanEventConfig(eventConfig, dailyReset);

            // Merge event config with new default event config if versions
            // don't match
            if (
                (eventConfig?.[0]?.version ?? "1970-01-01") <
                META_EVENTS?.[0]?.version
            ) {
                eventConfig = resetConfigToDefault(eventConfig, META_EVENTS);
            }

            set_eventConfig(eventConfig);
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
            set_eventConfig(META_EVENTS);
        }
    };

    useEffect(() => {
        const eventConfigString = getLocalItem(
            LOCAL_STORAGE_KEYS.eventConfig,
            ""
        );
        initialiseEventConfig(eventConfigString, dailyReset);
        // console.info(
        //     `Minutes until next reset: `,
        //     differenceInMinutes(addHours(dailyReset, 24), new Date())
        // );
    }, [dailyReset]);

    const onComplete = event => {
        const eventEnd = addMinutes(event.startDate, event.duration);
        const completionDate = min([eventEnd, now]);
        const eventConfigWithCompletedEvent = markEventComplete(
            _eventConfig,
            event,
            completionDate
        );
        set_eventConfig(eventConfigWithCompletedEvent);
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.eventConfig,
            JSON.stringify(eventConfigWithCompletedEvent)
        );
        setSelectedEvent(null);
    };

    const onResetCompletedEvents = () => {
        const eventConfigAfterReset = markAllEventsIncomplete(_eventConfig);
        set_eventConfig(eventConfigAfterReset);
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.eventConfig,
            JSON.stringify(eventConfigAfterReset)
        );
        setSelectedEvent(null);
    };

    const onToggleHidden = area => {
        const eventConfigWithToggledAreaVisibility = toggleAreaVisibility(
            _eventConfig,
            area
        );
        set_eventConfig(eventConfigWithToggledAreaVisibility);
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.eventConfig,
            JSON.stringify(eventConfigWithToggledAreaVisibility)
        );
    };
    const onTogglePhaseHidden = (area, phaseKey) => {
        const eventConfigWithToggledPhaseVisibility = togglePhaseVisibility(
            _eventConfig,
            area,
            phaseKey
        );
        set_eventConfig(eventConfigWithToggledPhaseVisibility);
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.eventConfig,
            JSON.stringify(eventConfigWithToggledPhaseVisibility)
        );
    };

    const onMarkAllAreasVisible = () => {
        const eventConfigWithResetAreaVisibility =
            markAllAreasVisible(_eventConfig);
        set_eventConfig(eventConfigWithResetAreaVisibility);
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.eventConfig,
            JSON.stringify(eventConfigWithResetAreaVisibility)
        );
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
            const container0 =
                scrollParentRef.current.querySelector("#time-row");
            const container1 = scrollParentRef.current.querySelector(
                "#event-scroll-viewport"
            );

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
            "true"
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
            HIGHLIGHT_SCHEMES.future
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

    const cycleHighlightScheme = () => {
        const nextScheme =
            highlightScheme === HIGHLIGHT_SCHEMES.upcoming
                ? HIGHLIGHT_SCHEMES.future
                : highlightScheme === HIGHLIGHT_SCHEMES.future
                  ? HIGHLIGHT_SCHEMES.all
                  : HIGHLIGHT_SCHEMES.upcoming;
        localStorage.setItem(LOCAL_STORAGE_KEYS.highlightScheme, nextScheme);
        setHighlightScheme(nextScheme);
        const infoString =
            nextScheme === HIGHLIGHT_SCHEMES.upcoming
                ? `current & upcoming events (next ${UPCOMING_MINS} mins)`
                : nextScheme === HIGHLIGHT_SCHEMES.future
                  ? "all current & future events"
                  : "all events";

        toast(`Highlighting ${infoString}`, {
            icon: <InfoIcon />,
            id: "highlight-scheme",
        });
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
        setSelectedEvent(null);
    };
    const toggleShowCompletedWithToast = () => {
        const _showCompleted = !showCompleted;
        localStorage.setItem(LOCAL_STORAGE_KEYS.showCompleted, _showCompleted);
        setShowCompleted(_showCompleted);
        setSelectedEvent(null);
        toast(
            _showCompleted
                ? "Completed events shown"
                : "Completed events hidden",
            {
                icon: <InfoIcon />,
                id: "completed-event-visibility",
            }
        );
    };

    const [denseMode, setDenseMode] = useState(() => {
        const denseMode = getLocalItem(
            LOCAL_STORAGE_KEYS.denseMode,
            isTouchDevice ? "true" : "false"
        );
        localStorage.setItem(LOCAL_STORAGE_KEYS.denseMode, denseMode);
        return denseMode === "true";
    });

    const toggleDenseMode = () => {
        const _denseMode = !denseMode;
        localStorage.setItem(LOCAL_STORAGE_KEYS.denseMode, _denseMode);
        setDenseMode(_denseMode);
    };

    const [groupedMode, setGroupedMode] = useState(() => {
        const groupedMode = getLocalItem(
            LOCAL_STORAGE_KEYS.groupedMode,
            "true"
        );
        localStorage.setItem(LOCAL_STORAGE_KEYS.groupedMode, groupedMode);
        return groupedMode === "true";
    });

    const toggleGroupedMode = () => {
        const _groupedMode = !groupedMode;
        localStorage.setItem(LOCAL_STORAGE_KEYS.groupedMode, _groupedMode);
        setGroupedMode(_groupedMode);
    };

    const [mode, setMode] = useState(MODES.view);

    const [menuAnchor, setMenuAnchor] = useState(null);
    const isMenuOpen = Boolean(menuAnchor);

    const onMenuButtonClick = event => {
        setMenuAnchor(event.currentTarget);
    };
    const onMenuClose = () => {
        setMenuAnchor(null);
    };

    useGlobalHotkeys({
        h: toggleShowCompletedWithToast,
        f: toggleIsTimerCollapsed,
        s: cycleHighlightScheme,
    });

    const eventConfig = useEventConfig({
        eventConfig: _eventConfig,
        showCompleted,
        mode,
    });

    if (!eventConfig) {
        return null;
    }

    return (
        <div className={layoutStyles.group}>
            <div className={globalStyles.centeredContent}>
                <div className={layoutStyles.headingRow}>
                    <div className={layoutStyles.heading}>
                        <h3>
                            <HourglassTopSharp
                                style={{ marginRight: "0.25rem" }}
                            />
                            {isSmallScreen ? "" : "GW2 "}Event Timers
                        </h3>
                        <span
                            style={{
                                color: colors.muted,
                                fontSize: "0.85em",
                            }}
                            className={globalStyles.hideBelowMd}
                        >
                            &nbsp;|{" "}
                            {mode === MODES.edit
                                ? "Click an event to show or hide it permanently"
                                : "Click an event to see info"}
                        </span>
                    </div>
                    <div className={layoutStyles.buttonGroup}>
                        {mode === MODES.edit ? (
                            <>
                                <Button
                                    variant="text"
                                    sx={{ minWidth: 0, gap: 1, lineHeight: 1 }}
                                    color="success"
                                    onClick={() => setMode(MODES.view)}
                                    key="finish-editing"
                                >
                                    <DoneSharp sx={{ fontSize: "1.17em" }} />
                                    Finish editing
                                </Button>
                                <Button
                                    variant="text"
                                    sx={{ minWidth: 0, gap: 1 }}
                                    color="muted"
                                    onClick={onMarkAllAreasVisible}
                                    key="reset-hidden"
                                    aria-label="Reset to default"
                                >
                                    <RestartAltSharp
                                        sx={{ fontSize: "1.17em" }}
                                    />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="text"
                                    sx={{ minWidth: 0 }}
                                    color="muted"
                                    onClick={onMenuButtonClick}
                                    key="more-menu"
                                    aria-label="Event timer menu"
                                >
                                    <MoreVertSharp
                                        sx={{ fontSize: "1.17em" }}
                                    />
                                </Button>
                                <OptionsMenu
                                    anchorEl={menuAnchor}
                                    open={isMenuOpen}
                                    isTimerCollapsed={isTimerCollapsed}
                                    onClose={onMenuClose}
                                    onReset={onResetCompletedEvents}
                                    toggleIsTimerCollapsed={
                                        toggleIsTimerCollapsed
                                    }
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    highlightScheme={highlightScheme}
                                    onHighlightSchemeChange={
                                        onHighlightSchemeChange
                                    }
                                    showCompleted={showCompleted}
                                    toggleShowCompleted={toggleShowCompleted}
                                    denseMode={denseMode}
                                    toggleDenseMode={toggleDenseMode}
                                    groupedMode={groupedMode}
                                    toggleGroupedMode={toggleGroupedMode}
                                    setMode={setMode}
                                />
                                <Button
                                    variant="text"
                                    sx={{ minWidth: 0 }}
                                    color="muted"
                                    onClick={() => setOffset(offset - 1)}
                                    aria-label="Previous hour"
                                >
                                    <ChevronLeftSharp
                                        sx={{ fontSize: "1.17em" }}
                                    />
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
                                    aria-label="Jump to now"
                                >
                                    <HistorySharp sx={{ fontSize: "1.17em" }} />
                                </Button>
                                <Button
                                    variant="text"
                                    sx={{ minWidth: 0 }}
                                    color="muted"
                                    onClick={() => setOffset(offset + 1)}
                                    aria-label="Next hour"
                                >
                                    <ChevronRightSharp
                                        sx={{ fontSize: "1.17em" }}
                                    />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <EventTimerContext.Provider
                value={{
                    width,
                    currentTimeBlockStart,
                    selectedEvent,
                    setSelectedEvent: _setSelectedEvent,
                    eventWrapperRef,
                    widthRulerRef,
                    onComplete,
                    onToggleHidden,
                    onTogglePhaseHidden,
                    highlightScheme,
                    denseMode,
                    groupedMode,
                    mode,
                    currentSpecialEvent,
                    setCurrentSpecialEvent: onCurrentSpecialEventChange,
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
                                {eventConfig.map(region => {
                                    if (
                                        (groupedMode &&
                                            region.grouped === false) ||
                                        (!groupedMode &&
                                            region.grouped === true)
                                    ) {
                                        return null;
                                    }
                                    return (
                                        <RegionIndicator
                                            key={region.key}
                                            region={region}
                                            isHovered={
                                                hoveredRegion === region.key
                                            }
                                            currentSpecialEvent={
                                                currentSpecialEvent
                                            }
                                        />
                                    );
                                })}
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
                            <ScrollArea.Root className={styles.scrollAreaRoot}>
                                <ScrollArea.Viewport
                                    className={styles.scrollAreaViewport}
                                    id="event-scroll-viewport"
                                >
                                    <div className={styles.eventContainer}>
                                        <CurrentTimeIndicator />
                                        <HoveredEventIndicator />

                                        <div
                                            className={styles.regions}
                                            ref={eventWrapperRef}
                                        >
                                            {eventConfig.map(region => {
                                                if (
                                                    (groupedMode &&
                                                        region.grouped ===
                                                            false) ||
                                                    (!groupedMode &&
                                                        region.grouped === true)
                                                ) {
                                                    return null;
                                                }
                                                return (
                                                    <EventRegion
                                                        key={region.key}
                                                        region={region}
                                                        currentTimeBlockStart={
                                                            currentTimeBlockStart
                                                        }
                                                        indicatorWrapperRef={
                                                            indicatorWrapperRef
                                                        }
                                                        setHoveredRegion={
                                                            setHoveredRegion
                                                        }
                                                        currentSpecialEvent={
                                                            currentSpecialEvent
                                                        }
                                                    />
                                                );
                                            })}
                                        </div>

                                        <CurrentSpecialEventPicker />
                                    </div>
                                </ScrollArea.Viewport>
                                <ScrollArea.Scrollbar
                                    className={styles.scrollAreaScrollbar}
                                    orientation="horizontal"
                                >
                                    <ScrollArea.Thumb
                                        className={styles.scrollAreaThumb}
                                    />
                                </ScrollArea.Scrollbar>
                                <ScrollArea.Corner
                                    className={styles.scrollAreaCorner}
                                />
                            </ScrollArea.Root>
                        </div>
                    </div>
                </div>
                <EventInfoMenu />
            </EventTimerContext.Provider>
        </div>
    );
};

export default EventTimers;
