import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@mui/material";
import debounce from "lodash.debounce";
import classNames from "classnames";

import styles from "./checklist-item.module.scss";
import InlineEditor from "../InlineEditor/InlineEditor";

const INPUT_DEBOUNCE_MS = 400;

export const ChecklistItem = ({
    item,
    onChange,
    onSelect,
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
        onNewLine({ text, id: item.id, focus: true });
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

    const handleKeyDown = e => {
        if (e.key === "Tab") {
            e.preventDefault();
            handleIndent(!e.shiftKey);
        }
    };

    return (
        <div
            className={classNames(
                styles.checklistItem,
                styles[`indent${item.indentLevel}`]
            )}
            onKeyDown={handleKeyDown}
        >
            <Checkbox
                checked={item.isComplete}
                onChange={handleCheckboxChange}
                className={styles.itemCheckbox}
            />
            <InlineEditor
                id={item.id}
                ref={item.inputRef}
                defaultValue={defaultValue}
                onSelect={onSelect}
                onChange={handleTextChange}
                onNewLine={handleNewLine}
                onRemoveLine={handleRemoveLine}
                onIndent={handleIndent}
                onFocusPreviousEditor={handleFocusPreviousEditor}
                onFocusNextEditor={handleFocusNextEditor}
                // placeholder="To-do today"
            />
        </div>
    );
};

export default ChecklistItem;
