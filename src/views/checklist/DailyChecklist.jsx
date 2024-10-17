import {
    createRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import ChecklistItem from "@/components/editor/ChecklistItem/ChecklistItem";
import { ChecklistSharp } from "@mui/icons-material";
import debounce from "lodash.debounce";
import { nanoid } from "nanoid";

import styles from "./checklist-page.module.scss";
import { getLocalItem } from "@/utils/util";
import { LOCAL_STORAGE_KEYS } from "@/utils/constants";

const INPUT_DEBOUNCE_MS = 400;

const DailyChecklist = () => {
    const hasAddedInitialItem = useRef(false);
    const [checklistItems, setChecklistItems] = useState(() => {
        // Load from local storage on initial render
        const savedChecklist = getLocalItem(
            LOCAL_STORAGE_KEYS.dailyChecklist,
            "[]"
        );
        localStorage.setItem(LOCAL_STORAGE_KEYS.dailyChecklist, savedChecklist);
        return savedChecklist ? JSON.parse(savedChecklist) : [];
    });

    const debounceSave = useMemo(
        () =>
            debounce(items => {
                localStorage.setItem(
                    LOCAL_STORAGE_KEYS.dailyChecklist,
                    JSON.stringify(items)
                );
            }, INPUT_DEBOUNCE_MS),
        []
    );

    useEffect(() => {
        debounceSave(checklistItems);

        return () => {
            debounceSave.cancel();
        };
    }, [checklistItems, debounceSave]);

    const handleItemChange = (index, updatedItem) => {
        const newItems = [...checklistItems];
        newItems[index] = updatedItem;
        setChecklistItems(newItems);
    };

    /**
     * Adds a new checklist item.
     *
     * @param {string} text - The text of the item.
     * @param {number} position - The position to add the item. Defaults to
     * the end of the array.
     * @param {boolean} focus - If true, the new line will become focused.
     **/
    const addItem = useCallback((text = "", position = -1, focus = false) => {
        const newItem = {
            text,
            isComplete: false,
            id: nanoid(6),
            inputRef: createRef(),
            indentLevel: 0,
        };

        // setChecklistItems([...checklistItems, newItem]);
        setChecklistItems(prevItems => {
            // Determine the actual index to insert the new item
            let index = position;
            if (position === -1) {
                index = prevItems.length; // Insert at the end
            } else {
                index = Math.min(position, prevItems.length);
            }

            // Create a new array with the new item inserted at the correct position
            const updatedItems = [...prevItems];
            updatedItems.splice(index, 0, newItem);
            return updatedItems;
        });

        if (focus) {
            setTimeout(() => newItem.inputRef.current?.focus?.());
        }
    }, []);

    // const removeItem = index => {
    //     setChecklistItems(checklistItems.filter((_, i) => i !== index));
    // };

    // If there are no checklist items, add a blank line (ensures there's always
    // an input field)
    useEffect(() => {
        if (!checklistItems.length && !hasAddedInitialItem.current) {
            addItem();
            hasAddedInitialItem.current = true;
        }
    }, [checklistItems, addItem]);

    return (
        <div className={styles.group}>
            <h3 className={styles.heading}>
                <ChecklistSharp style={{ marginRight: "0.25rem" }} />
                Daily Checklist
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
                {checklistItems.map((item, i) => (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        onChange={updatedItem =>
                            handleItemChange(i, updatedItem)
                        }
                        onNewline={text => addItem(text, i + 1, true)}
                        showPlaceholder={i === checklistItems.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};

export default DailyChecklist;
