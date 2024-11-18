import { createRef, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
// import { addHours, differenceInMinutes, format } from "date-fns";

import { getLocalItem } from "@/utils/util";
import { LOCAL_STORAGE_KEYS } from "@/utils/constants";
import { useTimer } from "@/utils/hooks/useTimer";
import debounce from "lodash.debounce";
import { sanitizeRichText } from "@/components/editor/utils";
import { cleanDailyChecklist } from "./utils";

const useChecklistPage = () => {
    const { dailyReset } = useTimer();

    const initialiseDailyChecklist = () => {
        // Load from local storage on initial render
        const savedChecklist = getLocalItem(
            LOCAL_STORAGE_KEYS.dailyChecklist,
            "[]"
        );

        try {
            const parsedDailyChecklist = JSON.parse(savedChecklist);

            // Clean the isComplete status if necessary, based on the last
            // completion time
            const cleanedDailyChecklist = cleanDailyChecklist(
                parsedDailyChecklist,
                dailyReset
            );
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.dailyChecklist,
                JSON.stringify(cleanedDailyChecklist)
            );

            const dailyChecklistWithRefs = cleanedDailyChecklist.map(item => ({
                ...item,
                inputRef: createRef(),
                renderKey: nanoid(4),
            }));
            return dailyChecklistWithRefs;
        } catch {
            return [];
        }
    };

    const [dailyChecklistItems, setDailyChecklistItems] = useState(() =>
        initialiseDailyChecklist()
    );

    useEffect(() => {
        // TODO: Remove me
        // console.info(
        //     `Minutes until next reset (${format(dailyReset, "hh:mmaaa dd/MM/yyyy")}): `,
        //     differenceInMinutes(addHours(dailyReset, 24), new Date())
        // );
        setDailyChecklistItems(prevItems => {
            const newItems = cleanDailyChecklist(prevItems, dailyReset);
            return newItems;
        });
    }, [dailyReset]);

    const debouncedSaveChecklistItems = useMemo(
        () =>
            debounce(items => {
                // Sanitise the HTML of the items
                const sanitisedItems = items.map(item => {
                    // eslint-disable-next-line no-unused-vars
                    const { inputRef, renderKey, ...rest } = item;
                    return {
                        ...rest,
                        text: sanitizeRichText(inputRef.current?.innerHTML),
                    };
                });

                // TODO: Remove me
                // console.info(
                //     `Saving daily items to local storage: `,
                //     LOCAL_STORAGE_KEYS.dailyChecklist,
                //     sanitisedItems
                // );

                localStorage.setItem(
                    LOCAL_STORAGE_KEYS.dailyChecklist,
                    JSON.stringify(sanitisedItems)
                );
            }, 50),
        []
    );
    useEffect(() => {
        debouncedSaveChecklistItems(dailyChecklistItems);

        return () => {
            debouncedSaveChecklistItems.cancel();
        };
    }, [dailyChecklistItems, debouncedSaveChecklistItems]);

    return {
        dailyChecklistItems,
        setDailyChecklistItems,
    };
};

export default useChecklistPage;
