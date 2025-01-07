import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Checkbox } from "@mui/material";
import { DragIndicator } from "@mui/icons-material";
import debounce from "lodash.debounce";
import classNames from "classnames";
import { useSortable } from "@dnd-kit/sortable";

import styles from "./checklist-item.module.scss";
import InlineEditor from "../InlineEditor/InlineEditor";
import { getDecodedLengthWithBr } from "../utils";

const INPUT_DEBOUNCE_MS = 400;

export const ChecklistItem = ({
    item,
    placeholder,
    onChange,
    onSelect,
    onBlur,
    onNewLine,
    onRemoveLine,
    onIndent,
    onFocusNextEditor,
    onFocusPreviousEditor,
    onSelectItem,
    onMouseDown,
    isDragging,
}) => {
    const checklistItemRef = useRef(null);
    const [defaultValue] = useState(item?.text || "");

    const debouncedTextChange = useMemo(
        () =>
            debounce(
                () => onChange({ id: item.id, key: "text" }),
                INPUT_DEBOUNCE_MS
            ),
        [item.id, onChange]
    );

    useEffect(() => {
        // Cleanup function to flush the debounce on unmount
        return () => {
            debouncedTextChange.flush();
        };
    }, [debouncedTextChange]);

    const handleTextChange = () => {
        debouncedTextChange();
    };
    const handleNewLine = text => {
        debouncedTextChange.flush();
        if (!item.inputRef.current.innerHTML && item.indentLevel > 0) {
            onIndent({ id: item.id, indent: false });
        } else {
            onNewLine({ text, id: item.id, focus: true });
        }
    };
    const handleRemoveLine = text => {
        debouncedTextChange.flush();
        if (item.indentLevel > 0) {
            onIndent({ id: item.id, indent: false });
        } else {
            onRemoveLine({ text, id: item.id, focus: true });
        }
    };
    const handleIndent = (indent = true) => {
        debouncedTextChange.flush();
        onIndent({ id: item.id, indent });
    };
    const handleCheckboxChange = event => {
        const value = event.target.checked;
        debouncedTextChange.flush();
        setTimeout(
            () =>
                onChange({
                    id: item.id,
                    value,
                    key: "isComplete",
                }),
            0
        );
    };
    const handleFocusPreviousEditor = left => {
        onFocusPreviousEditor({ id: item.id, left });
    };
    const handleFocusNextEditor = left => {
        onFocusNextEditor({ id: item.id, left });
    };
    const handleBlur = event => {
        const newTarget = event.relatedTarget || document.activeElement;
        const isNested = checklistItemRef.current?.contains(newTarget);
        if (!isNested) {
            onBlur({ id: item.id });
        }
    };

    const handleKeyDown = e => {
        if (e.key === "Tab") {
            e.preventDefault();
            handleIndent(!e.shiftKey);
        }
    };

    const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(false);
    useEffect(() => {
        const editor = item.inputRef?.current;
        if (editor) {
            const updatePlaceholderVisibility = () => {
                if (document.activeElement === editor) {
                    const contentLength = getDecodedLengthWithBr(
                        editor.innerHTML
                    );
                    if (contentLength === 0 || editor.innerHTML === "<br>") {
                        setIsPlaceholderVisible(true);
                    } else {
                        setIsPlaceholderVisible(false);
                    }
                } else {
                    setIsPlaceholderVisible(false);
                }
            };

            editor.addEventListener("focus", updatePlaceholderVisibility);
            editor.addEventListener("blur", updatePlaceholderVisibility);
            editor.addEventListener("input", updatePlaceholderVisibility);

            // Initialize placeholder
            updatePlaceholderVisibility();

            return () => {
                editor.removeEventListener(
                    "focus",
                    updatePlaceholderVisibility
                );
                editor.removeEventListener("blur", updatePlaceholderVisibility);
                editor.removeEventListener(
                    "input",
                    updatePlaceholderVisibility
                );
            };
        }
    }, [item.inputRef]);

    const { attributes, listeners, setNodeRef, isSorting } = useSortable({
        id: item.id,
    });

    return (
        <div
            ref={setNodeRef}
            className={classNames(
                styles.checklistItemHoverArea,
                styles[`indent${item.indentLevel}`],
                "checklist-item-hover-area"
            )}
            style={{
                opacity: isSorting ? (isDragging ? 1 : 0.5) : 1,
            }}
            id={`item-${item.id}`}
        >
            {/* Drag handle / menu icon */}
            <div
                className={classNames(
                    styles.itemMenuIndicator,
                    "item-menu-indicator",
                    { [styles.disabled]: isSorting }
                )}
            >
                <Button
                    color="muted"
                    sx={{
                        minWidth: 0,
                        padding: "3px 2px",
                        fontSize: "inherit",
                    }}
                    className={styles.dragHandle}
                    {...listeners}
                    {...attributes}
                    onClick={e => onSelectItem(e, item.id)}
                >
                    <DragIndicator />
                </Button>
            </div>

            {/* Checklist item */}
            <div
                ref={checklistItemRef}
                className={classNames(
                    styles.checklistItem,
                    {
                        [styles.isComplete]: item.isComplete,
                    },
                    "checklist-item"
                )}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            >
                {item.type === "text" ? (
                    <div className={styles.itemTextline}>
                        <div className={styles.itemTextlineContent}>•</div>
                    </div>
                ) : (
                    <Checkbox
                        checked={item.isComplete}
                        onChange={handleCheckboxChange}
                        className={styles.itemCheckbox}
                        inputProps={{ "aria-label": "controlled" }}
                    />
                )}
                <div className={styles.editorWrapper}>
                    <InlineEditor
                        id={item.id}
                        ref={item.inputRef}
                        defaultValue={defaultValue}
                        disableColor={item.isComplete}
                        onSelect={onSelect}
                        onChange={handleTextChange}
                        onNewLine={handleNewLine}
                        onRemoveLine={handleRemoveLine}
                        onIndent={handleIndent}
                        onFocusPreviousEditor={handleFocusPreviousEditor}
                        onFocusNextEditor={handleFocusNextEditor}
                        onMouseDown={onMouseDown}
                    />

                    {/* Placeholder */}
                    {placeholder ? (
                        <div
                            className={classNames(styles.placeholder, {
                                [styles.show]: isPlaceholderVisible,
                            })}
                        >
                            {placeholder}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ChecklistItem;
