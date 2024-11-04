import { createRef, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { Button } from "@mui/material";

// import { getLocalItem } from "@/utils/util";
// import { LOCAL_STORAGE_KEYS } from "@/utils/constants";
import ChecklistItem from "./ChecklistItem/ChecklistItem";
import { sanitizeRichText, setCursorAtOffset } from "./InlineEditor/utils";

const TEMP_VALUE = `[{"text":"Hello, <b>wo</b>","isComplete":false,"id":"Na6rkc","indentLevel":0},{"text":"<b>rld</b>","isComplete":false,"id":"Z9clUU","indentLevel":0},{"text":"<b></b>Test 3","isComplete":false,"id":"2HTcnd","indentLevel":0}]`;

export const EditorGroup = () => {
    const [checklistItems, setChecklistItems] = useState(() => {
        // Load from local storage on initial render
        // const savedChecklist = getLocalItem(LOCAL_STORAGE_KEYS[key], "[]");
        // localStorage.setItem(LOCAL_STORAGE_KEYS[key], savedChecklist);

        const savedChecklist = TEMP_VALUE;
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

    const handleItemChange = ({ key, value, id }) =>
        setChecklistItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, [key]: value } : item
            )
        );

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
        console.info(`addItem: `, text, id, focus);

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
                setTimeout(() => newItem.inputRef.current?.focus(), 1);
            }

            return newItems;
        });
    };

    /**
     * Removes a line, and collapses its content into the previous line.
     *
     * @param {string} text - The remaining text of the item that we're
     * collapsing.
     * @param {number} position - The position (as an index) of the item we're
     * removing.
     **/
    const handleRemoveItem = ({ text = "", id }) => {
        // TODO: Remove me
        console.info(`removeItem: `, id, text);

        const index = checklistItems.findIndex(item => item.id === id);

        if (index > 0) {
            const prevRef = checklistItems[index - 1]?.inputRef;
            if (prevRef?.current) {
                const prevEditorTextContent = prevRef.current.textContent;
                const cursorOffset = prevEditorTextContent.length || 0;

                const newText = sanitizeRichText(
                    prevRef.current.innerHTML + text
                );
                prevRef.current.innerHTML = newText;
                setTimeout(() => setCursorAtOffset(prevRef, cursorOffset), 0);
            }

            // Only remove this line if index is greater than zero (don't remove
            // the first line)
            setChecklistItems(items => items.filter(item => item.id !== id));
        }
    };

    // If there are no checklist items, add a blank line (ensures there's always
    // an input field)
    const hasAddedInitialItem = useRef(false);
    useEffect(() => {
        if (!checklistItems.length && !hasAddedInitialItem.current) {
            handleAddItem({});
            hasAddedInitialItem.current = true;
        }
    }, [checklistItems]);

    return (
        <>
            <div>
                {checklistItems.map(item => (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        onChange={handleItemChange}
                        onNewLine={handleAddItem}
                        onRemoveLine={handleRemoveItem}
                    />
                ))}
            </div>
            <Button
                onClick={() =>
                    console.info("Checklist items: ", checklistItems)
                }
            >
                Log checklist items
            </Button>
        </>
    );
};
