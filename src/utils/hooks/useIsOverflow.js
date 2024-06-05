import { useLayoutEffect, useState } from "react";

const useIsOverflow = (ref, callback) => {
    const [isOverflow, setIsOverflow] = useState(undefined);

    useLayoutEffect(() => {
        const { current } = ref;

        const trigger = () => {
            const hasOverflow = current.scrollWidth > current.clientWidth;
            setIsOverflow(hasOverflow);
            if (callback) {
                callback(hasOverflow);
            }
        };

        if (current) {
            trigger();
        }
    }, [callback, ref]);

    return isOverflow;
};

export default useIsOverflow;
