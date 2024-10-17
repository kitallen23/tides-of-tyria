import { createRef, useCallback, useEffect, useMemo, useState } from "react";
import ChecklistItem from "@/components/editor/ChecklistItem";
import { ChecklistSharp } from "@mui/icons-material";

import styles from "@/styles/modules/checklist.module.scss";
import { getLocalItem } from "@/utils/util";
import { LOCAL_STORAGE_KEYS } from "@/utils/constants";
import debounce from "lodash.debounce";
import { nanoid } from "nanoid";

const INPUT_DEBOUNCE_MS = 400;

const DailyChecklist = () => {
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
                // TEMP: UNCOMMENT ME
                localStorage.setItem(
                    LOCAL_STORAGE_KEYS.dailyChecklist,
                    JSON.stringify(items)
                );
            }, INPUT_DEBOUNCE_MS),
        []
    );

    useEffect(() => {
        // console.log(`checklistItems: `, checklistItems);
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

    const addItem = useCallback(
        (focus = false) => {
            const newItem = {
                text: "",
                isComplete: false,
                id: nanoid(6),
                inputRef: createRef(),
            };

            setChecklistItems([...checklistItems, newItem]);
            if (focus) {
                setTimeout(() => newItem.inputRef.current?.focus?.());
            }
        },
        [checklistItems]
    );

    // const removeItem = index => {
    //     setChecklistItems(checklistItems.filter((_, i) => i !== index));
    // };

    // If there are no checklist items, add a blank line (ensures there's always
    // an input field)
    useEffect(() => {
        if (!checklistItems.length) {
            addItem(false);
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
                    />
                ))}
            </div>
        </div>
    );
};

export default DailyChecklist;
