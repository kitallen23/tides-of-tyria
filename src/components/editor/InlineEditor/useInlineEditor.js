import { useEffect } from "react";

export const useInlineEditor = ({
    ref,
    defaultValue,
    onChange,
    onNewline,
    onRemoveLine,
}) => {
    useEffect(() => {
        // Set the initial content
        if (ref.current && defaultValue) {
            ref.current.innerHTML = defaultValue;
        }
    }, [defaultValue]); /* eslint-disable-line react-hooks/exhaustive-deps */

    const handleKeyDown = e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleNewLine();
        } else if (e.key === "Backspace") {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);

            // Check if the cursor is at the very start of the contentEditable
            // element
            if (range.collapsed) {
                // Ensure there is no text selected
                let currentNode = range.startContainer;
                let offset = range.startOffset;

                // Traverse up to the contentEditable element
                while (currentNode !== ref.current) {
                    // console.log(`currentNode, offset: `, currentNode, offset);
                    if (offset > 0) {
                        // If the offset is greater than 0, there's text to the
                        // left
                        return;
                    }
                    // Move to the parent node
                    offset = Array.prototype.indexOf.call(
                        currentNode.parentNode.childNodes,
                        currentNode
                    );
                    currentNode = currentNode.parentNode;
                }

                // If we reach here, the cursor is at the start of the content
                e.preventDefault();
                handleRemoveCurrentLine();
            }
        }
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
        // create a newline in the middle of a link)
        let cursorPositionInNode = range.endContainer;
        let wrappingTag = "";
        while (cursorPositionInNode && cursorPositionInNode !== ref.current) {
            if (cursorPositionInNode.nodeType === Node.ELEMENT_NODE) {
                wrappingTag = cursorPositionInNode.tagName;
                break;
            }
            cursorPositionInNode = cursorPositionInNode.parentNode;
        }
        if (wrappingTag.toLowerCase() === "a") {
            return;
        }

        // Extract the HTML content within this range
        const fragment = endRange.cloneContents();
        const div = document.createElement("div");
        div.appendChild(fragment);
        const htmlAfterCursor = div.innerHTML;

        // Delete contents after the cursor
        endRange.deleteContents();

        onChange(ref.current.innerHTML);
        setTimeout(() => onNewline(htmlAfterCursor), 0);
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

    return {
        handleKeyDown,
        handleInput,
    };
};
