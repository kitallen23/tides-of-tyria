import { useEffect, useMemo, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { toast } from "react-hot-toast";

import { copyToClipboard } from "@/utils/util";
import { useTheme } from "@/utils/theme-provider";

const HOVER_DELAY = 500;

const useInlineEditor = ({
    defaultValue,
    onChange,
    onNewline,
    onRemoveLine,
    ref,
}) => {
    const id = useMemo(() => nanoid(6), []);
    const { colors } = useTheme();

    const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(
        defaultValue.trim() === ""
    );
    const [showToolbar, setShowToolbar] = useState(false);
    const [showLinkPrompt, setShowLinkPrompt] = useState(false);
    const [showLinkHover, setShowLinkHover] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({
        top: 0,
        left: 0,
    });
    const [linkPromptPosition, setLinkPromptPosition] = useState({
        top: 0,
        left: 0,
    });
    const [linkHoverPosition, setLinkHoverPosition] = useState({
        top: 0,
        left: 0,
    });

    const toolbarRef = useRef(null);
    const linkPromptRef = useRef(null);
    const linkPromptInputRef = useRef(null);
    const linkHoverRef = useRef(null);
    const wrapperRef = useRef(null);

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false);

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

    const closeLinkPrompt = () => {
        setShowLinkPrompt(false);
        setTempLinkUrl("");
        setTempLinkText("");
    };

    useEffect(() => {
        // Set the initial content (or updated content if renderKey changes)
        if (ref.current && defaultValue) {
            ref.current.innerHTML = defaultValue;
        }
        setIsPlaceholderVisible(defaultValue.trim() === "");
    }, [defaultValue]); /* eslint-disable-line react-hooks/exhaustive-deps */

    const handleBlur = event => {
        if (!wrapperRef?.current.contains(event?.relatedTarget)) {
            setShowToolbar(false);
            closeLinkPrompt();
        }
    };

    const [lastEnterPress, setLastEnterPress] = useState(0);
    const handleKeyDown = e => {
        // Prevent the Enter key from creating a new line in the editor
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            const currentTime = Date.now();
            if (currentTime - lastEnterPress < 500) {
                return;
            }
            setLastEnterPress(currentTime);

            handleNewLine();
        } else if (e.key === "Backspace") {
            const selection = window.getSelection();
            if (!selection.isCollapsed) {
                // Return if the selection isn't a "blinking line"
                return;
            }

            const range = selection.getRangeAt(0);

            if (
                range.startContainer === ref.current &&
                range.startOffset === 0
            ) {
                // The cursor is at the start of the contentEditable element
                handleRemoveCurrentLine();
            } else if (
                range.startContainer.nodeType === Node.TEXT_NODE &&
                range.startOffset === 0
            ) {
                // The cursor is at the start of a text node that is the
                // first child of the contentEditable element
                if (range.startContainer === ref.current.firstChild) {
                    handleRemoveCurrentLine();
                }
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

    /**
     * Deletes the current line.
     **/
    const handleRemoveCurrentLine = () => onRemoveLine(ref.current.innerHTML);

    const handleLinkInputKeyDown = e => {
        if (e.key === "Escape") {
            closeLinkPrompt();
        } else if (e.key === "Enter") {
            applyLink();
            e.preventDefault();
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

    /**
     * Updates the state variables for bold, italic, and underlined text
     * based on the computed style of the parent node of the selected range
     **/
    const setTextStates = range => {
        const parentNode = range.commonAncestorContainer.parentNode;
        const computedStyle = window.getComputedStyle(parentNode);

        setIsBold(
            computedStyle.fontWeight === "bold" ||
                computedStyle.fontWeight >= 700
        );
        setIsItalic(computedStyle.fontStyle === "italic");

        // Only set isUnderlined if the parentNode is not an anchor element
        if (parentNode.tagName.toLowerCase() !== "a") {
            setIsUnderlined(computedStyle.textDecoration.includes("underline"));
        } else {
            setIsUnderlined(false);
        }
    };

    /**
     * Handles the selection event to position the toolbar
     * and update text style states (bold, italic, underlined)
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

                // const rangeRect = range.getBoundingClientRect();
                const editorRect = ref.current.getBoundingClientRect();

                const relativeTop = startRect.top - editorRect.top;
                const relativeLeft = startRect.left - editorRect.left;

                // Perform a check to ensure our toolbar doesn't go off the side
                // of the editor (ensures it stay within bounds of the editor)
                const leftLimit =
                    editorRect.right -
                    toolbarRef.current.offsetWidth -
                    editorRect.left;

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
                    editorRect.right -
                    linkPromptRef.current.offsetWidth -
                    editorRect.left;

                let finalLinkToolbarLeft = relativeLeft;
                if (finalLinkToolbarLeft > linkToolbarLeftLimit) {
                    finalLinkToolbarLeft = linkToolbarLeftLimit;
                }

                setLinkPromptPosition({
                    top: relativeTop,
                    left: finalLinkToolbarLeft,
                });
                setTextStates(range);
                setShowToolbar(true);
            } else {
                setShowToolbar(false);
                closeLinkPrompt();
            }
        }, 0);
    };

    /**
     * Applies a given style (e.g., bold, italic, underline) to the selected text
     **/
    const applyStyle = command => {
        // For now we must use execCommand here, as without it the setTextStates
        // function isn't able to correctly read the styles.
        document.execCommand(command, false, null);
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            setTextStates(range);
        }
    };

    /**
     * Applies the temporary link text to the current selected text
     **/
    const applyLink = () => {
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

                    closeLinkPrompt();
                }
            }, 0);
        }
    };

    const openLinkPrompt = () => {
        if (!showLinkPrompt) {
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
            setShowLinkPrompt(true);

            // Focus the link input
            // setTimeout(() => {
            //     linkPromptInputRef.current.focus();
            // }, 0);
        } else {
            closeLinkPrompt();
        }
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

    const [hoveredLink, setHoveredLink] = useState(null);
    const hoveredLinkTimeoutRef = useRef(null);
    const handleEditorMouseEnter = event => {
        if (event.target.tagName.toLowerCase() === "a") {
            // Clear any existing timeout to prevent setting state for a previous link
            clearTimeout(hoveredLinkTimeoutRef.current);

            // Set a timeout to update the hovered link state after the delay
            hoveredLinkTimeoutRef.current = setTimeout(() => {
                setHoveredLink(event.target);
            }, HOVER_DELAY);
        }
    };

    const handleEditorMouseLeave = event => {
        if (event.target.tagName.toLowerCase() === "a") {
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

    const handleTooltipMouseEnter = () => {
        // Clear any timeout and keep the tooltip open
        clearTimeout(hoveredLinkTimeoutRef.current);
    };

    const handleTooltipMouseLeave = event => {
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
            const editorRect = ref.current.getBoundingClientRect();
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
    }, [hoveredLink, ref]);

    const copyLinkToClipboard = () => {
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

            openLinkPrompt();
            setHoveredLink(null);
        }
    };

    const handleInput = event => {
        let value = event.target.innerHTML;
        if (value === "<br>") {
            value = "";
            ref.current.innerHTML = "";
        }
        onChange(value);
        setIsPlaceholderVisible(event.target.innerHTML.trim() === "");
    };

    return {
        id,
        colors,
        wrapperRef,

        isBold,
        isItalic,
        isUnderlined,
        applyStyle,

        showToolbar,
        toolbarRef,
        toolbarPosition,

        showLinkPrompt,
        linkPromptRef,
        linkPromptInputRef,
        linkPromptPosition,
        openLinkPrompt,
        applyLink,

        tempLinkText,
        tempLinkUrl,
        setTempLinkText,
        setTempLinkUrl,
        handleLinkInputKeyDown,
        isTempLinkUrlValid,

        showLinkHover,
        linkHoverRef,
        linkHoverPosition,
        handleTooltipMouseEnter,
        handleTooltipMouseLeave,
        hoveredLink,
        copyLinkToClipboard,
        handleLinkEditClick,

        isPlaceholderVisible,

        handleInput,
        handleBlur,
        handleKeyDown,
        handleSelect,
        handleLinkClick,
        handleEditorMouseEnter,
        handleEditorMouseLeave,
    };
};

export default useInlineEditor;