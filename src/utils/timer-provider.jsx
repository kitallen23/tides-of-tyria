import { useState, useEffect } from "react";
import { TimerContext } from "@/utils/hooks/useTimer";

const INTERVAL_MS = 10000;

export const TimerProvider = ({ children }) => {
    const [key, setKey] = useState(0);
    const [now, setNow] = useState(new Date());
    const [dailyReset, setDailyReset] = useState(
        new Date().setUTCHours(0, 0, 0, 0)
    );

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
        <TimerContext.Provider value={{ key, now, dailyReset, updateKey }}>
            {children}
        </TimerContext.Provider>
    );
};
