import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    isBefore,
} from "date-fns";

export const DEFAULT_DAILY_CHECKLIST = [
    {
        text: "<b>Note</b>: any item checked off here will be automatically unchecked on the next daily reset",
        isComplete: false,
        indentLevel: 0,
    },
    {
        text: "Modify this list to your liking! Below are some example daily tasks.",
        isComplete: false,
        indentLevel: 0,
    },
    {
        text: "Farm home instance",
        isComplete: false,
        indentLevel: 0,
    },
    {
        text: "Do instanced content:",
        isComplete: false,
        indentLevel: 0,
    },
    {
        text: "Strikes",
        isComplete: false,
        indentLevel: 1,
    },
    {
        text: "Fractals",
        isComplete: false,
        indentLevel: 1,
    },
    {
        text: 'Buy&nbsp;<a href="https://wiki.guildwars2.com/wiki/Faction_Provisioner" target="_blank" rel="noopener noreferrer">Provisioner Tokens</a>',
        isComplete: false,
        indentLevel: 0,
    },
    {
        text: "Use Karmic Converter",
        isComplete: false,
        indentLevel: 0,
    },
    {
        text: "Wizard's Vault dailies",
        isComplete: false,
        indentLevel: 0,
    },
];

export const DEFAULT_WEEKLY_CHECKLIST = [
    {
        text: "<b>Note</b>: any item checked off here will be automatically unchecked on the next weekly reset",
        isComplete: false,
        indentLevel: 0,
    },
    {
        text: "Modify this list to your liking! Below are some example weekly tasks.",
        isComplete: false,
        indentLevel: 0,
    },
    {
        text: 'Buy <a rel="noopener noreferrer" target="_blank" href="https://wiki.guildwars2.com/wiki/Mystic_Clover">Mystic Clovers</a>:',
        isComplete: false,
        indentLevel: 0,
    },
    {
        text: "Magnetite shards",
        isComplete: false,
        indentLevel: 1,
    },
    {
        text: "Fractal relics",
        isComplete: false,
        indentLevel: 1,
    },
    {
        text: "Prophet shards",
        isComplete: false,
        indentLevel: 1,
    },
    {
        text: "Also buy mystic coins here",
        isComplete: false,
        indentLevel: 2,
    },
    {
        text: "Antique Summoning Stones",
        isComplete: false,
        indentLevel: 0,
    },
    {
        text: "Raids:",
        isComplete: false,
        indentLevel: 0,
    },
    {
        text: "HoT",
        isComplete: false,
        indentLevel: 1,
    },
    {
        text: "PoF",
        isComplete: false,
        indentLevel: 1,
    },
    {
        text: "JW",
        isComplete: false,
        indentLevel: 1,
    },
    {
        text: "Weekly Wizard's Vault",
        isComplete: false,
        indentLevel: 0,
    },
];

/**
 * Cleans the checklist by resetting items that were last completed before a specified date.
 *
 * This function iterates over each item in the `checklist` array and checks if the `lastCompletion`
 * date is before the provided `reset` date. If so, it resets the `lastCompletion` to `undefined`
 * and marks the item as incomplete by setting `isComplete` to `false`.
 *
 * @param {Array<Object>} checklist - An array of checklist items. Each item should be an object
 * with a `lastCompletion` property (a Date or date string) and an `isComplete` boolean property.
 * @param {Date|string} reset - The date to compare against each item's `lastCompletion`. Items completed
 * before this date will be reset.
 *
 * @returns {Array<Object>} A new array of checklist items with updates applied based on the `reset` date.
 */

export const cleanChecklist = (checklist, reset) => {
    return checklist.map(item => {
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
 * @param {Date} reset - The target date to compare with.
 * @returns {string} The formatted time difference.
 */
export function formatRelativeTime(now, reset) {
    const diffInMinutes = differenceInMinutes(reset, now);

    if (diffInMinutes < 1) {
        return "less than 1m";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
        // Less than 24 hours
        const hours = differenceInHours(reset, now);
        const minutes = diffInMinutes % 60;
        return `${hours}h ${minutes}m`;
    } else {
        const days = differenceInDays(reset, now);
        const hours = differenceInHours(reset, now) % 24;
        return `${days}d ${hours}h`;
    }
}

/**
 * Returns the next Monday at 7:30 AM UTC based on the provided last reset date.
 * @param {Date} lastWeeklyReset - The Date object representing the last reset (Monday at 7:30 AM UTC).
 * @returns {Date} The next reset Date object set to Monday at 7:30 AM UTC.
 */
export function getNextWeeklyReset(lastWeeklyReset) {
    // Add 7 days (in milliseconds) to the last reset time
    const nextResetTime = lastWeeklyReset.getTime() + 7 * 24 * 60 * 60 * 1000;
    return new Date(nextResetTime);
}
