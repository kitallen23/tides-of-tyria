import { createRef, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { addHours } from "date-fns";
// TODO: Remove me
// import { format, differenceInMinutes } from "date-fns";

import { getLocalItem } from "@/utils/util";
import { LOCAL_STORAGE_KEYS } from "@/utils/constants";
import { useTimer } from "@/utils/hooks/useTimer";
import debounce from "lodash.debounce";
import { sanitizeRichText } from "@/components/editor/utils";
import {
    cleanChecklist,
    formatRelativeTime,
    getNextWeeklyReset,
} from "./utils";

const useChecklistPage = () => {
    const { now, dailyReset, weeklyReset } = useTimer();

    /**
     * Todo checklist logic
     */
    const initialiseTodoChecklist = () => {
        // Load from local storage on initial render
        const savedChecklist = getLocalItem(
            LOCAL_STORAGE_KEYS.todoChecklist,
            "[]"
        );

        try {
            const parsedChecklist = JSON.parse(savedChecklist);

            localStorage.setItem(
                LOCAL_STORAGE_KEYS.todoChecklist,
                JSON.stringify(parsedChecklist)
            );

            const todoChecklistWithRefs = parsedChecklist.map(item => ({
                ...item,
                inputRef: createRef(),
                renderKey: nanoid(4),
            }));
            return todoChecklistWithRefs;
        } catch {
            return [];
        }
    };

    const [todoChecklistItems, setTodoChecklistItems] = useState(() =>
        initialiseTodoChecklist()
    );

    const debouncedSaveTodoChecklistItems = useMemo(
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

                localStorage.setItem(
                    LOCAL_STORAGE_KEYS.todoChecklist,
                    JSON.stringify(sanitisedItems)
                );
            }, 50),
        []
    );
    useEffect(() => {
        debouncedSaveTodoChecklistItems(todoChecklistItems);

        return () => {
            debouncedSaveTodoChecklistItems.cancel();
        };
    }, [todoChecklistItems, debouncedSaveTodoChecklistItems]);

    /**
     * Daily checklist logic
     */
    const timeUntilDailyReset = useMemo(
        () => formatRelativeTime(now, addHours(dailyReset, 24)),
        [now, dailyReset]
    );

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
            const cleanedDailyChecklist = cleanChecklist(
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
        //     `Minutes until next daily reset (${format(dailyReset, "hh:mmaaa dd/MM/yyyy")}): `,
        //     differenceInMinutes(addHours(dailyReset, 24), new Date())
        // );
        setDailyChecklistItems(prevItems => {
            const newItems = cleanChecklist(prevItems, dailyReset);
            return newItems;
        });
    }, [dailyReset]);

    const debouncedSaveDailyChecklistItems = useMemo(
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

                localStorage.setItem(
                    LOCAL_STORAGE_KEYS.dailyChecklist,
                    JSON.stringify(sanitisedItems)
                );
            }, 50),
        []
    );
    useEffect(() => {
        debouncedSaveDailyChecklistItems(dailyChecklistItems);

        return () => {
            debouncedSaveDailyChecklistItems.cancel();
        };
    }, [dailyChecklistItems, debouncedSaveDailyChecklistItems]);

    /**
     * Weekly checklist logic
     */
    const timeUntilWeeklyReset = useMemo(
        () => formatRelativeTime(now, getNextWeeklyReset(weeklyReset)),
        [now, weeklyReset]
    );

    const initialiseWeeklyChecklist = () => {
        // Load from local storage on initial render
        const savedChecklist = getLocalItem(
            LOCAL_STORAGE_KEYS.weeklyChecklist,
            "[]"
        );

        try {
            const parsedWeeklyChecklist = JSON.parse(savedChecklist);

            // Clean the isComplete status if necessary, based on the last
            // completion time
            const cleanedWeeklyChecklist = cleanChecklist(
                parsedWeeklyChecklist,
                weeklyReset
            );
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.weeklyChecklist,
                JSON.stringify(cleanedWeeklyChecklist)
            );

            const weeklyChecklistWithRefs = cleanedWeeklyChecklist.map(
                item => ({
                    ...item,
                    inputRef: createRef(),
                    renderKey: nanoid(4),
                })
            );
            return weeklyChecklistWithRefs;
        } catch {
            return [];
        }
    };

    const [weeklyChecklistItems, setWeeklyChecklistItems] = useState(() =>
        initialiseWeeklyChecklist()
    );

    useEffect(() => {
        setWeeklyChecklistItems(prevItems => {
            const newItems = cleanChecklist(prevItems, weeklyReset);
            return newItems;
        });
    }, [weeklyReset]);

    const debouncedSaveWeeklyChecklistItems = useMemo(
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

                localStorage.setItem(
                    LOCAL_STORAGE_KEYS.weeklyChecklist,
                    JSON.stringify(sanitisedItems)
                );
            }, 50),
        []
    );
    useEffect(() => {
        debouncedSaveWeeklyChecklistItems(weeklyChecklistItems);

        return () => {
            debouncedSaveWeeklyChecklistItems.cancel();
        };
    }, [weeklyChecklistItems, debouncedSaveWeeklyChecklistItems]);

    return {
        todoChecklistItems,
        setTodoChecklistItems,

        dailyChecklistItems,
        setDailyChecklistItems,
        timeUntilDailyReset,

        weeklyChecklistItems,
        setWeeklyChecklistItems,
        timeUntilWeeklyReset,
    };
};

export default useChecklistPage;
