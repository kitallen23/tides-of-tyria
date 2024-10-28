import { forwardRef } from "react";
import classNames from "classnames";
import { Button, TextField } from "@mui/material";
import {
    AddLinkSharp,
    CheckSharp,
    ExpandMoreSharp,
    FormatBoldSharp,
    FormatItalicSharp,
    FormatUnderlinedSharp,
} from "@mui/icons-material";
import { css } from "@emotion/react";

import styles from "./editor.module.scss";
import useEditor from "./useEditor.js";
import { useTheme } from "@/utils/theme-provider";

const Editor = forwardRef(({ lines }, ref) => {
    const { colors } = useTheme();
    const {
        wrapperRef,
        handleBlur,

        handleSelectionChange,
        isSelectionBold,
        isSelectionItalic,
        isSelectionUnderlined,

        toolbarRef,
        showToolbar,
        toolbarPosition,
        handleOpenLinkPrompt,
        handleApplyStyle,

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
    } = useEditor({ ref, lines });

    return (
        <div
            ref={wrapperRef}
            className={styles.editorWrapper}
            onBlur={handleBlur}
        >
            {/* Toolbar */}
            <div
                ref={toolbarRef}
                className={classNames(
                    styles.floatingToolbar,
                    {
                        [styles.show]: showToolbar,
                    },
                    "inline-editor-toolbar"
                )}
                style={toolbarPosition}
            >
                <Button
                    variant="text"
                    color={isSelectionBold ? "primary" : "body"}
                    sx={{ minWidth: 0, padding: 0.5 }}
                    onClick={() => handleApplyStyle("bold")}
                >
                    <FormatBoldSharp />
                </Button>
                <Button
                    variant="text"
                    color={isSelectionItalic ? "primary" : "body"}
                    sx={{ minWidth: 0, padding: 0.5 }}
                    onClick={() => handleApplyStyle("italic")}
                >
                    <FormatItalicSharp />
                </Button>
                <Button
                    variant="text"
                    color={isSelectionUnderlined ? "primary" : "body"}
                    sx={{ minWidth: 0, padding: 0.5 }}
                    onClick={() => handleApplyStyle("underline")}
                >
                    <FormatUnderlinedSharp />
                </Button>
                <Button
                    variant="text"
                    color="body"
                    sx={{ minWidth: 0, padding: 0.5 }}
                    onClick={handleOpenLinkPrompt}
                >
                    <AddLinkSharp />
                    <ExpandMoreSharp
                        sx={{ fontSize: "0.875em" }}
                        color="muted"
                    />
                </Button>
            </div>

            {/* Link prompt / link editor */}
            <div
                ref={linkPromptRef}
                className={classNames(
                    styles.floatingLinkPrompt,
                    {
                        [styles.show]: showLinkPrompt,
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
                    inputRef={tempLinkUrlInputRef}
                    onKeyDown={handleLinkInputKeyDown}
                />
                <Button
                    variant="text"
                    color={
                        isTempLinkUrlValid && tempLinkText?.trim().length
                            ? "primary"
                            : "muted"
                    }
                    sx={{ minWidth: 0, padding: 0.5 }}
                    onClick={handleApplyLink}
                    disabled={
                        !isTempLinkUrlValid || !tempLinkText?.trim().length
                    }
                >
                    <CheckSharp />
                </Button>
            </div>

            <div
                ref={ref}
                contentEditable={true}
                className={styles.editor}
                css={css({
                    a: {
                        textDecoration: "underline",
                        color: colors?.primary || undefined,
                    },
                })}
                onMouseUp={handleSelectionChange}
                onKeyUp={handleSelectionChange}
            />
        </div>
    );
});
Editor.displayName = "Editor";
export default Editor;
