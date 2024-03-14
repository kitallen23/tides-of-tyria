import { useEffect, useMemo, useState } from "react";
import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "@/styles/modules/home.module.scss";
import {
    ChevronLeftSharp,
    ChevronRightSharp,
    HistorySharp,
    HourglassTopSharp,
} from "@mui/icons-material";
import {
    addMinutes,
    getHours,
    isEqual,
    setHours,
    setMilliseconds,
    setMinutes,
    setSeconds,
} from "date-fns";
import { Button } from "@mui/material";

import EventTimers from "./EventTimers";
import { useTimer } from "@/utils/hooks/useTimer";
import { TIME_BLOCK_MINS } from "./EventComponents";
import { useTheme } from "@/utils/theme-provider";

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

const Home = () => {
    const { key, now } = useTimer();
    const { colors } = useTheme();
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

    const timeBlockContainsNow = useMemo(() => {
        const currentTimeBlockEnd = addMinutes(
            currentTimeBlockStart,
            TIME_BLOCK_MINS
        );
        if (now >= currentTimeBlockStart && now <= currentTimeBlockEnd) {
            return true;
        }
        return false;
    }, [currentTimeBlockStart, now]);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.group}>
                <div className={globalStyles.centeredContent}>
                    <div className={styles.headingRow}>
                        <h3 className={styles.heading}>
                            <HourglassTopSharp
                                style={{ marginRight: "0.25rem" }}
                            />
                            Event Timers
                        </h3>
                        <div className={styles.buttonGroup}>
                            <Button
                                variant="text"
                                sx={{ minWidth: 0 }}
                                color="muted"
                                onClick={() => setOffset(offset - 1)}
                            >
                                <ChevronLeftSharp />
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
                                disabled={timeBlockContainsNow}
                            >
                                <HistorySharp />
                            </Button>
                            <Button
                                variant="text"
                                sx={{ minWidth: 0 }}
                                color="muted"
                                onClick={() => setOffset(offset + 1)}
                            >
                                <ChevronRightSharp />
                            </Button>
                        </div>
                    </div>
                </div>
                <EventTimers currentTimeBlockStart={currentTimeBlockStart} />
            </div>
        </div>
    );
};

export default Home;
