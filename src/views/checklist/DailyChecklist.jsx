import { createRef, useEffect, useMemo, useRef, useState } from "react";
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
                    renderKey: nanoid(4),
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
                const sanitisedItems = items.map(item => {
                    // eslint-disable-next-line no-unused-vars
                    const { inputRef, renderKey, ...rest } = item;
                    return rest;
                });
                localStorage.setItem(
                    LOCAL_STORAGE_KEYS.dailyChecklist,
                    JSON.stringify(sanitisedItems)
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

    const handleItemChange = ({ key, value, id }) => {
        setChecklistItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, [key]: value } : item
            )
        );
        setValueKey(n => n + 1);
    };

    /**
     * Adds a new checklist item.
     *
     * @param {Object} options - The options for adding the item.
     * @param {string} options.text - The text of the item.
     * @param {string} options.id - The unique identifier for the item.
     * @param {boolean} [options.focus=false] - If true, the new line will become focused.
     */
    const handleAddItem = ({ text = "", id = "", focus = false }) => {
        // TODO: Remove me
        // console.log(`addItem: `, text, id, focus);
        setChecklistItems(items => {
            // Determine the index to insert the new item
            let index = -1;
            if (id) {
                index = items.findIndex(item => item.id === id);
            }
            if (index === -1) {
                index = items.length - 1;
            }

            const newItem = {
                text,
                isComplete: false,
                id: nanoid(6),
                inputRef: createRef(),
                indentLevel: 0,
                renderKey: nanoid(4),
            };

            // Create a new array with the new item inserted at the correct position
            const newItems = items.toSpliced(index + 1, 0, newItem);
            if (focus) {
                setTimeout(() => newItem.inputRef.current?.focus?.());
            }

            return newItems;
        });
        setValueKey(n => n + 1);
    };

    /**
     * Removes a line, and collapses its content into the previous line.
     *
     * @param {string} text - The remaining text of the item that we're
     * collapsing.
     * @param {number} position - The position (as an index) of the item we're
     * removing.
     * @param {boolean} focus - If true, the previous line will become focused.
     **/
    const handleRemoveItem = ({ text = "", id, focus = false }) => {
        // TODO: Remove me
        // console.log(`removeItem: `, text, id, focus);
        setChecklistItems(items => {
            let newItems = [...items];
            const index = items.findIndex(item => item.id === id);

            if (index > 0) {
                if (focus) {
                    newItems[index - 1]?.inputRef?.current?.focus?.();
                    const range = document.createRange();
                    const selection = window.getSelection();

                    range.selectNodeContents(
                        newItems[index - 1]?.inputRef?.current
                    );
                    range.collapse(false); // Collapse the range to the end
                    selection.removeAllRanges();
                    selection.addRange(range);
                }

                // newItems = newItems.filter(item => item.id !== id);
                newItems[index - 1].text += text;
                newItems[index - 1].renderKey = nanoid(4);

                // if (focus) {
                // setTimeout(() => {
                //     const range =
                //         newItems[index - 1]?.inputRef?.current?.focus?.();
                // }, 0);
                // }

                return newItems;
            } else {
                return newItems;
            }
        });
    };

    // If there are no checklist items, add a blank line (ensures there's always
    // an input field)
    useEffect(() => {
        if (!checklistItems.length && !hasAddedInitialItem.current) {
            handleAddItem({});
            hasAddedInitialItem.current = true;
        }
    }, [checklistItems]);

    return (
        <div className={styles.group}>
            <h3 className={styles.heading}>
                <ChecklistSharp style={{ marginRight: "0.25rem" }} />
                Daily Checklist
            </h3>
            <div style={{ display: "grid" }}>
                {checklistItems.map(item => (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        onChange={handleItemChange}
                        onNewline={handleAddItem}
                        onRemoveLine={handleRemoveItem}
                        renderKey={item.renderKey}
                    />
                ))}
            </div>
        </div>
    );
};

export default DailyChecklist;
