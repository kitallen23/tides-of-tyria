import React, { forwardRef } from "react";
import { Button, TextField } from "@mui/material";
import {
    AddLinkSharp,
    CheckSharp,
    ContentCopySharp,
    ExpandMoreSharp,
    FormatBoldSharp,
    FormatItalicSharp,
    FormatUnderlinedSharp,
    LanguageSharp,
} from "@mui/icons-material";
import classNames from "classnames";
import { css } from "@emotion/react";

import styles from "./inline-editor.module.scss";
import useInlineEditor from "./useInlineEditor";

const InlineEditor = React.memo(
    forwardRef(
        (
            {
                defaultValue = "",
                placeholder,
                onChange,
                onNewline,
                onRemoveLine,
                renderKey,
            },
            ref
        ) => {
            const {
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
            } = useInlineEditor({
                renderKey,
                defaultValue,
                onChange,
                onNewline,
                onRemoveLine,
                ref,
            });

            return (
                <div
                    ref={wrapperRef}
                    className={classNames(
                        styles.inlineEditorContainer,
                        "inline-editor"
                    )}
                    onClick={event => {
                        if (event.target === event.currentTarget) {
                            ref.current?.focus?.();
                        }
                    }}
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
                            color={isBold ? "primary" : "body"}
                            sx={{ minWidth: 0, padding: 0.5 }}
                            onClick={() => applyStyle("bold")}
                        >
                            <FormatBoldSharp />
                        </Button>
                        <Button
                            variant="text"
                            color={isItalic ? "primary" : "body"}
                            sx={{ minWidth: 0, padding: 0.5 }}
                            onClick={() => applyStyle("italic")}
                        >
                            <FormatItalicSharp />
                        </Button>
                        <Button
                            variant="text"
                            color={isUnderlined ? "primary" : "body"}
                            sx={{ minWidth: 0, padding: 0.5 }}
                            onClick={() => applyStyle("underline")}
                        >
                            <FormatUnderlinedSharp />
                        </Button>
                        <Button
                            variant="text"
                            color="body"
                            sx={{ minWidth: 0, padding: 0.5 }}
                            onClick={openLinkPrompt}
                        >
                            <AddLinkSharp />
                            <ExpandMoreSharp
                                sx={{ fontSize: "0.875em" }}
                                color="muted"
                            />
                        </Button>
                    </div>

                    {/* Link prompt / editor */}
                    <div
                        ref={linkPromptRef}
                        className={classNames(
                            styles.linkPrompt,
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
                            onChange={event =>
                                setTempLinkText(event.target.value)
                            }
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
                            onChange={event =>
                                setTempLinkUrl(event.target.value)
                            }
                            inputRef={linkPromptInputRef}
                            onKeyDown={handleLinkInputKeyDown}
                        />
                        <Button
                            variant="text"
                            color={
                                isTempLinkUrlValid &&
                                tempLinkText?.trim().length
                                    ? "primary"
                                    : "muted"
                            }
                            sx={{ minWidth: 0, padding: 0.5 }}
                            onClick={applyLink}
                            disabled={
                                !isTempLinkUrlValid ||
                                !tempLinkText?.trim().length
                            }
                        >
                            <CheckSharp />
                        </Button>
                    </div>

                    {/* Link hover menu */}
                    <div
                        ref={linkHoverRef}
                        className={classNames(
                            styles.linkHover,
                            {
                                [styles.show]: ref.current && showLinkHover,
                            },
                            "inline-editor-link-hover"
                        )}
                        style={linkHoverPosition}
                        onMouseOver={handleTooltipMouseEnter}
                        onMouseOut={handleTooltipMouseLeave}
                    >
                        <div className={styles.url}>
                            <LanguageSharp />
                            <div className={styles.urlText}>
                                {hoveredLink?.href || ""}
                            </div>
                        </div>
                        <div className={styles.buttonContainer}>
                            <Button
                                variant="text"
                                color={isBold ? "primary" : "body"}
                                sx={{ minWidth: 0, padding: 0.5 }}
                                onClick={copyLinkToClipboard}
                            >
                                <ContentCopySharp />
                            </Button>
                            <Button
                                variant="text"
                                color={isBold ? "primary" : "body"}
                                sx={{
                                    minWidth: 0,
                                    padding: 0.5,
                                    fontSize: "0.875rem !important",
                                    lineHeight: 1,
                                }}
                                onClick={handleLinkEditClick}
                            >
                                Edit
                            </Button>
                        </div>
                    </div>

                    {/* Editor */}
                    <div
                        ref={ref}
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
                        onClick={handleLinkClick}
                        onMouseOver={handleEditorMouseEnter}
                        onMouseOut={handleEditorMouseLeave}
                        onInput={handleInput}
                    />

                    {/* Placeholder */}
                    <div
                        className={classNames(styles.placeholder, {
                            [styles.show]: isPlaceholderVisible && placeholder,
                        })}
                    >
                        {placeholder}
                    </div>
                </div>
            );
        }
    ),
    (prevProps, nextProps) => {
        return prevProps.defaultValue === nextProps.defaultValue;
    }
);
InlineEditor.displayName = "InlineEditor";

export default InlineEditor;
