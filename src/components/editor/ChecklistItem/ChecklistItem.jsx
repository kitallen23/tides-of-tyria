import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@mui/material";
import debounce from "lodash.debounce";
import classNames from "classnames";

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
}) => {
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
        const isNested = newTarget?.closest(".checklist-item") !== null;
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

    return (
        <div
            className={classNames(
                styles.checklistItem,
                styles[`indent${item.indentLevel}`],
                {
                    [styles.isComplete]: item.isComplete,
                },
                "checklist-item"
            )}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
        >
            <Checkbox
                checked={item.isComplete}
                onChange={handleCheckboxChange}
                className={styles.itemCheckbox}
            />
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
    );
};

export default ChecklistItem;
