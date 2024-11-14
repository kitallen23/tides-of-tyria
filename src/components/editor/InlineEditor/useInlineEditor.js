import DOMPurify from "dompurify";
import { useEffect } from "react";
import { getDecodedLengthWithBr } from "./utils";

const EDITOR_PADDING_VERTICAL = 3;

export const useInlineEditor = ({
    ref,
    defaultValue,
    onChange,
    onNewLine,
    onRemoveLine,
    onFocusPreviousEditor,
    onFocusNextEditor,
}) => {
    useEffect(() => {
        // Set the initial content
        if (ref.current && defaultValue) {
            ref.current.innerHTML = defaultValue;
        }
    }, [defaultValue]); /* eslint-disable-line react-hooks/exhaustive-deps */

    const handleKeyDown = e => {
        // TODO: Remove me
        // console.info(`handleKeyDown event: `, e.key);

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleNewLine();
        } else if (e.key === "Backspace") {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0).cloneRange();
                range.setStart(ref.current, 0);
                const contentBeforeCursor = range.cloneContents();

                const fragment = document.createDocumentFragment();
                fragment.appendChild(contentBeforeCursor);
                const div = document.createElement("div");
                div.appendChild(fragment);

                const htmlBeforeCursor = div.innerHTML;
                const strippedHtml = DOMPurify.sanitize(htmlBeforeCursor, {
                    ALLOWED_TAGS: ["br"],
                });
                const length = getDecodedLengthWithBr(strippedHtml);
                if (length === 0) {
                    e.preventDefault();
                    handleRemoveCurrentLine();
                }
            }
        } else if (e.key === "Escape") {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.collapse(true); // Collapse the selection to the start
                selection.removeAllRanges();
                selection.addRange(range);
            }
            // } else if (e.key === "ArrowUp") {
            //     const selection = window.getSelection();
            //     if (
            //         selection.isCollapsed &&
            //         selection.rangeCount > 0 &&
            //         isOnFirstLine()
            //     ) {
            //         e.preventDefault();
            //         const range = selection.getRangeAt(0).cloneRange();
            //         range.setStart(ref.current, 0);
            //         const contentBeforeCursor = range.cloneContents();

            //         const fragment = document.createDocumentFragment();
            //         fragment.appendChild(contentBeforeCursor);
            //         const div = document.createElement("div");
            //         div.appendChild(fragment);

            //         const textBeforeCursor = div.textContent;
            //         onFocusPreviousEditor(textBeforeCursor?.length || 0);
            //     }
            // } else if (e.key === "ArrowDown") {
            //     const selection = window.getSelection();
            //     if (
            //         selection.isCollapsed &&
            //         selection.rangeCount > 0 &&
            //         isOnLastLine()
            //     ) {
            //         e.preventDefault();
            //         // TODO: Calculate offset, send to onFocusNextEditor
            //         onFocusNextEditor(0);
            //     }
            // }
        } else if (e.key === "ArrowUp") {
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && isOnFirstLine()) {
                e.preventDefault();
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                onFocusPreviousEditor(rect.left);
            }
        } else if (e.key === "ArrowDown") {
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && isOnLastLine()) {
                e.preventDefault();
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                onFocusNextEditor(rect.left);
            }
        }
    };

    /**
     * Determines if the current selection is on the first line of the editor.
     **/
    const isOnFirstLine = () => {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) {
            return false;
        }

        const cursorPosition = getCursorPositionRelativeToEditor();
        return cursorPosition.top <= EDITOR_PADDING_VERTICAL;
    };
    /**
     * Determines if the current selection is on the last line of the editor.
     **/
    const isOnLastLine = () => {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) {
            return false;
        }

        const cursorPosition = getCursorPositionRelativeToEditor();
        return cursorPosition.bottom <= EDITOR_PADDING_VERTICAL;
    };

    /**
     * Gets the cursor's position relative to the contentEditable editor.
     **/
    const getCursorPositionRelativeToEditor = () => {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) {
            return null;
        }

        const range = selection.getRangeAt(0);
        const editor = ref.current;
        const editorRect = editor.getBoundingClientRect();

        const clientRects = range.getClientRects();
        // Special case (only works due to editor padding).
        // This solves a bug that we would otherwise see, where the cursor
        // position reports as wrong near the end of a line, when the wrapped
        // text would appear on the first line if the word was broken.
        if (clientRects[0]?.top && clientRects) {
            return {
                top: Math.round(clientRects[0].top - editorRect.top),
                left: Math.round(clientRects[0].left - editorRect.left),
                bottom: Math.round(editorRect.bottom - clientRects[0].bottom),
                right: Math.round(editorRect.right - clientRects[0].right),
            };
        }

        // Create a temporary span element to insert at the caret position
        const span = document.createElement("span");
        // Use a zero-width space to ensure it doesn't affect layout
        span.textContent = "\u200b";

        // Insert the span at the caret position
        range.insertNode(span);

        // Get the position of the span relative to the editor
        const spanRect = span.getBoundingClientRect();

        // Calculate the cursor's position relative to the editor
        const position = {
            top: Math.round(spanRect.top - editorRect.top),
            left: Math.round(spanRect.left - editorRect.left),
            bottom: Math.round(editorRect.bottom - spanRect.bottom),
            right: Math.round(editorRect.right - spanRect.right),
        };

        // Move the range to after the inserted span
        range.setStartAfter(span);
        range.collapse(true);

        // Clean up: remove the temporary span
        span.parentNode.removeChild(span);

        // Restore the selection to its original state
        selection.removeAllRanges();
        selection.addRange(range);

        return position;
    };

    const handleNewLine = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        const cursorNode = range.endContainer;
        const cursorOffset = range.endOffset;

        // Create a range that starts at the cursor position and goes to the end of the content
        const endRange = document.createRange();
        endRange.setStart(cursorNode, cursorOffset);
        endRange.setEnd(ref.current, ref.current.childNodes.length);

        // Check if cursor is inside a link. If so, don't do anything (can't
        // create a newline in the middle of a link).
        //
        // NOTE: This is commented out as it was stopping us from creating a
        // newline at the start or end of a link. Let's leave this out for now,
        // but if uncommenting, ensure we update it to check if we're actually
        // in the middle of a link or not.
        //
        // let cursorPositionInNode = range.endContainer;
        // let wrappingTag = "";
        // while (cursorPositionInNode && cursorPositionInNode !== ref.current) {
        //     if (cursorPositionInNode.nodeType === Node.ELEMENT_NODE) {
        //         wrappingTag = cursorPositionInNode.tagName;
        //         break;
        //     }
        //     cursorPositionInNode = cursorPositionInNode.parentNode;
        // }
        // if (wrappingTag.toLowerCase() === "a") {
        //     return;
        // }

        // Extract the HTML content within this range
        const fragment = endRange.cloneContents();
        const div = document.createElement("div");
        div.appendChild(fragment);
        const htmlAfterCursor = div.innerHTML;

        // Delete contents after the cursor
        endRange.deleteContents();

        onChange(ref.current.innerHTML);
        setTimeout(() => onNewLine(htmlAfterCursor), 0);
    };

    const handleRemoveCurrentLine = () => onRemoveLine(ref.current.innerHTML);

    const handleInput = event => {
        let value = event.target.innerHTML;
        if (value === "<br>") {
            value = "";
            ref.current.innerHTML = "";
        }
        onChange(value);
    };

    /**
     * Handles clicks within the contentEditable div.
     * If a link is clicked, it allows the default behavior to proceed.
     **/
    const handleLinkClick = event => {
        const target = event.target;
        if (target.tagName.toLowerCase() === "a") {
            window.open(target.href, "_blank");
        }
    };

    return {
        handleKeyDown,
        handleInput,
        handleLinkClick,
    };
};
