/**
 * Gets the current text selection range.
 * @returns {Range | null} The current selection range, or null if there is no selection.
 **/
export const getSelectionRange = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        return range;
    }
    return null;
};

/**
 * Restores a text selection range.
 * @param {Range} range - The range to be restored.
 **/
export const restoreSelectionRange = range => {
    if (range) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
};
