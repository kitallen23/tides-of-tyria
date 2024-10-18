import InlineEditor from "@/components/editor/InlineEditor/InlineEditor";
import styles from "./checklist-item.module.scss";
import { Checkbox } from "@mui/material";

const ChecklistItem = ({ item, onChange, onNewline }) => {
    const onTextChange = text => onChange({ ...item, text });
    const onCheckboxChange = event =>
        onChange({ ...item, isComplete: event.target.checked });

    return (
        <div className={styles.checklistItem}>
            <Checkbox
                checked={item.isComplete}
                onChange={onCheckboxChange}
                className={styles.itemCheckbox}
            />
            <InlineEditor
                ref={item.inputRef}
                defaultValue={item?.text || ""}
                onChange={onTextChange}
                onNewline={onNewline}
                placeholder="To-do today"
            />
        </div>
    );
};

export default ChecklistItem;
