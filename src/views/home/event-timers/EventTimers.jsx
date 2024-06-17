import { useEffect, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import classNames from "classnames";
import styles from "@/styles/modules/event-timer.module.scss";

import EventRegion, { RegionIndicator, TimeRow } from "./EventComponents";
import META_EVENTS from "@/utils/meta_events";
import EventTimerContext from "./EventTimerContext";
import CurrentTimeIndicator from "./CurrentTimeIndicator";
import HoveredEventIndicator from "./HoveredEventIndicator";
import EventInfoMenu from "./EventInfoMenu";
import { getLocalItem } from "@/utils/util";
import { LOCAL_STORAGE_KEYS } from "@/utils/constants";
import { useTimer } from "@/utils/hooks/useTimer";
import { cleanEventConfig, markEventComplete } from "./utils";
import { addMinutes, min } from "date-fns";

const EventTimers = ({ currentTimeBlockStart, isCollapsed }) => {
    const scrollParentRef = useRef(null);
    const indicatorWrapperRef = useRef(null);
    const eventWrapperRef = useRef(null);
    const { now, dailyReset } = useTimer();

    const [hoveredRegion, setHoveredRegion] = useState("");
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [eventConfig, setEventConfig] = useState(null);

    // Take event config from local storage, clean it, set in state, then save
    // back to local storage
    const initialiseEventConfig = (eventConfigString, dailyReset) => {
        try {
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
    }, [scrollParentRef]);

    if (!eventConfig) {
        return null;
    }

    return (
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
            }}
        >
            <div
                className={classNames(styles.eventTimer, {
                    [styles.isCollapsed]: isCollapsed,
                })}
            >
                <div className={styles.innerWrapper}>
                    <div className={styles.leftFrame} ref={indicatorWrapperRef}>
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
                    <div className={styles.rightFrame} ref={scrollParentRef}>
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
    );
};

export default EventTimers;
