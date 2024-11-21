import { Button, TextField } from "@mui/material";
import {
    AddLinkSharp,
    CheckSharp,
    ContentCopySharp,
    DeleteSharp,
    ExpandMoreSharp,
    FormatBoldSharp,
    FormatItalicSharp,
    FormatUnderlinedSharp,
    LanguageSharp,
} from "@mui/icons-material";
import classNames from "classnames";

import ChecklistItem from "./ChecklistItem/ChecklistItem";
import useChecklistGroup from "./useChecklistGroup";
import styles from "./checklist-group.module.scss";

export const ChecklistGroup = ({
    checklistItems,
    setChecklistItems,
    placeholder,
}) => {
    const {
        checklistGroupRef,
        handleSelect,
        handleBlur,
        handleItemChange,
        handleAddItem,
        handleRemoveItem,
        handleIndentItem,
        handleApplyStyle,
        handleMouseEnter,
        handleMouseLeave,
        handleFocusNextEditor,
        handleFocusPreviousEditor,

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

        linkHoverRef,
        showLinkHover,
        linkHoverPosition,
        hoveredLink,
        handleLinkTooltipMouseEnter,
        handleLinkTooltipMouseLeave,
        handleCopyLinkToClipboardClick,
        handleLinkEditClick,
        handleLinkRemoveClick,
    } = useChecklistGroup({ checklistItems, setChecklistItems });

    // TODO: Remove me
    // const logAllItems = () => {
    //     if (checklistGroupRef.current) {
    //         const contentEditableDivs =
    //             checklistGroupRef.current.querySelectorAll(
    //                 '[contenteditable="true"]'
    //             );
    //         const itemsWithHtml = checklistItems.map((item, i) => ({
    //             html: contentEditableDivs[i].innerHTML,
    //             ...item,
    //         }));
    //         console.info(`Checklist items: `, itemsWithHtml);
    //     }
    // };

    return (
        <>
            <div
                className={styles.checklistGroup}
                ref={checklistGroupRef}
                onBlur={handleBlur}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
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

                {/* Link hover menu */}
                <div
                    ref={linkHoverRef}
                    className={classNames(styles.floatingLinkMenu, {
                        [styles.show]: showLinkHover,
                    })}
                    style={linkHoverPosition}
                    onMouseOver={handleLinkTooltipMouseEnter}
                    onMouseOut={handleLinkTooltipMouseLeave}
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
                            color="body"
                            sx={{ minWidth: 0, padding: 0.5 }}
                            onClick={handleCopyLinkToClipboardClick}
                        >
                            <ContentCopySharp />
                        </Button>
                        <Button
                            variant="text"
                            color="body"
                            sx={{ minWidth: 0, padding: 0.5 }}
                            onClick={handleLinkRemoveClick}
                        >
                            <DeleteSharp />
                        </Button>
                        <Button
                            variant="text"
                            color="body"
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

                {/* Checklist items */}
                {checklistItems.map(item => (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        onChange={handleItemChange}
                        onNewLine={handleAddItem}
                        onRemoveLine={handleRemoveItem}
                        onSelect={handleSelect}
                        onIndent={handleIndentItem}
                        onFocusNextEditor={handleFocusNextEditor}
                        onFocusPreviousEditor={handleFocusPreviousEditor}
                        placeholder={placeholder}
                    />
                ))}
            </div>

            {/* TODO: Remove me */}
            {/* <Button onClick={() => logAllItems()}>Log checklist items</Button> */}
        </>
    );
};

export default ChecklistGroup;
