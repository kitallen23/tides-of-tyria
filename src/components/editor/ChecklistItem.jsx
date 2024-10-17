import InlineEditor from "./InlineEditor";

/**
 * @value An object with keys: text, isCompleted
 **/
const ChecklistItem = ({ item, onChange }) => {
    const onTextChange = text => onChange({ ...item, text });

    return (
        <div>
            <InlineEditor
                ref={item.inputRef}
                defaultValue={item?.text || ""}
                onChange={onTextChange}
            />
        </div>
    );
};

export default ChecklistItem;
