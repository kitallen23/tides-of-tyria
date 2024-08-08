import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@mui/material";
import {
    AddLinkSharp,
    ExpandMoreSharp,
    FormatBoldSharp,
    FormatItalicSharp,
    FormatUnderlinedSharp,
} from "@mui/icons-material";
import { nanoid } from "nanoid";
import classNames from "classnames";

import styles from "@/styles/modules/inline-editor.module.scss";
import useEditorContext from "./EditorContext";

const InlineEditor = ({ defaultValue = "" }) => {
    const id = useMemo(() => nanoid(6), []);
    const { activeEditor, setActiveEditor } = useEditorContext();
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const editorRef = useRef(null);
    const toolbarRef = useRef(null);

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false);

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
        }
    }, [activeEditor]);

    const handleKeyDown = e => {
        // Prevent the Enter key from creating a new line in the editor
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
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
        setIsUnderlined(computedStyle.textDecoration.includes("underline"));
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
                const rangeRect = range.getBoundingClientRect();
                const editorRect = editorRef.current.getBoundingClientRect();

                const relativeTop = rangeRect.top - editorRect.top;
                const relativeLeft = rangeRect.left - editorRect.left;

                setToolbarPosition({
                    top: relativeTop - toolbarRef.current.offsetHeight,
                    left: relativeLeft,
                });
                setTextStates(range);
                setShowToolbar(true);
            } else {
                setShowToolbar(false);
            }
        }, 0);
    };

    /**
     * Applies a given style (e.g., bold, italic, underline) to the selected text
     */
    const applyStyle = command => {
        document.execCommand(command, false, null);
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            setTextStates(range);
        }
    };

    /**
     * Prompts the user for a URL and applies it as a link to the selected text
     */
    const applyLink = () => {
        const url = prompt("Enter URL", "http://");
        if (url) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.textContent = range.toString();
                range.deleteContents();
                range.insertNode(anchor);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    };

    return (
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
                            activeEditor === editorRef.current && showToolbar,
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
                    onClick={applyLink}
                >
                    <AddLinkSharp />
                    <ExpandMoreSharp
                        sx={{ fontSize: "0.875em" }}
                        color="muted"
                    />
                </Button>
            </div>
            <div
                ref={editorRef}
                id={id}
                className={styles.inlineEditor}
                contentEditable
                onMouseUp={handleSelect}
                onKeyUp={handleSelect}
                onKeyDown={handleKeyDown}
                onFocus={() => setActiveEditor(editorRef.current)}
            />
        </div>
    );
};

export default InlineEditor;
