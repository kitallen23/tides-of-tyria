import React, { useState } from "react";
import InlineEditor from "@/components/editor/InlineEditor/InlineEditor";
import styles from "./checklist-item.module.scss";
import { Checkbox } from "@mui/material";

const ChecklistItem = React.memo(
    ({ item, onChange, onNewline, onRemoveLine }) => {
        const onTextChange = text =>
            onChange({ key: "text", value: text, id: item.id });
        const onCheckboxChange = event =>
            onChange({
                key: "isComplete",
                value: event.target.checked,
                id: item.id,
            });

        const [defaultValue] = useState(item?.text || "");

        const _onNewline = text =>
            onNewline({ text, id: item.id, focus: true });

        const _onRemoveLine = text =>
            onRemoveLine({ text, id: item.id, focus: true });

        return (
            <div className={styles.checklistItem}>
                <Checkbox
                    checked={item.isComplete}
                    onChange={onCheckboxChange}
                    className={styles.itemCheckbox}
                />
                <InlineEditor
                    ref={item.inputRef}
                    defaultValue={defaultValue}
                    onChange={onTextChange}
                    onNewline={_onNewline}
                    onRemoveLine={_onRemoveLine}
                    placeholder="To-do today"
                />
            </div>
        );
    }
    // (prevProps, nextProps) => {
    //     return (
    //         prevProps.item.id === nextProps.item.id &&
    //         prevProps.item.text === nextProps.item.text &&
    //         prevProps.item.isComplete === nextProps.item.isComplete &&
    //         prevProps.item.indentLevel === nextProps.item.indentLevel &&
    //         prevProps.onRemoveLine === nextProps.onRemoveLine
    //     );
    // }
);
ChecklistItem.displayName = "ChecklistItem";

export default ChecklistItem;
