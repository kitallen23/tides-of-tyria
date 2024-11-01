import { createRef, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { Button } from "@mui/material";

// import { getLocalItem } from "@/utils/util";
// import { LOCAL_STORAGE_KEYS } from "@/utils/constants";
import ChecklistItem from "./ChecklistItem/ChecklistItem";
import { sanitizeRichText } from "./InlineEditor/utils";

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
        console.info(`removeItem: `, text, id);

        setChecklistItems(items => {
            let newItems = [...items];
            const index = items.findIndex(item => item.id === id);

            if (index > 0) {
                newItems[index - 1]?.inputRef?.current?.focus?.();
                const range = document.createRange();
                const selection = window.getSelection();

                range.selectNodeContents(
                    newItems[index - 1]?.inputRef?.current
                );
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);

                // console.log(`Text: `, text);
                // console.log(
                //     `Prev line text: `,
                //     newItems[index - 1].inputRef.current.innerHTML
                // );
                setTimeout(() => {
                    // TODO: Restore cursor position

                    if (newItems[index - 1]?.inputRef.current) {
                        const newText = sanitizeRichText(
                            newItems[index - 1].inputRef.current.innerHTML +
                                text
                        );
                        newItems[index - 1].inputRef.current.focus();
                        newItems[index - 1].inputRef.current.innerHTML =
                            newText;
                    }
                }, 0);

                return newItems.filter(item => item.id !== id);
            } else {
                return newItems;
            }
        });
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
