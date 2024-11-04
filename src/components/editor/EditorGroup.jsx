import { Button, TextField } from "@mui/material";
import {
    AddLinkSharp,
    CheckSharp,
    // ContentCopySharp,
    ExpandMoreSharp,
    FormatBoldSharp,
    FormatItalicSharp,
    FormatUnderlinedSharp,
    // LanguageSharp,
} from "@mui/icons-material";
import classNames from "classnames";

import ChecklistItem from "./ChecklistItem/ChecklistItem";
import useEditorGroup from "./useEditorGroup";
import styles from "./editor-group.module.scss";

export const EditorGroup = () => {
    const {
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
        handleTempLinkTextChange,
        handleTempLinkUrlChange,
        handleLinkInputKeyDown,
        handleApplyLink,
    } = useEditorGroup();

    return (
        <>
            <div
                className={styles.editorGroup}
                ref={editorGroupRef}
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
                        color={textStates.isBold ? "primary" : "body"}
                        sx={{ minWidth: 0, padding: 0.5 }}
                        onClick={() => handleApplyStyle("bold")}
                    >
                        <FormatBoldSharp />
                    </Button>
                    <Button
                        variant="text"
                        color={textStates.isItalic ? "primary" : "body"}
                        sx={{ minWidth: 0, padding: 0.5 }}
                        onClick={() => handleApplyStyle("italic")}
                    >
                        <FormatItalicSharp />
                    </Button>
                    <Button
                        variant="text"
                        color={textStates.isUnderlined ? "primary" : "body"}
                        sx={{ minWidth: 0, padding: 0.5 }}
                        onClick={() => handleApplyStyle("underline")}
                    >
                        <FormatUnderlinedSharp />
                    </Button>
                    <Button
                        variant="text"
                        color="body"
                        sx={{ minWidth: 0, padding: 0.5 }}
                        onClick={handleOpenLinkEditor}
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
                    ref={linkEditorRef}
                    className={classNames(styles.floatingLinkEditor, {
                        [styles.show]: showLinkEditor,
                    })}
                    style={linkEditorPosition}
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
                            handleTempLinkTextChange(event.target.value)
                        }
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
                            handleTempLinkUrlChange(event.target.value)
                        }
                        inputRef={linkEditorUrlInputRef}
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

                {/* Checklist items */}
                {checklistItems.map(item => (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        onChange={handleItemChange}
                        onNewLine={handleAddItem}
                        onRemoveLine={handleRemoveItem}
                        onSelect={handleSelect}
                    />
                ))}
            </div>

            <Button
                onClick={() =>
                    console.info("Checklist items: ", checklistItems)
                }
            >
                Log checklist items
            </Button>
        </>
    );
};
