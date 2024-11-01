import { useState } from "react";
import { Checkbox } from "@mui/material";

import styles from "./checklist-item.module.scss";
import InlineEditor from "../InlineEditor/InlineEditor";

export const ChecklistItem = ({
    item,
    // onChange,
    onNewLine,
    onRemoveLine,
}) => {
    const [defaultValue] = useState(item?.text || "");

    const _onNewLine = text => onNewLine({ text, id: item.id, focus: true });
    const _onRemoveLine = text =>
        onRemoveLine({ text, id: item.id, focus: true });
    const _onTextChange = () => {
        // console.(`On text change called`);
    };
    const _onCheckboxChange = () => {
        // console.log(`On checkbox change called`);
    };

    return (
        <div className={styles.checklistItem}>
            <Checkbox
                checked={item.isComplete}
                onChange={_onCheckboxChange}
                className={styles.itemCheckbox}
            />
            <InlineEditor
                ref={item.inputRef}
                defaultValue={defaultValue}
                onChange={_onTextChange}
                onNewline={_onNewLine}
                onRemoveLine={_onRemoveLine}
                // placeholder="To-do today"
            />
        </div>
    );
};

export default ChecklistItem;
