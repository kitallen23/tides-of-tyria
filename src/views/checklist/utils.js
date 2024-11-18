import { isBefore } from "date-fns";

export const cleanDailyChecklist = (dailyChecklist, reset) => {
    return dailyChecklist.map(item => {
        const newItem = { ...item };
        if (newItem.lastCompletion && isBefore(newItem.lastCompletion, reset)) {
            newItem.lastCompletion = undefined;
            newItem.isComplete = false;
        }
        return newItem;
    });
};
