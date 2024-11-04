import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { nanoid } from "nanoid";

// import { getLocalItem } from "@/utils/util";
// import { LOCAL_STORAGE_KEYS } from "@/utils/constants";

import { sanitizeRichText, setCursorAtOffset } from "./InlineEditor/utils";

const TEMP_VALUE = `[{"text":"Hello, <b>wo</b>","isComplete":false,"id":"Na6rkc","indentLevel":0},{"text":"<b>rld</b>","isComplete":false,"id":"Z9clUU","indentLevel":0},{"text":"<b></b>Test 3","isComplete":false,"id":"2HTcnd","indentLevel":0}]`;

const useEditorGroup = () => {
    const editorGroupRef = useRef(null);

    const [checklistItems, setChecklistItems] = useState(() => {
        // Load from local storage on initial render
        // const savedChecklist = getLocalItem(LOCAL_STORAGE_KEYS[key], "[]");
        // localStorage.setItem(LOCAL_STORAGE_KEYS[key], savedChecklist);

        const savedChecklist = TEMP_VALUE;
        try {
            const savedChecklistWithRefs = JSON.parse(savedChecklist).map(
                item => ({
                    ...item,
                    inputRef: createRef(),
                    renderKey: nanoid(4),
                })
            );
            return savedChecklistWithRefs;
        } catch {
            return [];
        }
    });

    const toolbarRef = useRef(null);
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({
        top: 0,
        left: 0,
    });
    const [textStates, setTextStates] = useState({
        isBold: false,
        isItalic: false,
        isUnderlined: false,
    });

    const linkEditorRef = useRef(null);
    const linkEditorUrlInputRef = useRef(null);
    const [showLinkEditor, setShowLinkEditor] = useState(false);
    const [linkEditorPosition, setLinkEditorPosition] = useState({
        top: 0,
        left: 0,
    });
    const [linkRange, setLinkRange] = useState();
    const [tempLinkText, setTempLinkText] = useState("");
    const [tempLinkUrl, setTempLinkUrl] = useState("");
    const isTempLinkUrlValid = useMemo(() => {
        try {
            let _tempLinkUrl = tempLinkUrl;
            // Check if the URL starts with http or https
            if (!/^https?:\/\//i.test(tempLinkUrl)) {
                // Prepend https:// if it doesn't start with http or https
                _tempLinkUrl = `https://${tempLinkUrl}`;
            }
            const url = new URL(_tempLinkUrl);

            // Check if the hostname contains a dot to ensure it's a valid domain
            const hostnameParts = url.hostname.split(".");
            const tld = hostnameParts[hostnameParts.length - 1];

            // Ensure the TLD is at least 2 characters long
            return hostnameParts.length > 1 && tld.length >= 2;
        } catch {
            return false;
        }
    }, [tempLinkUrl]);

    /**
     * Handles changes to a checklist item by updating its specified property.
     *
     * @param {Object} params - The parameters for the item change.
     * @param {string} params.key - The key of the property to update.
     * @param {*} params.value - The new value for the specified key.
     * @param {string} params.id - The identifier of the item to update.
     */
    const handleItemChange = ({ key, value, id }) =>
        setChecklistItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, [key]: value } : item
            )
        );

    /**
     * Handles the blur event to determine if the focus has moved outside
     * the editor group element, and hides the toolbar if so.
     *
     * @param {FocusEvent} event - The blur event object.
     */
    const handleBlur = event => {
        if (!editorGroupRef?.current.contains(event?.relatedTarget)) {
            setShowToolbar(false);
            handleCloseLinkEditor();
        }
    };

    /**
     * Adds a new checklist item.
     *
     * @param {Object} options - The options for adding the item.
     * @param {string} options.text - The text of the item.
     * @param {string} options.id - The unique identifier for the item.
     * @param {boolean} [options.focus=false] - If true, the new line will become focused.
     */
    const handleAddItem = ({ text = "", id = "", focus = false }) => {
        // TODO: Remove me
        console.info(`addItem: `, text, id, focus);

        setChecklistItems(items => {
            // Determine the index to insert the new item
            let index = -1;
            if (id) {
                index = items.findIndex(item => item.id === id);
            }
            if (index === -1) {
                index = items.length - 1;
            }

            const newItem = {
                text: sanitizeRichText(text),
                isComplete: false,
                id: nanoid(6),
                inputRef: createRef(),
                indentLevel: 0,
                renderKey: nanoid(4),
            };

            // Create a new array with the new item inserted at the correct position
            const newItems = items.toSpliced(index + 1, 0, newItem);
            if (focus) {
                setTimeout(() => newItem.inputRef.current?.focus(), 1);
            }

            return newItems;
        });
    };

    /**
     * Removes a line, and collapses its content into the previous line.
     *
     * @param {Object} params - The parameters for removing an item.
     * @param {string} params.text - The remaining text of the item that we're collapsing.
     * @param {string} params.id - The id of the item we're removing.
     */
    const handleRemoveItem = ({ text = "", id }) => {
        // TODO: Remove me
        console.info(`removeItem: `, id, text);

        const index = checklistItems.findIndex(item => item.id === id);

        if (index > 0) {
            const prevRef = checklistItems[index - 1]?.inputRef;
            if (prevRef?.current) {
                // Find the number of characters in the previous line's content
                const prevEditorTextContent = prevRef.current.textContent;
                const cursorOffset = prevEditorTextContent.length || 0;

                const newText = sanitizeRichText(
                    prevRef.current.innerHTML + text
                );
                // Append new text to the previous line
                prevRef.current.innerHTML = newText;
                // Restore the cursor position to the offset we found above
                setTimeout(() => setCursorAtOffset(prevRef, cursorOffset), 0);
            }

            // Only remove this line if index is greater than zero (don't remove
            // the first line)
            setChecklistItems(items => items.filter(item => item.id !== id));
        }
    };

    /**
     * Handles the selection event to position the toolbar
     * and update text style states (bold, italic, underlined)
     *
     * @param {Object} ref - The ref of the editor that triggered the selection event
     **/
    const handleSelect = () => {
        setTimeout(() => {
            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) {
                const range = selection.getRangeAt(0);

                // Use getClientRects to get the start position of the selection
                const clientRects = range.getClientRects();
                const startRect = clientRects[0];
                if (!startRect) {
                    return;
                }

                const editorGroupRect =
                    editorGroupRef.current.getBoundingClientRect();

                const relativeTop = startRect.top - editorGroupRect.top;
                const relativeLeft = startRect.left - editorGroupRect.left;

                // Perform a check to ensure our toolbar doesn't go off the side
                // of the editor (ensures it stay within bounds of the editor)
                const leftLimit =
                    editorGroupRect.right -
                    toolbarRef.current.offsetWidth -
                    editorGroupRect.left;

                let finalLeft = relativeLeft;
                if (finalLeft > leftLimit) {
                    finalLeft = leftLimit;
                }

                setToolbarPosition({
                    top: relativeTop - toolbarRef.current.offsetHeight,
                    left: finalLeft,
                });

                // Perform a check to ensure our toolbar doesn't go off the side
                // of the editor (ensures it stay within bounds of the editor)
                const linkToolbarLeftLimit =
                    editorGroupRect.right -
                    linkEditorRef.current.offsetWidth -
                    editorGroupRect.left;

                let finalLinkToolbarLeft = relativeLeft;
                if (finalLinkToolbarLeft > linkToolbarLeftLimit) {
                    finalLinkToolbarLeft = linkToolbarLeftLimit;
                }

                setLinkEditorPosition({
                    top: relativeTop,
                    left: finalLinkToolbarLeft,
                });
                updateTextStates(range);
                setShowToolbar(true);
            } else {
                setShowToolbar(false);
                handleCloseLinkEditor();
            }
        }, 0);
    };

    /**
     * Updates the state variables for bold, italic, and underlined text
     * based on the computed style of the parent node of the selected range.
     *
     * @param {Range} range - The range object representing the current selection.
     **/
    const updateTextStates = range => {
        const parentNode = range.commonAncestorContainer.parentNode;
        const computedStyle = window.getComputedStyle(parentNode);

        const isBold =
            computedStyle.fontWeight === "bold" ||
            computedStyle.fontWeight >= 700;
        const isItalic = computedStyle.fontStyle === "italic";

        // Only set isUnderlined if the parentNode is not an anchor element
        let isUnderlined = false;
        if (parentNode.tagName.toLowerCase() !== "a") {
            isUnderlined = computedStyle.textDecoration.includes("underline");
        } else {
            isUnderlined = false;
        }

        setTextStates({
            isBold,
            isItalic,
            isUnderlined,
        });
    };

    /**
     * Applies a given style (e.g., bold, italic, underline) to the selected text.
     *
     * @param {string} command - The style command to be applied to the selected text.
     */
    const handleApplyStyle = command => {
        // For now we must use execCommand here, as without it the setTextStates
        // function isn't able to correctly read the styles.
        document.execCommand(command, false, null);
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            updateTextStates(range);
        }
    };

    /**
     * Handles keydown events for the link input field.
     *
     * @param {KeyboardEvent} e - The keydown event object.
     */
    const handleLinkInputKeyDown = e => {
        if (e.key === "Escape") {
            handleCloseLinkEditor();
        } else if (e.key === "Enter") {
            handleApplyLink();
            e.preventDefault();
        }
    };

    /**
     * Applies the temporary link text to the current selected text
     **/
    const handleApplyLink = () => {
        if (tempLinkUrl && isTempLinkUrlValid && tempLinkText?.trim().length) {
            restoreSelection(linkRange);
            setTimeout(() => {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const commonAncestorContainer =
                        range.commonAncestorContainer;

                    // Find the closest anchor element
                    let anchorElement = null;

                    if (
                        commonAncestorContainer.nodeType === Node.ELEMENT_NODE
                    ) {
                        anchorElement = commonAncestorContainer.closest("a");
                    } else if (
                        commonAncestorContainer.nodeType === Node.TEXT_NODE
                    ) {
                        anchorElement =
                            commonAncestorContainer.parentElement.closest("a");
                    }

                    let _tempLinkUrl = tempLinkUrl;
                    if (!/^https?:\/\//i.test(tempLinkUrl)) {
                        _tempLinkUrl = `https://${tempLinkUrl}`;
                    }

                    if (
                        anchorElement &&
                        anchorElement.tagName.toLowerCase() === "a"
                    ) {
                        // Update the existing anchor's href and text
                        anchorElement.href = _tempLinkUrl;
                        anchorElement.textContent = tempLinkText.toString();
                    } else {
                        // Create a new anchor element
                        const newAnchor = document.createElement("a");
                        newAnchor.href = _tempLinkUrl;
                        newAnchor.textContent = tempLinkText.toString();
                        newAnchor.target = "_blank";
                        newAnchor.rel = "noopener noreferrer";

                        // Replace the current selection with the new anchor
                        range.deleteContents();
                        range.insertNode(newAnchor);

                        // Adjust the selection to the new anchor
                        selection.removeAllRanges();
                        const newRange = document.createRange();
                        newRange.selectNode(newAnchor);
                        selection.addRange(newRange);
                    }

                    handleCloseLinkEditor();
                }
            }, 0);
        }
    };

    /**
     * Saves the current text selection range.
     * @returns {Range | null} The current selection range, or null if there is no selection.
     **/
    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            return range;
        }
        return null;
    };

    /**
     * Restores the saved text selection range.
     * @param {Range} range - The range to be restored.
     **/
    const restoreSelection = range => {
        if (range) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    const handleOpenLinkEditor = () => {
        if (!showLinkEditor) {
            // If selection is a subset of a link, expand it to include the
            // whole link
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            // Check if the selection is within an anchor tag
            const commonAncestorContainer = range.commonAncestorContainer;
            let anchorElement = null;
            if (commonAncestorContainer.nodeType === Node.ELEMENT_NODE) {
                anchorElement = commonAncestorContainer.closest("a");
            } else if (commonAncestorContainer.nodeType === Node.TEXT_NODE) {
                anchorElement =
                    commonAncestorContainer.parentElement.closest("a");
            }
            let href = null;
            if (anchorElement && anchorElement.tagName.toLowerCase() === "a") {
                href = anchorElement.href;

                // Create a new range that selects the entire anchor element
                const newRange = document.createRange();
                newRange.selectNodeContents(anchorElement);

                // Clear the current selection and add the new range
                selection.removeAllRanges();
                selection.addRange(newRange);
                handleSelect();
            }

            const savedRange = saveSelection();
            setLinkRange(savedRange);
            setTempLinkText(savedRange.toString());
            setTempLinkUrl(href || "");
            setShowLinkEditor(true);

            // Focus the link input
            setTimeout(() => {
                linkEditorUrlInputRef.current.focus();
            }, 0);
        } else {
            handleCloseLinkEditor();
        }
    };

    /**
     * Closes the link editor and resets temporary link data.
     */
    const handleCloseLinkEditor = () => {
        setShowLinkEditor(false);
        setTempLinkUrl("");
        setTempLinkText("");
    };

    // If there are no checklist items, add a blank line (ensures there's always
    // an input field)
    const hasAddedInitialItem = useRef(false);
    useEffect(() => {
        if (!checklistItems.length && !hasAddedInitialItem.current) {
            handleAddItem({});
            hasAddedInitialItem.current = true;
        }
    }, [checklistItems]);

    return {
        editorGroupRef,
        checklistItems,
        handleSelect,
        handleBlur,
        handleItemChange,
        handleAddItem,
        handleRemoveItem,
        handleApplyStyle,

        toolbarRef,
        showToolbar,
        toolbarPosition,
        textStates,
        handleOpenLinkEditor,

        linkEditorRef,
        linkEditorUrlInputRef,
        showLinkEditor,
        linkEditorPosition,
        tempLinkText,
        tempLinkUrl,
        isTempLinkUrlValid,
        handleTempLinkTextChange: setTempLinkText,
        handleTempLinkUrlChange: setTempLinkUrl,
        handleLinkInputKeyDown,
        handleApplyLink,
    };
};

export default useEditorGroup;
