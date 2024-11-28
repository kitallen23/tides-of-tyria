import {
    createRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { nanoid } from "nanoid";
import { toast } from "react-hot-toast";

import { copyToClipboard } from "@/utils/util";
import inlineEditorStyles from "./InlineEditor/inline-editor.module.scss";
import {
    getDecodedLengthWithBr,
    getMinAndMax,
    moveCursorToCharacterOffsetOfEditor,
    moveCursorToEditor,
    moveCursorToFirstLineOfEditor,
    moveCursorToLastLineOfEditor,
    sanitizeRichText,
} from "./utils";

const LINK_HOVER_DELAY = 500;
const MAX_INDENT = 3;
export const SELECTION_MENU_WIDTH = 300;

const useChecklistGroup = ({ checklistItems, setChecklistItems }) => {
    const checklistGroupRef = useRef(null);

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

    const linkHoverRef = useRef(null);
    const [showLinkHover, setShowLinkHover] = useState(false);
    const [linkHoverPosition, setLinkHoverPosition] = useState({
        top: 0,
        left: 0,
    });
    const [hoveredLink, setHoveredLink] = useState(null);
    const hoveredLinkTimeoutRef = useRef(null);

    // Holds a duplicate of hoveredLink to allow the UI to persist the hovered
    // link for a short time after the hovered link is cleared
    const [lastHoveredLink, setLastHoveredLink] = useState(null);
    useEffect(() => {
        if (hoveredLink?.href) {
            setLastHoveredLink(hoveredLink);
        }
    }, [hoveredLink]);

    const selectionMenuRef = useRef(null);
    const [isSelectionMenuOpen, setIsSelectionMenuOpen] = useState(false);
    const [selectionMenuPosition, setSelectionMenuPosition] = useState({
        top: 0,
        left: 0,
    });
    /**
     * An object containing:
     * - start: the index of the item that was first selected by the user
     * - end: the index of the item that was last selected by the user
     *
     * Note that start and end can be the same index.
     *
     * Example: if user clicks index 3 to select it, then shift-clicks index 7,
     * the values would be: `{ start: 3, end: 7 }`.
     * If the user then shift-clicks on index 0, the values would be:
     * `{ start: 3, end: 0 }`.
     *
     * This allows us to keep a history of which element was the first one that
     * the user selected.
     */
    const [selectedItemIndices, setSelectedItemIndices] = useState(undefined);
    const [selectedBorderBoxPosition, setSelectedBorderBoxPosition] =
        useState(undefined);
    const [showSelectedBorderBox, setShowSelectedBorderBox] = useState(false);

    /**
     * Handles changes to a checklist item by updating its specified property.
     *
     * @param {Object} params - The parameters for the item change.
     * @param {string} params.key - The key of the property to update.
     * @param {*} params.value - The new value for the specified key.
     * @param {string} params.id - The identifier of the item to update.
     */
    const handleItemChange = ({ key, value, id }) => {
        // TODO: Remove me
        // console.info(`itemChange: `, id, key, value);

        setChecklistItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    if (key === "isComplete") {
                        return {
                            ...item,
                            [key]: value,
                            lastCompletion: value
                                ? new Date().toISOString()
                                : undefined,
                        };
                    } else {
                        return { ...item, [key]: value };
                    }
                } else {
                    return item;
                }
            })
        );
    };

    /**
     * Handles the blur event to determine if the focus has moved outside
     * the editor group element, and hides the toolbar if so.
     *
     * @param {FocusEvent} event - The blur event object.
     */
    const handleBlur = event => {
        if (!checklistGroupRef?.current.contains(event?.relatedTarget)) {
            setShowToolbar(false);
            handleCloseLinkEditor();
        }
    };

    /**
     * Adds a new checklist item.
     *
     * @param {Object} options - The options for adding the item.
     * @param {string} options.text - The text to initialise the item with.
     * @param {string} options.id - The unique identifier of the current line (the new line will be added below this item).
     * @param {boolean} [options.focus=false] - If true, the new line will become focused.
     */
    const handleAddItem = useCallback(
        ({ text = "", id = "", focus = false, insertAbove = false }) => {
            // TODO: Remove me
            // console.info(`addItem: `, id, text, focus);

            setChecklistItems(items => {
                // Determine the index to insert the new item
                let index = -1;
                if (id) {
                    index = items.findIndex(item => item.id === id);
                }
                if (index === -1) {
                    index = items.length - 1;
                }

                // Place the new item on the same indent level as the previous item
                const newIndentLevel = items[index]?.indentLevel || 0;

                const newItem = {
                    text: sanitizeRichText(text),
                    isComplete: false,
                    id: nanoid(6),
                    inputRef: createRef(),
                    indentLevel: newIndentLevel,
                };

                // Create a new array with the new item inserted at the correct position
                const newItems = items.toSpliced(
                    insertAbove ? index : index + 1,
                    0,
                    newItem
                );

                if (focus) {
                    setTimeout(() => newItem.inputRef.current?.focus(), 0);
                }

                return newItems;
            });
        },
        [setChecklistItems]
    );

    /**
     * Removes a line, and collapses its content into the previous line.
     *
     * @param {Object} params - The parameters for removing an item.
     * @param {string} params.text - The remaining text of the item that we're collapsing.
     * @param {string} params.id - The id of the item we're removing.
     * @param {boolean} [params.force=false] - A flag indicating whether to forcefully remove the item
     *                                         even if it's the last remaining item.*
     */
    const handleRemoveItem = ({ text = "", id, force = false }) => {
        // TODO: Remove me
        // console.info(`removeItem: `, id, text, force);

        // Don't allow the last item to be removed from the array, unless the force flag is passed
        if (checklistItems.length === 1 && !force) {
            return;
        }

        const index = checklistItems.findIndex(item => item.id === id);

        if (index >= 0) {
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
                setTimeout(
                    () =>
                        moveCursorToCharacterOffsetOfEditor(
                            prevRef,
                            cursorOffset
                        ),
                    0
                );
            }

            // Only remove this line if index is greater than zero (don't remove
            // the first line)
            setChecklistItems(items => items.filter(item => item.id !== id));
        }
    };

    /**
     * Handles the blur event for a checklist item by performing validation and potentially removing the item.
     *
     * This function checks if there is exactly one item in the `checklistItems` array and whether the
     * blurred item's ID matches the current item's ID. It then verifies if the content within the
     * associated editor is empty (considering `<br>` tags). If the content is empty, the item is removed.
     *
     * @param {Object} event - The blur event object containing details about the event.
     * @param {number|string} event.id - The unique identifier of the checklist item that triggered the blur event.
     */
    const handleBlurItem = ({ id }) => {
        // Perform some initial logic checks and return early if we shouldn't be
        // removing an item
        if (checklistItems.length !== 1) {
            return;
        }

        const [currentItem] = checklistItems;
        if (currentItem.id !== id) {
            return;
        }
        const editor = currentItem.inputRef?.current;
        if (!editor) {
            return;
        }

        // Calculate the decoded length of the editor's inner HTML, considering
        // <br> tags
        const contentLength = getDecodedLengthWithBr(editor.innerHTML);

        // If there is no content, remove the item
        if (contentLength === 0 || editor.innerHTML === "<br>") {
            handleRemoveItem({ id, force: true });
        }
    };

    /**
     * Handles focusing the next editor in a checklist.
     *
     * This function finds the current item by its `id` in the `checklistItems` array.
     * If there is a next item, it moves the cursor to the first line of the next item's editor.
     * If there is no next item, it moves the cursor to the end of the current editor,
     * possibly indicating the need to add a new item.
     *
     * @param {Object} params - The parameters for the function.
     * @param {string} params.id - The ID of the current checklist item.
     * @param {number} params.left - The left position to move the cursor to.
     *
     * @throws {Error} If the `checklistItems` array is not defined or empty.
     */

    const handleFocusNextEditor = ({ id, left }) => {
        // TODO: Remove me
        // console.info(`focusNextEditor: `, id, left);
        const index = checklistItems.findIndex(item => item.id === id);

        if (index >= 0) {
            const nextRef = checklistItems[index + 1]?.inputRef;
            if (nextRef?.current) {
                if (left === Infinity) {
                    moveCursorToEditor(nextRef, "end");
                } else if (left === -Infinity) {
                    moveCursorToEditor(nextRef, "start");
                } else {
                    moveCursorToFirstLineOfEditor(nextRef, left);
                }
            } else {
                // No next editor, so move cursor to end of current editor
                const currentRef = checklistItems[index]?.inputRef;
                moveCursorToEditor(currentRef, "end");
            }
        }
    };

    /**
     * Handles focusing the previous editor in a checklist.
     *
     * This function finds the current item by its `id` in the `checklistItems` array.
     * If the current item is not the first one, it moves the cursor to the previous item's editor.
     * If the current item is the first one, it moves the cursor to the start of the first editor.
     *
     * @param {Object} params - The parameters for the function.
     * @param {string} params.id - The ID of the current checklist item.
     * @param {number} params.left - The left position to move the cursor to.
     *
     * @throws {Error} If the `checklistItems` array is not defined or empty.
     */
    const handleFocusPreviousEditor = ({ id, left }) => {
        // TODO: Remove me
        // console.info(`focusPreviousEditor: `, id, left);
        const index = checklistItems.findIndex(item => item.id === id);

        if (index > 0) {
            const prevRef = checklistItems[index - 1]?.inputRef;
            if (left === Infinity) {
                moveCursorToEditor(prevRef, "end");
            } else if (left === -Infinity) {
                moveCursorToEditor(prevRef, "start");
            } else {
                moveCursorToLastLineOfEditor(prevRef, left);
            }
        } else {
            // Index is zero, so go to start of the first editor
            const firstRef = checklistItems[0]?.inputRef;
            moveCursorToEditor(firstRef, "start");
        }
    };

    /**
     * Adjusts the indent level of a checklist item based on the specified direction.
     *
     * @param {Object} params - The parameters for indenting an item.
     * @param {string|number} params.id - The identifier of the item to indent.
     * @param {boolean} params.indent - A flag indicating whether to increase (true) or decrease (false) the indent level.
     */
    const handleIndentItem = ({ id, indent }) => {
        // TODO: Remove me
        // console.info(`indentItem: `, id, indent);
        const item = checklistItems.find(item => item.id === id);

        if (item) {
            const newIndentLevel = item.indentLevel + (indent ? 1 : -1);

            // Only set a new indent level if it's within the indent bounds
            if (newIndentLevel >= 0 && newIndentLevel <= MAX_INDENT) {
                setChecklistItems(prevItems =>
                    prevItems.map(item =>
                        item.id === id
                            ? { ...item, indentLevel: newIndentLevel }
                            : item
                    )
                );
            }
        }
    };

    /**
     * Handles the selection event to position the toolbar
     * and update text style states (bold, italic, underlined)
     *
     * @param {Object} ref - The ref of the editor that triggered the selection event
     */
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

                const checklistGroupRect =
                    checklistGroupRef.current.getBoundingClientRect();

                const relativeTop = startRect.top - checklistGroupRect.top;
                const relativeLeft = startRect.left - checklistGroupRect.left;

                // Perform a check to ensure our toolbar doesn't go off the side
                // of the editor (ensures it stay within bounds of the editor)
                const leftLimit =
                    checklistGroupRect.right -
                    toolbarRef.current.offsetWidth -
                    checklistGroupRect.left;

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
                    checklistGroupRect.right -
                    linkEditorRef.current.offsetWidth -
                    checklistGroupRect.left;

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
                setHoveredLink(null);
                handleCloseLinkEditor();
            }
        }, 0);
    };

    /**
     * Updates the state variables for bold, italic, and underlined text
     * based on the computed style of the parent node of the selected range.
     *
     * @param {Range} range - The range object representing the current selection.
     */
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
     */
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

                    const focusedElement = document.activeElement;
                    const ancestorWithClass = focusedElement?.closest(
                        `.${inlineEditorStyles.inlineEditor}`
                    );

                    if (ancestorWithClass) {
                        const id = ancestorWithClass.id;
                        handleItemChange({ id, key: "text" });
                    }
                }
            }, 0);
        }
    };

    /**
     * Saves the current text selection range.
     * @returns {Range | null} The current selection range, or null if there is no selection.
     */
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

    const handleMouseEnter = event => {
        const anchorElement =
            event.target.tagName.toLowerCase() === "a"
                ? event.target
                : event.target.closest("a");
        const editorElement = event.target.closest(
            `.${inlineEditorStyles.inlineEditor}`
        );

        if (anchorElement && editorElement) {
            // Clear any existing timeout to prevent setting state for a previous link
            clearTimeout(hoveredLinkTimeoutRef.current);

            // Set a timeout to update the hovered link state after the delay
            hoveredLinkTimeoutRef.current = setTimeout(() => {
                setHoveredLink(anchorElement);
            }, LINK_HOVER_DELAY);
        }
    };

    const handleMouseLeave = event => {
        const anchorElement =
            event.target.tagName.toLowerCase() === "a"
                ? event.target
                : event.target.closest("a");
        const editorElement = event.target.closest(
            `.${inlineEditorStyles.inlineEditor}`
        );

        if (anchorElement && editorElement) {
            // Clear the timeout if the mouse leaves the anchor before the delay
            clearTimeout(hoveredLinkTimeoutRef.current);

            if (
                linkHoverRef.current &&
                !linkHoverRef.current.contains(event.relatedTarget)
            ) {
                setHoveredLink(null); // Reset the hovered link state only if not entering the tooltip
            }
        }
    };
    const handleLinkTooltipMouseEnter = () => {
        // Clear any timeout and keep the tooltip open
        clearTimeout(hoveredLinkTimeoutRef.current);
    };

    const handleLinkTooltipMouseLeave = event => {
        // Close the tooltip when the mouse leaves the tooltip area
        if (
            linkHoverRef.current &&
            !linkHoverRef.current.contains(event.relatedTarget)
        ) {
            setHoveredLink(null); // Reset the hovered link state only if not entering the tooltip
        }
    };

    useEffect(() => {
        if (hoveredLink) {
            const editorRect =
                checklistGroupRef.current.getBoundingClientRect();
            const elementBox = hoveredLink.getBoundingClientRect();
            if (!elementBox) {
                return;
            }

            const relativeTop = elementBox.bottom - editorRect.top;
            const relativeLeft = elementBox.left - editorRect.left;

            const leftLimit =
                editorRect.right -
                linkHoverRef.current.offsetWidth -
                editorRect.left;

            let finalLeft = relativeLeft;
            if (finalLeft > leftLimit) {
                finalLeft = leftLimit;
            }

            setLinkHoverPosition({
                top: relativeTop,
                left: finalLeft,
            });

            setShowLinkHover(true);
        } else {
            setShowLinkHover(false);
        }
    }, [hoveredLink]);

    const handleCopyLinkToClipboardClick = () => {
        if (hoveredLink) {
            copyToClipboard(hoveredLink.href, {
                onSuccess: () => toast.success("Link copied to clipboard."),
                onError: () =>
                    toast.error(
                        "Something went wrong when copying to clipboard."
                    ),
            });

            setHoveredLink(null);
        }
    };
    const handleLinkEditClick = () => {
        if (hoveredLink) {
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(hoveredLink);
            selection.removeAllRanges();
            selection.addRange(range);

            handleOpenLinkEditor();
            setHoveredLink(null);
        }
    };
    const handleLinkRemoveClick = () => {
        if (hoveredLink) {
            // Get a handle on the parent editor so we can update its value
            const parentEditor = hoveredLink?.closest(
                `.${inlineEditorStyles.inlineEditor}`
            );

            // Get the parent node of the hovered link
            const parent = hoveredLink.parentNode;

            // Move all children out of the hovered link
            while (hoveredLink.firstChild) {
                parent.insertBefore(hoveredLink.firstChild, hoveredLink);
            }

            // Remove the hovered link element
            parent.removeChild(hoveredLink);

            setHoveredLink(null);

            if (parentEditor) {
                const id = parentEditor.id;
                handleItemChange({ id, key: "text" });
            }
        }
    };

    const activateSelectedBorderBox = () => {
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
        }
        if (document.activeElement) {
            document.activeElement.blur();
        }
        setShowToolbar(false);
        setTimeout(() => {
            setShowSelectedBorderBox(true);
            setIsSelectionMenuOpen(true);
        }, 0);
    };

    const deactivateSelectedBorderBox = () => {
        setShowSelectedBorderBox(false);
        setIsSelectionMenuOpen(false);
        setSelectedItemIndices(undefined);
    };

    /**
     * Handles the selection of a checklist item, supporting single and range selections.
     *
     * This function manages the selection state of checklist items based on user interactions.
     * When a user selects an item:
     * - If the Shift key is held and there are already selected items, it selects a range from the
     *   first selected item to the currently selected item.
     * - If the Shift key is not held, it selects only the currently clicked item and its children.
     *
     * @param {React.MouseEvent} event - The mouse event triggered by the user's interaction.
     * @param {string|number} id - The unique identifier of the checklist item being selected.
     */
    const handleSelectItem = (event, id) => {
        // Find the index of the item with the given id in the checklistItems array
        const itemIndex = checklistItems.findIndex(item => item.id === id);
        const { start, end } = getIndexRangeOfItemWithChildren(itemIndex);

        if (itemIndex >= 0) {
            if (
                event.pointerType === "touch" &&
                selectedItemIndices?.start === start &&
                selectedItemIndices?.end === end
            ) {
                // If the touched item is already highlighted, deselect it
                // (turns it into a toggle on touch devices)
                deactivateSelectedBorderBox();
            } else {
                // Update the selected item indices based on the user's selection
                setSelectedItemIndices(currentSelectedItems => {
                    if (event.shiftKey && currentSelectedItems) {
                        // If the Shift key is pressed and there are currently
                        // selected items, extend the selection from the existing
                        // start to the new end
                        return {
                            start: currentSelectedItems.start,
                            end: itemIndex,
                        };
                    } else {
                        // If the Shift key is not pressed, set the selection to the
                        // current item's range
                        if (
                            event.pointerType === "touch" &&
                            currentSelectedItems?.start === start &&
                            currentSelectedItems?.end === end
                        ) {
                            return undefined;
                        } else {
                            return { start, end };
                        }
                    }
                });
                activateSelectedBorderBox();
            }
        }
    };

    /**
     * Retrieves the index range of a checklist item along with all its child items based on indentation levels.
     *
     * This function identifies the range of items that are considered children of a specified checklist item.
     * It starts from the item immediately after the given index and continues until it encounters an item
     * with an indentation level less than or equal to the current item's indentation level.
     *
     * @param {number} index - The zero-based index of the checklist item for which to find the range of child items.
     * @returns {{ start: number, end: number }} An object containing the `start` and `end` indices defining the range of child items.
     */
    const getIndexRangeOfItemWithChildren = index => {
        const currentIndentLevel = checklistItems[index].indentLevel;

        let end = index + 1;
        while ((checklistItems[end]?.indentLevel ?? -1) > currentIndentLevel) {
            end++;
        }

        return { start: index, end: end - 1 };
    };

    const [borderBoxRecalculationKey, setBorderBoxRecalculationKey] =
        useState(0);
    useEffect(() => {
        const calculateSelectedBorderBox = ({ start, end }) => {
            const { min, max } = getMinAndMax([start, end]);

            const checklistItemBoxes = [];
            for (let i = min; i <= max; ++i) {
                const editor = checklistItems[i].inputRef?.current;
                const checklistItem = editor.closest(".checklist-item");
                checklistItemBoxes.push(checklistItem.getBoundingClientRect());
            }

            const checklistGroupBox =
                checklistGroupRef.current.getBoundingClientRect();

            // Calculate the top position of the bounding box
            const relativeTop =
                checklistItemBoxes[0].top - checklistGroupBox.top;

            // Calculate the left position of the bounding box
            const minX = Math.min(...checklistItemBoxes.map(rect => rect.x));
            const relativeLeft = minX - checklistGroupBox.left;

            // Calculate the bottom position of the bounding box
            const relativeBottom =
                checklistGroupBox.bottom -
                checklistItemBoxes[checklistItemBoxes.length - 1].bottom;

            return {
                top: relativeTop,
                left: relativeLeft,
                bottom: relativeBottom,
                right: 0,
            };
        };

        const calculateSelectionMenuPosition = ({ start, end }) => {
            const { min, max } = getMinAndMax([start, end]);

            const firstChecklistEditor = checklistItems[min].inputRef?.current;
            const firstChecklistItem =
                firstChecklistEditor.closest(".checklist-item");
            const firstChecklistItemBox =
                firstChecklistItem.getBoundingClientRect();
            const firstChecklistItemHoverAreaBox = firstChecklistEditor
                .closest(".checklist-item-hover-area")
                .getBoundingClientRect();

            const GAP = 2;
            // TODO: Replace this with a calculation
            const PROGRESS_BAR_WIDTH = 4;

            const checklistGroupBox =
                checklistGroupRef.current.getBoundingClientRect();

            let hasEnoughClearance =
                firstChecklistItemHoverAreaBox.left >=
                SELECTION_MENU_WIDTH + PROGRESS_BAR_WIDTH + 2 * GAP;

            let style = {
                top: 0,
                left: 0,
            };

            if (hasEnoughClearance) {
                // Menu has enough clearance to the left of the checklist, so
                // place it floating out to the left.

                // Calculate the top position of the menu
                const relativeTop =
                    firstChecklistItemBox.top - checklistGroupBox.top;

                // Calculate the left position of the menu.
                // The menu will be a little bit left (gap) of the hover box of
                // any checklist item.
                const relativeLeft =
                    firstChecklistItemHoverAreaBox.left -
                    checklistGroupBox.left -
                    SELECTION_MENU_WIDTH -
                    GAP;

                style = {
                    top: relativeTop,
                    left: relativeLeft,
                };
            } else {
                // Place on right of the checkboxes, as there isn't enough space
                // to the left of the checklist.

                const editorBoxes = [];
                for (let i = min; i <= max; ++i) {
                    const editor = checklistItems[i].inputRef?.current;
                    editorBoxes.push(editor.getBoundingClientRect());
                }
                const maxEditorX = Math.max(...editorBoxes.map(rect => rect.x));

                // Calculate the top position of the menu
                const relativeTop =
                    firstChecklistItemBox.top - checklistGroupBox.top + GAP;

                // Calculate the left position of the menu.
                // This will be the maximum "x" (left) value of any of the
                // selected editors. We use this value so the menu won't cover
                // any checkboxes.
                const relativeLeft = maxEditorX - checklistGroupBox.left;

                style = {
                    top: relativeTop,
                    left: relativeLeft,
                };
            }

            /**
             * Ensure the menu doesn't go off the bottom of the screen
             */
            // Find the height of the menu
            const menuBox = selectionMenuRef.current?.getBoundingClientRect();

            // Bottom of page relative to the entire document
            const viewportBottom = window.scrollY + window.innerHeight;

            // Top of the menu relative to the scrolled viewport
            const menuYRelativeToViewport =
                checklistGroupBox.top + style.top + window.scrollY;
            const menuBottom = menuYRelativeToViewport + menuBox.height;

            // If the bottom of the menu is below the bottom of the visible
            // portion of the screen, place it against the bottom of the screen.
            if (menuBottom + GAP > viewportBottom) {
                style.top -= menuBottom - viewportBottom + GAP;
            }

            return style;
        };

        if (selectedItemIndices) {
            const selectedBorderBoxPosition =
                calculateSelectedBorderBox(selectedItemIndices);
            setSelectedBorderBoxPosition(selectedBorderBoxPosition);

            const selectionMenuPosition =
                calculateSelectionMenuPosition(selectedItemIndices);
            setSelectionMenuPosition(selectionMenuPosition);
        }

        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [selectedItemIndices, borderBoxRecalculationKey]);

    useEffect(() => {
        const handleClick = event => {
            const isWithinGroup = checklistGroupRef.current?.contains(
                event.target
            );

            // Handle shift-click selection
            if (event.shiftKey && isWithinGroup) {
                const activeEditor = selectedItemIndices?.start
                    ? checklistItems[selectedItemIndices.start].inputRef
                          ?.current
                    : document.activeElement?.closest(".inline-editor");
                const targetEditor = event.target.closest(".inline-editor");

                if (
                    activeEditor &&
                    targetEditor &&
                    activeEditor.id !== targetEditor.id
                ) {
                    const activeEditorIndex = checklistItems.findIndex(
                        item => item.id === activeEditor.id
                    );
                    const targetEditorIndex = checklistItems.findIndex(
                        item => item.id === targetEditor.id
                    );

                    if (activeEditorIndex !== -1 && targetEditorIndex !== -1) {
                        setSelectedItemIndices({
                            start: activeEditorIndex,
                            end: targetEditorIndex,
                        });
                        activateSelectedBorderBox();
                        return;
                    }
                }
            }

            const isItemMenuIndicator = event.target.closest(
                ".item-menu-indicator"
            );
            const isMenu = selectionMenuRef.current?.contains(event.target);

            // Handle deselection
            if ((!isItemMenuIndicator && !isMenu) || !isWithinGroup) {
                deactivateSelectedBorderBox();
            }
        };

        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, [checklistItems, selectedItemIndices]);

    /**
     * Handles the mouse down event on the editor. If the Shift key is pressed and the click
     * occurs between different inline editors, it prevents text highlighting.
     *
     * @param {MouseEvent} event - The mouse down event object.
     */
    const handleEditorMouseDown = event => {
        if (event.shiftKey) {
            // Get the current and target editors of the click event
            const currentEditor =
                document.activeElement?.closest(".inline-editor");
            const targetEditor = event.target?.closest(".inline-editor");

            // Get the checklist group "parents" of the editors above. These
            // will be used to determine if the click event is between editors
            // of the same editor group.
            const currentEditorGroup =
                currentEditor?.closest(".checklist-group");
            const targetEditorGroup = targetEditor?.closest(".checklist-group");

            // If we have shift-clicked between this editor and another (in the
            // same checklist group), don't highlight any text
            if (
                currentEditor &&
                targetEditor &&
                currentEditor.id !== targetEditor.id &&
                currentEditorGroup === targetEditorGroup
            ) {
                event.preventDefault();
            }
        }
    };

    /**
     * Handles the click event to add a line above the currently selected item in the checklist.
     * If there are selected items, it determines the minimum index and inserts a new item above it,
     * then deactivates the selection border.
     */
    const handleMenuAddLineAboveClick = () => {
        if (!selectedItemIndices) {
            return;
        }
        const { min } = getMinAndMax([
            selectedItemIndices.start,
            selectedItemIndices.end,
        ]);

        const itemAtIndex = checklistItems[min];
        handleAddItem({ id: itemAtIndex.id, insertAbove: true, focus: true });
        deactivateSelectedBorderBox();
    };

    /**
     * Handles the click event to add a line below the currently selected item in the checklist.
     * If there are selected items, it determines the maximum index and inserts a new item below it,
     * then deactivates the selection border.
     */
    const handleMenuAddLineBelowClick = () => {
        if (!selectedItemIndices) {
            return;
        }
        const { max } = getMinAndMax([
            selectedItemIndices.start,
            selectedItemIndices.end,
        ]);

        const itemAtIndex = checklistItems[max];
        handleAddItem({ id: itemAtIndex.id, insertAbove: false, focus: true });
        deactivateSelectedBorderBox();
    };

    /**
     * Handles the click event to mark the selected items in the checklist as complete.
     * If there are selected items, it determines the minimum and maximum indices and updates
     * the checklist items within that range to be marked as complete.
     */
    const handleMenuMarkAsComplete = () => {
        if (!selectedItemIndices) {
            return;
        }
        const { min, max } = getMinAndMax([
            selectedItemIndices.start,
            selectedItemIndices.end,
        ]);

        setChecklistItems(prevItems => {
            const newItems = prevItems.map((item, i) => {
                if (i >= min && i <= max) {
                    return {
                        ...item,
                        isComplete: true,
                    };
                }
                return item;
            });
            return newItems;
        });
        deactivateSelectedBorderBox();
    };

    /**
     * Handles the click event to mark the selected items in the checklist as incomplete.
     * If there are selected items, it determines the minimum and maximum indices and updates
     * the checklist items within that range to be marked as incomplete.
     */
    const handleMenuMarkAsIncomplete = () => {
        if (!selectedItemIndices) {
            return;
        }
        const { min, max } = getMinAndMax([
            selectedItemIndices.start,
            selectedItemIndices.end,
        ]);

        setChecklistItems(prevItems => {
            const newItems = prevItems.map((item, i) => {
                if (i >= min && i <= max) {
                    return {
                        ...item,
                        isComplete: false,
                    };
                }
                return item;
            });
            return newItems;
        });
        deactivateSelectedBorderBox();
    };

    /**
     * Handles the click event to increase the indentation level of the selected items in the checklist.
     * If there are selected items, it determines the minimum and maximum indices and updates
     * the indentation level of each item within that range, ensuring it does not exceed the maximum indent level.
     * Also triggers a recalculation of the selected item border box position.
     */
    const handleMenuIncreaseIndent = useCallback(() => {
        if (!selectedItemIndices) {
            return;
        }
        const { min, max } = getMinAndMax([
            selectedItemIndices.start,
            selectedItemIndices.end,
        ]);

        setChecklistItems(prevItems => {
            const newItems = prevItems.map((item, i) => {
                if (i >= min && i <= max) {
                    return {
                        ...item,
                        indentLevel: Math.min(item.indentLevel + 1, MAX_INDENT),
                    };
                }
                return item;
            });
            return newItems;
        });
        setBorderBoxRecalculationKey(x => x + 1);
    }, [selectedItemIndices, setChecklistItems]);

    /**
     * Handles the click event to decrease the indentation level of the selected items in the checklist.
     * If there are selected items, it determines the minimum and maximum indices and updates
     * the indentation level of each item within that range, ensuring it does not go below zero.
     * Also triggers a recalculation of the selected item border box position.
     */
    const handleMenuDecreaseIndent = useCallback(() => {
        if (!selectedItemIndices) {
            return;
        }
        const { min, max } = getMinAndMax([
            selectedItemIndices.start,
            selectedItemIndices.end,
        ]);

        setChecklistItems(prevItems => {
            const newItems = prevItems.map((item, i) => {
                if (i >= min && i <= max) {
                    return {
                        ...item,
                        indentLevel: Math.max(item.indentLevel - 1, 0),
                    };
                }
                return item;
            });
            return newItems;
        });
        setBorderBoxRecalculationKey(x => x + 1);
    }, [selectedItemIndices, setChecklistItems]);

    /**
     * Handles the click event to duplicate the selected items in the checklist.
     * If there are selected items, it determines the minimum and maximum indices,
     * creates duplicates of each item within that range with new unique IDs and input references,
     * inserts the duplicated items immediately after the original selection,
     * updates the checklist items state, and deactivates the selection border.
     */
    const handleMenuDuplicateItems = () => {
        if (!selectedItemIndices) {
            return;
        }
        const { min, max } = getMinAndMax([
            selectedItemIndices.start,
            selectedItemIndices.end,
        ]);

        const newItems = checklistItems
            .slice(min, max + 1)
            .map(item => ({ ...item, id: nanoid(6), inputRef: createRef() }));
        const newChecklistItems = checklistItems.toSpliced(
            max + 1,
            0,
            ...newItems
        );
        setChecklistItems(newChecklistItems);
        deactivateSelectedBorderBox();
    };

    /**
     * Handles the click event to delete the selected items from the checklist.
     * If there are selected items, it determines the minimum and maximum indices,
     * removes the items within that range from the checklist, updates the checklist items state,
     * and deactivates the selection border.
     */
    const handleMenuDeleteItems = useCallback(() => {
        if (!selectedItemIndices) {
            return;
        }
        const { min, max } = getMinAndMax([
            selectedItemIndices.start,
            selectedItemIndices.end,
        ]);

        setChecklistItems(prevItems => {
            const newItems = prevItems.filter((_, i) => {
                if (i >= min && i <= max) {
                    return false;
                }
                return true;
            });
            return newItems;
        });
        deactivateSelectedBorderBox();
    }, [selectedItemIndices, setChecklistItems]);

    useEffect(() => {
        const handleKeyDown = event => {
            // Return early if we don't even have a selection active
            if (!showSelectedBorderBox) {
                return;
            }

            // On press of escape, close the window or deactivate the selected
            // border box
            if (event.key === "Escape") {
                if (isSelectionMenuOpen) {
                    setIsSelectionMenuOpen(false);
                } else {
                    deactivateSelectedBorderBox();
                }
            } else if (event.key === "Tab" && !event.shiftKey) {
                handleMenuIncreaseIndent();
                event.preventDefault();
            } else if (event.key === "Tab" && event.shiftKey) {
                handleMenuDecreaseIndent();
                event.preventDefault();
            } else if (event.key === "Delete" || event.key === "Backspace") {
                handleMenuDeleteItems();
                event.preventDefault();
            }
            // TODO: Enter key handling
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [
        isSelectionMenuOpen,
        showSelectedBorderBox,
        handleMenuIncreaseIndent,
        handleMenuDecreaseIndent,
        handleMenuDeleteItems,
    ]);

    return {
        checklistGroupRef,
        checklistItems,
        handleSelect,
        handleBlur,
        handleItemChange,
        handleAddItem,
        handleRemoveItem,
        handleBlurItem,
        handleIndentItem,
        handleApplyStyle,
        handleMouseEnter,
        handleMouseLeave,
        handleFocusNextEditor,
        handleFocusPreviousEditor,
        handleEditorMouseDown,

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

        linkHoverRef,
        showLinkHover,
        linkHoverPosition,
        hoveredLink: lastHoveredLink,
        handleLinkTooltipMouseEnter,
        handleLinkTooltipMouseLeave,
        handleCopyLinkToClipboardClick,
        handleLinkEditClick,
        handleLinkRemoveClick,

        handleSelectItem,
        selectedBorderBoxPosition,
        showSelectedBorderBox,
        isSelectionMenuOpen,

        selectionMenuRef,
        selectionMenuPosition,
        handleMenuAddLineAboveClick,
        handleMenuAddLineBelowClick,
        handleMenuMarkAsComplete,
        handleMenuMarkAsIncomplete,
        handleMenuIncreaseIndent,
        handleMenuDecreaseIndent,
        handleMenuDuplicateItems,
        handleMenuDeleteItems,
    };
};

export default useChecklistGroup;
