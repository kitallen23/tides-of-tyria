import { useEffect, useRef } from "react";
import styles from "@/styles/modules/event-timer.module.scss";

import EventRegion, { CurrentTimeIndicator, TimeRow } from "./EventComponents";
import META_EVENTS from "@/utils/meta_events";
import EventTimerContext from "./EventTimerContext";
import { useResizeDetector } from "react-resize-detector";

const EventTimers = ({ currentTimeBlockStart }) => {
    const scrollParentRef = useRef(null);

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
