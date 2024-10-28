import { useEffect, useMemo, useRef, useState } from "react";
import DOMPurify from "dompurify";

import styles from "./editor.module.scss";
import { getSelectionRange, restoreSelectionRange } from "./utils";

const useEditor = ({ ref, lines }) => {
    const wrapperRef = useRef(null);

    const toolbarRef = useRef(null);
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({
        top: 0,
        left: 0,
    });

    const linkPromptRef = useRef(null);
    const [showLinkPrompt, setShowLinkPrompt] = useState(false);
    const [linkPromptPosition, setLinkPromptPosition] = useState({
        top: 0,
        left: 0,
    });
    const [tempLinkText, setTempLinkText] = useState("");
    const tempLinkUrlInputRef = useRef(null);
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
    const [tempLinkRange, setTempLinkRange] = useState();

    const [isSelectionBold, setIsSelectionBold] = useState(false);
    const [isSelectionItalic, setIsSelectionItalic] = useState(false);
    const [isSelectionUnderlined, setIsSelectionUnderlined] = useState(false);

    // const linkPromptRef = useRef(null);
    // const [linkPromptPosition, setLinkPromptPosition] = useState({
    //     top: 0,
    //     left: 0,
    // });

    useEffect(() => {
        if (ref.current) {
            const html = lines
                .map(line => `<div class="${styles.line}">${line.text}</div>`)
                .join("");
            ref.current.innerHTML = DOMPurify.sanitize(html);
        }
    }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

    const handleBlur = event => {
        if (!wrapperRef?.current.contains(event?.relatedTarget)) {
            setShowToolbar(false);
            closeLinkPrompt();
        }
    };

    /**
     * Positions the toolbar and update text style states (bold, italic,
     * underlined)
     **/
    const handleSelectionChange = () => {
        // setTimeout(() => {
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
            // closeLinkPrompt();
        }
        // }, 0);
    };

    /**
     * Applies a given style (e.g., bold, italic, underline) to the selected text
     **/
    const handleApplyStyle = command => {
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
     * Updates the state variables for bold, italic, and underlined text
     * based on the computed style of the parent node of the selected range
     **/
    const setTextStates = range => {
        const parentNode = range.commonAncestorContainer.parentNode;
        const computedStyle = window.getComputedStyle(parentNode);

        setIsSelectionBold(
            computedStyle.fontWeight === "bold" ||
                computedStyle.fontWeight >= 700
        );
        setIsSelectionItalic(computedStyle.fontStyle === "italic");

        // Only set isUnderlined if the parentNode is not an anchor element
        if (parentNode.tagName.toLowerCase() !== "a") {
            setIsSelectionUnderlined(
                computedStyle.textDecoration.includes("underline")
            );
        } else {
            setIsSelectionUnderlined(false);
        }
    };

    /**
     * Applies the temporary link text to the current selected text
     **/
    const handleApplyLink = () => {
        if (tempLinkUrl && isTempLinkUrlValid && tempLinkText?.trim().length) {
            restoreSelectionRange(tempLinkRange);
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
                    // onChange(ref.current.innerHTML);
                }
            }, 0);
        }
    };

    const closeLinkPrompt = () => {
        setShowLinkPrompt(false);
        setTempLinkUrl("");
        setTempLinkText("");
    };

    const handleLinkInputKeyDown = e => {
        if (e.key === "Escape") {
            closeLinkPrompt();
        } else if (e.key === "Enter") {
            handleApplyLink();
            e.preventDefault();
        }
    };

    const handleOpenLinkPrompt = () => {
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
                handleSelectionChange();
            }

            const currentSelection = getSelectionRange();
            setTempLinkRange(currentSelection);
            setTempLinkText(currentSelection.toString());
            setTempLinkUrl(href || "");
            setShowLinkPrompt(true);

            // Focus the link input
            setTimeout(() => {
                tempLinkUrlInputRef.current.focus();
            }, 0);
        } else {
            closeLinkPrompt();
        }
    };

    return {
        wrapperRef,
        handleBlur,

        handleSelectionChange,
        isSelectionBold,
        isSelectionItalic,
        isSelectionUnderlined,

        showToolbar,
        toolbarPosition,
        toolbarRef,
        handleApplyStyle,
        handleOpenLinkPrompt,

        linkPromptRef,
        showLinkPrompt,
        linkPromptPosition,
        handleApplyLink,

        tempLinkText,
        tempLinkUrlInputRef,
        tempLinkUrl,
        isTempLinkUrlValid,
        setTempLinkText,
        setTempLinkUrl,
        handleLinkInputKeyDown,
    };
};

export default useEditor;
