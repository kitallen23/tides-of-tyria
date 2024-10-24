import React, { useEffect, useState } from "react";
import InlineEditor from "@/components/editor/InlineEditor/InlineEditor";
import styles from "./checklist-item.module.scss";
import { Checkbox } from "@mui/material";

const ChecklistItem = React.memo(
    ({ item, onChange, onNewline, onRemoveLine, renderKey }) => {
        const onTextChange = text =>
            onChange({ key: "text", value: text, id: item.id });
        const onCheckboxChange = event =>
            onChange({
                key: "isComplete",
                value: event.target.checked,
                id: item.id,
            });

        const [defaultValue, setDefaultValue] = useState(item?.text || "");

        useEffect(() => {
            setDefaultValue(item.text);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [renderKey]);

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
    },
    (prevProps, nextProps) => {
        return (
            prevProps.item.id === nextProps.item.id &&
            prevProps.item.text === nextProps.item.text &&
            prevProps.item.isComplete === nextProps.item.isComplete &&
            prevProps.item.indentLevel === nextProps.item.indentLevel &&
            prevProps.renderKey === nextProps.renderKey
        );
    }
);
ChecklistItem.displayName = "ChecklistItem";

export default ChecklistItem;
