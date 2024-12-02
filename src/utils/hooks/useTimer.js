import { createContext, useContext } from "react";

const DEFAULT_TIMER_CONTEXT = {
    key: 0,
    now: new Date(),
    dailyReset: new Date().setUTCHours(0, 0, 0, 0),
    weeklyReset: undefined,
    updateKey: () => {},
};
export const TimerContext = createContext(DEFAULT_TIMER_CONTEXT);

export function useTimer() {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error("useTimer must be used within a TimerProvider.");
    }
    return context;
}
