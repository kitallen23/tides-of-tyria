import { useState, useEffect } from "react";
import { TimerContext } from "@/utils/hooks/useTimer";

const INTERVAL_MS = 10000;

export const TimerProvider = ({ children }) => {
    const [key, setKey] = useState(0);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setKey(prevKey => prevKey + 1);
            setNow(new Date());
        }, INTERVAL_MS);

        return () => clearInterval(interval);
    }, []);

    const updateKey = () => setKey(prevKey => prevKey + 1);

    return (
        <TimerContext.Provider value={{ key, now, updateKey }}>
            {children}
        </TimerContext.Provider>
    );
};
