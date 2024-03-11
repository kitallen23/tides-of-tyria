import { useEffect, useState } from "react";
import styles from "@/styles/modules/event-timer.module.scss";
import { getHours, setHours, setMinutes, setSeconds } from "date-fns";

import EventRegion, { TimeRow } from "./EventComponents";

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
        ],
    },
];

const getCurrentTimeBlock = () => {
    const now = new Date();
    const hoursSinceMidnight = getHours(now);
    const hoursSinceLastBlock = hoursSinceMidnight % 2;
    const startTimeBlock = setSeconds(
        setMinutes(setHours(now, hoursSinceMidnight - hoursSinceLastBlock), 0),
        0
    );

    return startTimeBlock;
};

const EventTimers = () => {
    const [currentTimeBlock, setCurrentTimeBlock] = useState(
        getCurrentTimeBlock()
    );
    // const currentTimeBlockEnd = useMemo(
    //     () => addHours(currentTimeBlock, 2),
    //     [currentTimeBlock]
    // );
    useEffect(() => {
        console.log(
            `>>> Current time block: `,
            currentTimeBlock
            // currentTimeBlockEnd
        );
    }, [currentTimeBlock /*, currentTimeBlockEnd*/]);

    return (
        <div className={styles.eventTimer}>
            <div className={styles.leftFrame}>Left</div>
            <div className={styles.rightFrame}>
                <div className={styles.eventContainer}>
                    <TimeRow currentTimeBlock={currentTimeBlock} />
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
