import React, { useState } from "react";
import InlineEditor from "@/components/editor/InlineEditor/InlineEditor";
import styles from "./checklist-item.module.scss";
import { Checkbox } from "@mui/material";

const ChecklistItem = React.memo(
    ({ item, onChange, onNewline, onRemoveLine }) => {
        const onTextChange = text => onChange("text", text);
        const onCheckboxChange = event =>
            onChange("isComplete", event.target.checked);

        const [defaultValue] = useState(item?.text || "");

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
                    onNewline={onNewline}
                    onRemoveLine={onRemoveLine}
                    placeholder="To-do today"
                />
            </div>
        );
    }
);
ChecklistItem.displayName = "ChecklistItem";

export default ChecklistItem;
