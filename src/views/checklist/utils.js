import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    isBefore,
} from "date-fns";

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

/**
 * Calculates the difference between two dates and returns a formatted string.
 *
 * @param {Date} now - The current date.
 * @param {Date} dailyReset - The target date to compare with.
 * @returns {string} The formatted time difference.
 */
export function formatRelativeTime(now, dailyReset) {
    const diffInMinutes = differenceInMinutes(dailyReset, now);

    if (diffInMinutes < 1) {
        return "less than 1m";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
        // Less than 24 hours
        const hours = differenceInHours(dailyReset, now);
        const minutes = diffInMinutes % 60;
        return `${hours}h ${minutes}m`;
    } else {
        const days = differenceInDays(dailyReset, now);
        const hours = differenceInHours(dailyReset, now) % 24;
        return `${days}d ${hours}h`;
    }
}
