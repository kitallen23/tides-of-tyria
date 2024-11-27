import {
    Box,
    Button,
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import {
    AddLinkSharp,
    AddSharp,
    ArrowDownwardSharp,
    ArrowUpwardSharp,
    CheckBoxOutlineBlankSharp,
    CheckBoxSharp,
    CheckSharp,
    ContentCopySharp,
    DeleteSharp,
    ExpandMoreSharp,
    FormatBoldSharp,
    FormatIndentDecreaseSharp,
    FormatIndentIncreaseSharp,
    FormatItalicSharp,
    FormatUnderlinedSharp,
    LanguageSharp,
} from "@mui/icons-material";
import classNames from "classnames";

import { useTheme } from "@/utils/theme-provider";
import ChecklistItem from "./ChecklistItem/ChecklistItem";
import useChecklistGroup from "./useChecklistGroup";
import styles from "./checklist-group.module.scss";

export const ChecklistGroup = ({
    checklistItems,
    setChecklistItems,
    placeholder,
}) => {
    const { colors } = useTheme();
    const isSmallScreen = useMediaQuery("(max-width: 768px)");
    const {
        checklistGroupRef,
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

        handleSelectItem,
        selectedBorderBoxPosition,
        showSelectedBorderBox,
        isSelectionMenuOpen,

        selectionMenuRef,
        handleMenuAddLineAboveClick,
        handleMenuAddLineBelowClick,
        handleMenuMarkAsComplete,
        handleMenuMarkAsIncomplete,
        handleMenuIncreaseIndent,
        handleMenuDecreaseIndent,
        handleMenuDuplicateItems,
        handleMenuDeleteItems,
    } = useChecklistGroup({ checklistItems, setChecklistItems });

    return (
        <div
            className={classNames(styles.checklistGroup, "checklist-group")}
            ref={checklistGroupRef}
            onBlur={handleBlur}
            onMouseOver={handleMouseEnter}
            onMouseOut={handleMouseLeave}
        >
            {checklistItems.length === 0 ? (
                // No items placeholder
                <div
                    className={styles.noItemsPlaceholder}
                    onClick={() => handleAddItem({ focus: true })}
                >
                    <em>No items.</em>
                </div>
            ) : (
                <>
                    {/* Selected item border box */}
                    <div
                        className={classNames(styles.selectedItemBorderBox, {
                            [styles.active]: showSelectedBorderBox,
                        })}
                        style={{
                            ...selectedBorderBoxPosition,
                            borderColor: colors.primary,
                            background: `${colors.primary}08`,
                        }}
                    />

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
                                isTempLinkUrlValid &&
                                tempLinkText?.trim().length
                                    ? "primary"
                                    : "muted"
                            }
                            sx={{ minWidth: 0, padding: 0.5 }}
                            onClick={handleApplyLink}
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
                            onBlur={handleBlurItem}
                            onSelectItem={handleSelectItem}
                            onMouseDown={handleEditorMouseDown}
                            placeholder={placeholder}
                        />
                    ))}

                    {/* Selection menu */}
                    <div
                        className={classNames(
                            styles.selectionMenu,
                            "selection-menu",
                            { [styles.active]: isSelectionMenuOpen }
                        )}
                        ref={selectionMenuRef}
                    >
                        <Paper sx={{ width: 300 }}>
                            <MenuList dense>
                                <MenuItem onClick={handleMenuMarkAsComplete}>
                                    <ListItemIcon>
                                        <CheckBoxSharp />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Mark as complete
                                    </ListItemText>
                                    {isSmallScreen ? null : (
                                        <Typography
                                            sx={{
                                                color: colors.muted,
                                                fontSize: "inherit",
                                            }}
                                        >
                                            <code>Enter</code>
                                        </Typography>
                                    )}
                                </MenuItem>
                                <MenuItem onClick={handleMenuMarkAsIncomplete}>
                                    <ListItemIcon>
                                        <CheckBoxOutlineBlankSharp />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Mark as incomplete
                                    </ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleMenuDuplicateItems}>
                                    <ListItemIcon>
                                        <ContentCopySharp />
                                    </ListItemIcon>
                                    <ListItemText>Duplicate</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleMenuDeleteItems}>
                                    <ListItemIcon>
                                        <DeleteSharp />
                                    </ListItemIcon>
                                    <ListItemText>Delete</ListItemText>
                                    {isSmallScreen ? null : (
                                        <Typography
                                            sx={{
                                                color: colors.muted,
                                                fontSize: "inherit",
                                            }}
                                        >
                                            <code>Backspace</code>
                                        </Typography>
                                    )}
                                </MenuItem>

                                <Divider />

                                <MenuItem onClick={handleMenuAddLineAboveClick}>
                                    <ListItemIcon>
                                        <Box
                                            position="relative"
                                            display="inline-flex"
                                        >
                                            <AddSharp />
                                            <ArrowUpwardSharp
                                                style={{
                                                    fontSize: "1em",
                                                    color: colors.muted,
                                                }}
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    right: 0,
                                                    transform:
                                                        "translate(40%,-40%)",
                                                }}
                                            />
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText>Add line above</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleMenuAddLineBelowClick}>
                                    <ListItemIcon>
                                        <Box
                                            position="relative"
                                            display="inline-flex"
                                        >
                                            <AddSharp />
                                            <ArrowDownwardSharp
                                                style={{
                                                    fontSize: "1em",
                                                    color: colors.muted,
                                                }}
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    right: 0,
                                                    transform:
                                                        "translate(40%,-40%)",
                                                }}
                                            />
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText>Add line below</ListItemText>
                                </MenuItem>

                                <Divider />

                                <MenuItem onClick={handleMenuIncreaseIndent}>
                                    <ListItemIcon>
                                        <FormatIndentIncreaseSharp />
                                    </ListItemIcon>
                                    <ListItemText>Increase indent</ListItemText>
                                    {isSmallScreen ? null : (
                                        <Typography
                                            sx={{
                                                color: colors.muted,
                                                fontSize: "inherit",
                                            }}
                                        >
                                            <code>Tab</code>
                                        </Typography>
                                    )}
                                </MenuItem>
                                <MenuItem onClick={handleMenuDecreaseIndent}>
                                    <ListItemIcon>
                                        <FormatIndentDecreaseSharp />
                                    </ListItemIcon>
                                    <ListItemText>Decrease indent</ListItemText>
                                    {isSmallScreen ? null : (
                                        <Typography
                                            sx={{
                                                color: colors.muted,
                                                fontSize: "inherit",
                                            }}
                                        >
                                            <code>Shift</code>+<code>Tab</code>
                                        </Typography>
                                    )}
                                </MenuItem>
                            </MenuList>
                        </Paper>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChecklistGroup;
