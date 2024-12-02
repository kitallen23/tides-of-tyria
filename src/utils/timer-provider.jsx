import { useState, useEffect } from "react";
import { TimerContext } from "@/utils/hooks/useTimer";

const INTERVAL_MS = 10000;

/**
 * Returns the last Monday at 7:30 AM UTC, which is what GW2 servers use for
 * weekly reset of most things.
 * @returns {Date} Date object set to last Monday at 7:30 AM UTC
 */
function getWeeklyReset() {
    const now = new Date();

    // 0 (Sun) to 6 (Sat)
    const dayOfWeek = now.getUTCDay();
    let daysSinceMonday = (dayOfWeek + 6) % 7 || 7;

    // If today is Monday, check if current time is past 7:30 AM UTC
    if (dayOfWeek === 1) {
        const currentMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
        const resetMinutes = 7 * 60 + 30;
        if (currentMinutes >= resetMinutes) {
            daysSinceMonday = 0;
        }
    }

    const lastMonday = new Date(
        Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - daysSinceMonday,
            7,
            30,
            0,
            0
        )
    );
    return lastMonday;
}

export const TimerProvider = ({ children }) => {
    const [key, setKey] = useState(0);
    const [now, setNow] = useState(new Date());
    const [dailyReset, setDailyReset] = useState(
        new Date().setUTCHours(0, 0, 0, 0)
    );
    const [weeklyReset, setWeeklyReset] = useState(getWeeklyReset());

    useEffect(() => {
        // Calculate the initial delay to align with the next minute
        const now = new Date();
        const seconds = now.getSeconds();
        // This delay is the # of ms between now and the next minute, but modulo
        // 10,000 (ms), which gives the delay until the next 10s interval that
        // lines up with the minute.
        const initialDelay =
            ((60 - seconds) * 1000 - now.getMilliseconds()) % 10000;

        const intervalCallback = () => {
            setKey(prevKey => prevKey + 1);
            setNow(new Date());
            setDailyReset(new Date().setUTCHours(0, 0, 0, 0));
            setWeeklyReset(getWeeklyReset());
        };

        // Set timeout for the initial delay
        const timeout = setTimeout(() => {
            intervalCallback();
            // Set interval after the initial delay
            const interval = setInterval(intervalCallback, INTERVAL_MS);
            return () => clearInterval(interval);
        }, initialDelay);

        return () => clearTimeout(timeout);
    }, []);

    const updateKey = () => setKey(prevKey => prevKey + 1);

    return (
        <TimerContext.Provider
            value={{ key, now, dailyReset, weeklyReset, updateKey }}
        >
            {children}
        </TimerContext.Provider>
    );
};
