import InlineEditor from "@/components/editor/InlineEditor/InlineEditor";
import styles from "./checklist-item.module.scss";
// import { Checkbox } from "@mui/material";

/**
 * @value An object with keys: text, isComplete
 **/
const ChecklistItem = ({ item, showPlaceholder, onChange, onNewline }) => {
    const onTextChange = text => onChange({ ...item, text });
    // const onCheckboxChange = event =>
    //     onChange({ ...item, isComplete: event.target.checked });

    return (
        <div className={styles.checklistItem}>
            {/* <Checkbox checked={item.isComplete} onChange={onCheckboxChange} /> */}
            <InlineEditor
                ref={item.inputRef}
                defaultValue={item?.text || ""}
                onChange={onTextChange}
                onNewline={onNewline}
                placeholder={showPlaceholder ? "Write something" : ""}
            />
        </div>
    );
};

export default ChecklistItem;
