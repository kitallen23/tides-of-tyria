import { useState, useRef, useEffect, useMemo } from "react";
import { Button, TextField } from "@mui/material";
import {
    AddLinkSharp,
    CheckSharp,
    ExpandMoreSharp,
    FormatBoldSharp,
    FormatItalicSharp,
    FormatUnderlinedSharp,
} from "@mui/icons-material";
import { nanoid } from "nanoid";
import classNames from "classnames";
import { css } from "@emotion/react";

import styles from "@/styles/modules/inline-editor.module.scss";
import useEditorContext from "./EditorContext";
import { useTheme } from "@/utils/theme-provider";

const InlineEditor = ({ defaultValue = "" }) => {
    const id = useMemo(() => nanoid(6), []);
    const { colors } = useTheme();
    const { activeEditor, setActiveEditor } = useEditorContext();
    const [showToolbar, setShowToolbar] = useState(false);
    const [showLinkPrompt, setShowLinkPrompt] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const [linkPromptPosition, setLinkPromptPosition] = useState({
        top: 0,
        left: 0,
    });

    const editorRef = useRef(null);
    const toolbarRef = useRef(null);
    const linkPromptRef = useRef(null);
    const linkPromptInputRef = useRef(null);

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false);

    const [linkRange, setLinkRange] = useState();
    const [tempLinkText, setTempLinkText] = useState("");
    const [tempLinkUrl, setTempLinkUrl] = useState("");
    const isTempLinkUrlValid = useMemo(() => {
        try {
            new URL(tempLinkUrl);
            return true;
        } catch (_) {
            return false;
        }
    }, [tempLinkUrl]);

    const closeLinkPrompt = () => {
        setShowLinkPrompt(false);
        setTempLinkUrl("");
        setTempLinkText("");
    };

    useEffect(() => {
        // Set the initial content
        if (editorRef.current && defaultValue) {
            editorRef.current.innerHTML = defaultValue;
        }
    }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

    useEffect(() => {
        // Hide the toolbar if the active editor is not the current editor
        if (activeEditor !== editorRef.current) {
            setShowToolbar(false);
            closeLinkPrompt();
        }
    }, [activeEditor]);

    const handleKeyDown = e => {
        // Prevent the Enter key from creating a new line in the editor
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
        }
    };

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
     */
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
     */
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
     */
    const handleSelect = () => {
        setTimeout(() => {
            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) {
                const range = selection.getRangeAt(0);

                // Use getClientRects to get the start position of the selection
                const clientRects = range.getClientRects();
                const startRect = clientRects[0];

                // const rangeRect = range.getBoundingClientRect();
                const editorRect = editorRef.current.getBoundingClientRect();

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
     */
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
        if (tempLinkUrl && isTempLinkUrlValid) {
            restoreSelection(linkRange);
            setTimeout(() => {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);

                    const anchor = document.createElement("a");
                    anchor.href = tempLinkUrl;
                    anchor.textContent = tempLinkText.toString();

                    range.deleteContents();
                    range.insertNode(anchor);

                    selection.removeAllRanges();
                    selection.addRange(range);

                    closeLinkPrompt();
                }
            }, 0);
        }
    };

    const openLinkPrompt = () => {
        if (!showLinkPrompt) {
            const savedRange = saveSelection();
            setLinkRange(savedRange);
            setTempLinkText(savedRange.toString());
            setShowLinkPrompt(true);

            // Focus the link input
            setTimeout(() => {
                linkPromptInputRef.current.focus();
            }, 0);
        } else {
            closeLinkPrompt();
        }
    };

    /**
     * Handles clicks within the contentEditable div.
     * If a link is clicked, it allows the default behavior to proceed.
     */
    const handleLinkClick = event => {
        const target = event.target;
        if (target.tagName.toLowerCase() === "a") {
            window.open(target.href, "_blank");
        }
    };

    // TODO: Remove me
    const logEditorContent = () => {
        if (editorRef.current) {
            console.info(editorRef.current.innerHTML);
        }
    };

    return (
        <>
            <div
                className={classNames(
                    styles.inlineEditorContainer,
                    "inline-editor"
                )}
            >
                <div
                    ref={toolbarRef}
                    className={classNames(
                        styles.floatingToolbar,
                        {
                            [styles.show]:
                                activeEditor === editorRef.current &&
                                showToolbar,
                        },
                        "inline-editor-toolbar"
                    )}
                    style={toolbarPosition}
                >
                    <Button
                        variant="text"
                        color={isBold ? "primary" : "body"}
                        sx={{ fontSize: "inherit", minWidth: 0, padding: 0.5 }}
                        onClick={() => applyStyle("bold")}
                    >
                        <FormatBoldSharp />
                    </Button>
                    <Button
                        variant="text"
                        color={isItalic ? "primary" : "body"}
                        sx={{ fontSize: "inherit", minWidth: 0, padding: 0.5 }}
                        onClick={() => applyStyle("italic")}
                    >
                        <FormatItalicSharp />
                    </Button>
                    <Button
                        variant="text"
                        color={isUnderlined ? "primary" : "body"}
                        sx={{ fontSize: "inherit", minWidth: 0, padding: 0.5 }}
                        onClick={() => applyStyle("underline")}
                    >
                        <FormatUnderlinedSharp />
                    </Button>
                    <Button
                        variant="text"
                        color="body"
                        sx={{ fontSize: "inherit", minWidth: 0, padding: 0.5 }}
                        onClick={openLinkPrompt}
                    >
                        <AddLinkSharp />
                        <ExpandMoreSharp
                            sx={{ fontSize: "0.875em" }}
                            color="muted"
                        />
                    </Button>
                </div>
                <div
                    ref={linkPromptRef}
                    className={classNames(
                        styles.linkPrompt,
                        {
                            [styles.show]:
                                activeEditor &&
                                editorRef.current &&
                                showLinkPrompt,
                        },
                        "inline-editor-link-prompt"
                    )}
                    style={linkPromptPosition}
                >
                    <TextField
                        id="link-text"
                        value={tempLinkText}
                        variant="outlined"
                        placeholder="Link text"
                        size="small"
                        color="primary"
                        sx={{
                            "& .MuiInputBase-input": {
                                padding: "4px 8px",
                                fontSize: "0.875em",
                            },
                        }}
                        onChange={event => setTempLinkText(event.target.value)}
                        inputRef={linkPromptInputRef}
                        onKeyDown={handleLinkInputKeyDown}
                    />
                    <div />
                    <TextField
                        id="link-url"
                        value={tempLinkUrl}
                        variant="outlined"
                        placeholder="Paste link"
                        size="small"
                        color="primary"
                        sx={{
                            "& .MuiInputBase-input": {
                                padding: "4px 8px",
                                fontSize: "0.875em",
                            },
                        }}
                        onChange={event => setTempLinkUrl(event.target.value)}
                        inputRef={linkPromptInputRef}
                        onKeyDown={handleLinkInputKeyDown}
                    />
                    <Button
                        variant="text"
                        color={isTempLinkUrlValid ? "primary" : "muted"}
                        sx={{ fontSize: "inherit", minWidth: 0, padding: 0.5 }}
                        onClick={() => applyLink()}
                    >
                        <CheckSharp />
                    </Button>
                </div>
                <div
                    ref={editorRef}
                    id={id}
                    className={styles.inlineEditor}
                    css={css({
                        a: {
                            textDecoration: "underline",
                            color: colors?.primary || undefined,
                        },
                    })}
                    contentEditable
                    onMouseUp={handleSelect}
                    onKeyUp={handleSelect}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setActiveEditor(editorRef.current)}
                    onClick={handleLinkClick}
                />
            </div>
            {/* TODO: Remove me */}
            <Button onClick={logEditorContent}>Log HTML Content</Button>
        </>
    );
};

export default InlineEditor;
