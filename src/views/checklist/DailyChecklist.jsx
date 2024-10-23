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
    const [valueKey, setValueKey] = useState(0);
    const hasAddedInitialItem = useRef(false);
    const [checklistItems, setChecklistItems] = useState(() => {
        // Load from local storage on initial render
        const savedChecklist = getLocalItem(
            LOCAL_STORAGE_KEYS.dailyChecklist,
            "[]"
        );
        localStorage.setItem(LOCAL_STORAGE_KEYS.dailyChecklist, savedChecklist);
        try {
            const savedChecklistWithRefs = JSON.parse(savedChecklist).map(
                item => ({
                    ...item,
                    inputRef: createRef(),
                })
            );
            return savedChecklistWithRefs;
        } catch {
            return [];
        }
    });

    const debounceSave = useMemo(
        () =>
            debounce(items => {
                const itemsWithoutRefs = items.map(item => {
                    // eslint-disable-next-line no-unused-vars
                    const { inputRef, ...rest } = item;
                    return rest;
                });
                localStorage.setItem(
                    LOCAL_STORAGE_KEYS.dailyChecklist,
                    JSON.stringify(itemsWithoutRefs)
                );
            }, INPUT_DEBOUNCE_MS),
        []
    );

    useEffect(() => {
        // TODO: Remove me
        // console.log(`checklistItems: `, checklistItems);
        debounceSave(checklistItems);

        return () => {
            debounceSave.cancel();
        };
    }, [valueKey, checklistItems, debounceSave]);

    const handleItemChange = (index, key, value) => {
        setChecklistItems(prevItems => {
            prevItems[index][key] = value;
            return prevItems;
        });
        setValueKey(n => n + 1);
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
        // TODO: Fix bug here! Position sometimes gets janky.
        // console.log(`position: `, position);

        setChecklistItems(items => {
            // Determine the actual index to insert the new item
            let index = position;
            if (position === -1) {
                index = items.length; // Insert at the end
            } else {
                index = Math.min(position, items.length);
            }

            const newItem = {
                text,
                isComplete: false,
                id: nanoid(6),
                inputRef: createRef(),
                indentLevel: 0,
            };

            // Create a new array with the new item inserted at the correct position
            const newItems = items.toSpliced(index, 0, newItem);
            if (focus) {
                setTimeout(() => newItem.inputRef.current?.focus?.());
            }

            return newItems;
        });
        setValueKey(n => n + 1);
    }, []);

    /**
     * Removes a line, and collapses its content into the previous line.
     *
     * @param {string} text - The remaining text of the item that we're
     * collapsing.
     * @param {number} position - The position of the item we're removing.
     * @param {boolean} focus - If true, the previous line will become focused.
     **/
    const removeItem = useCallback((text = "", position, focus = false) => {
        setChecklistItems(prevItems => {
            if (position < 0 || position >= prevItems.length) {
                return prevItems;
            }
            const updatedItems = [...prevItems];

            // Check if we have text and if there's a line before this one
            if (text.trim() && position > 0) {
                updatedItems[position - 1].text =
                    `${updatedItems[position - 1].text}${text}`;
            }
            updatedItems.splice(position, 1);
            if (focus) {
                setTimeout(() => {
                    // console.log(
                    //     `updatedItems in debounce fn: `,
                    //     position,
                    //     updatedItems
                    // );
                    updatedItems[position - 1].current?.focus?.();
                }, 0);
            }
            return updatedItems;
        });
    }, []);

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
            <div style={{ display: "grid" }}>
                {checklistItems.map((item, i) => (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        onChange={(key, value) =>
                            handleItemChange(i, key, value)
                        }
                        onNewline={text => addItem(text, i + 1, true)}
                        onRemoveLine={text => removeItem(text, i, true)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DailyChecklist;
