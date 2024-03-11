import { useEffect, useState } from "react";
import { useTimer } from "./useTimer";

const useTimerValue = (initialValue, updateFn) => {
    const { key } = useTimer();
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(currentValue => updateFn(currentValue));
    }, [key, updateFn]);

    return value;
};

export default useTimerValue;
