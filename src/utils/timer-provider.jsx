import { useState, useEffect } from "react";
import { TimerContext } from "@/utils/hooks/useTimer";

// const INTERVAL_MS = 100;
const INTERVAL_MS = 10000;

export const TimerProvider = ({ children }) => {
    const [key, setKey] = useState(0);
    const [now, setNow] = useState(new Date());
    const [dailyReset, setDailyReset] = useState(
        new Date().setUTCHours(0, 0, 0, 0)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setKey(prevKey => prevKey + 1);
            setNow(new Date());
            setDailyReset(new Date().setUTCHours(0, 0, 0, 0));
        }, INTERVAL_MS);

        return () => clearInterval(interval);
    }, []);

    const updateKey = () => setKey(prevKey => prevKey + 1);

    return (
        <TimerContext.Provider value={{ key, now, dailyReset, updateKey }}>
            {children}
        </TimerContext.Provider>
    );
};
