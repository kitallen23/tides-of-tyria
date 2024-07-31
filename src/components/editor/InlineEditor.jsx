import { useState, useRef, useEffect } from "react";
import styles from "@/styles/modules/inline-editor.module.scss";
import { Button } from "@mui/material";
import {
    AddLinkSharp,
    FormatBoldSharp,
    FormatItalicSharp,
    FormatUnderlinedSharp,
} from "@mui/icons-material";
import classNames from "classnames";

const InlineEditor = ({ defaultValue = "" }) => {
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const editorRef = useRef(null);
    const toolbarRef = useRef(null);

    useEffect(() => {
        // Set the initial content
        if (editorRef.current && defaultValue) {
            editorRef.current.innerHTML = defaultValue;
        }
    }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

    const handleKeyDown = e => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const handleSelect = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setToolbarPosition({
                top: rect.top - toolbarRef.current.offsetHeight - 10,
                left: rect.left,
            });
            setShowToolbar(true);
        } else {
            setShowToolbar(false);
        }
    };

    const applyStyle = style => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement("span");
            span.style.cssText = style;
            range.surroundContents(span);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

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
        <div className={styles.inlineEditorContainer}>
            <div
                ref={toolbarRef}
                className={classNames(styles.floatingToolbar, {
                    [styles.show]: showToolbar,
                })}
                style={toolbarPosition}
            >
                <Button
                    variant="text"
                    color="body"
                    sx={{ fontSize: "inherit", minWidth: 0, padding: 0.5 }}
                    onClick={() => applyStyle("font-weight: bold;")}
                >
                    <FormatBoldSharp />
                </Button>
                <Button
                    variant="text"
                    color="body"
                    sx={{ fontSize: "inherit", minWidth: 0, padding: 0.5 }}
                    onClick={() => applyStyle("font-style: italic;")}
                >
                    <FormatItalicSharp />
                </Button>
                <Button
                    variant="text"
                    color="body"
                    sx={{ fontSize: "inherit", minWidth: 0, padding: 0.5 }}
                    onClick={() => applyStyle("text-decoration: underline;")}
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
                </Button>
            </div>
            <div
                ref={editorRef}
                className={styles.inlineEditor}
                contentEditable
                onMouseUp={handleSelect}
                onKeyUp={handleSelect}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default InlineEditor;
