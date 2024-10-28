import { createRef, useEffect, useMemo, useRef, useState } from "react";
import ChecklistItem from "@/components/editor/ChecklistItem/ChecklistItem";
import { ChecklistSharp } from "@mui/icons-material";
import debounce from "lodash.debounce";
import { nanoid } from "nanoid";

import styles from "./checklist-page.module.scss";
// import { getLocalItem } from "@/utils/util";
import { LOCAL_STORAGE_KEYS } from "@/utils/constants";

const INPUT_DEBOUNCE_MS = 400;

// TODO: REMOVE ME
const TEMP_VALUE = `[{"text":"Hello, <b>wo</b>","isComplete":false,"id":"Na6rkc","indentLevel":0},{"text":"<b>rld</b>","isComplete":false,"id":"Z9clUU","indentLevel":0},{"text":"<b></b>Test 3","isComplete":false,"id":"2HTcnd","indentLevel":0}]`;

const DailyChecklist = () => {
    const [valueKey, setValueKey] = useState(0);
    const hasAddedInitialItem = useRef(false);
    const [checklistItems, setChecklistItems] = useState(() => {
        // Load from local storage on initial render
        // const savedChecklist = getLocalItem(
        //     LOCAL_STORAGE_KEYS.dailyChecklist,
        //     "[]"
        // );

        // TODO: REMOVE ME
        const savedChecklist = TEMP_VALUE;

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

    const sanitiseHtmlString = text => {
        // Create a temporary container to parse the HTML string
        const container = document.createElement("div");
        container.innerHTML = text;

        const mergeAndCleanNodes = (parent, tagName) => {
            let child = parent.firstChild;
            while (child) {
                if (
                    child.nodeType === Node.ELEMENT_NODE &&
                    child.tagName.toLowerCase() === tagName
                ) {
                    let nextSibling = child.nextSibling;
                    while (
                        nextSibling &&
                        nextSibling.nodeType === Node.ELEMENT_NODE &&
                        nextSibling.tagName.toLowerCase() === tagName
                    ) {
                        // Merge text content of adjacent nodes
                        child.innerHTML += nextSibling.innerHTML;
                        // Remove the merged node
                        parent.removeChild(nextSibling);
                        nextSibling = child.nextSibling;
                    }
                    // Remove the node if it is empty
                    if (child.innerHTML.trim() === "") {
                        const nodeToRemove = child;
                        child = child.nextSibling;
                        parent.removeChild(nodeToRemove);
                        continue;
                    }
                }
                child = child.nextSibling;
            }
        };

        // Merge <b>, <i>, and <u> tags
        ["b", "i", "u"].forEach(tag => mergeAndCleanNodes(container, tag));

        // Return the sanitized HTML as a string
        return container.innerHTML;
    };

    const debounceSave = useMemo(
        () =>
            debounce(items => {
                // console.log(`Saving checklistItems: `, items);
                const sanitisedItems = items.map(item => {
                    const { inputRef, text, ...rest } = item;

                    // Save the current cursor position
                    const selection = window.getSelection();
                    const range =
                        selection.rangeCount > 0
                            ? selection.getRangeAt(0)
                            : null;
                    let cursorPosition = 0;

                    if (
                        range &&
                        inputRef.current.contains(range.startContainer)
                    ) {
                        const preCaretRange = range.cloneRange();
                        preCaretRange.selectNodeContents(inputRef.current);
                        preCaretRange.setEnd(
                            range.startContainer,
                            range.startOffset
                        );
                        cursorPosition = preCaretRange.toString().length;
                    }

                    let sanitisedText = sanitiseHtmlString(text);

                    if (sanitisedText !== text) {
                        inputRef.current.innerHTML = sanitisedText;

                        // Restore the cursor position
                        if (range) {
                            const newRange = document.createRange();
                            const newSelection = window.getSelection();
                            let charCount = 0;
                            let found = false;

                            const traverseNodes = node => {
                                if (found) return;
                                if (node.nodeType === Node.TEXT_NODE) {
                                    const textLength = node.textContent.length;
                                    if (
                                        charCount + textLength >=
                                        cursorPosition
                                    ) {
                                        newRange.setStart(
                                            node,
                                            cursorPosition - charCount
                                        );
                                        newRange.setEnd(
                                            node,
                                            cursorPosition - charCount
                                        );
                                        found = true;
                                    }
                                    charCount += textLength;
                                } else {
                                    for (
                                        let i = 0;
                                        i < node.childNodes.length;
                                        i++
                                    ) {
                                        traverseNodes(node.childNodes[i]);
                                    }
                                }
                            };

                            traverseNodes(inputRef.current);

                            if (found) {
                                newSelection.removeAllRanges();
                                newSelection.addRange(newRange);
                            }
                        }
                    }

                    return { ...rest, text: sanitisedText };
                });
                // console.log(`Saving sanitisedItems: `, sanitisedItems);
                localStorage.setItem(
                    LOCAL_STORAGE_KEYS.dailyChecklist,
                    JSON.stringify(sanitisedItems)
                );
            }, INPUT_DEBOUNCE_MS),
        []
    );

    // const debounceSave = useMemo(
    //     () =>
    //         debounce(items => {
    //             // TODO: Remove me
    //             console.log(`Saving checklistItems: `, items);
    //             const sanitisedItems = items.map(item => {
    //                 // eslint-disable-next-line no-unused-vars
    //                 const { inputRef, text, ...rest } = item;

    //                 let sanitisedText = sanitiseHtmlString(text);
    //                 if (sanitisedText !== text) {
    //                     inputRef.current.innerHTML = sanitisedText;
    //                 }
    //                 return { ...rest, text: sanitisedText };
    //             });
    //             console.log(`Saving sanitisedItems: `, sanitisedItems);
    //             localStorage.setItem(
    //                 LOCAL_STORAGE_KEYS.dailyChecklist,
    //                 JSON.stringify(sanitisedItems)
    //             );
    //         }, INPUT_DEBOUNCE_MS),
    //     []
    // );

    useEffect(() => {
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
            };

            // Create a new array with the new item inserted at the correct position
            const newItems = items.toSpliced(index + 1, 0, newItem);
            if (focus) {
                setTimeout(() => newItem.inputRef.current?.focus?.(), 0);
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

            const editor = newItems[index - 1]?.inputRef?.current;
            if (index > 0 && editor) {
                // Remove the current line
                newItems = newItems.filter(item => item.id !== id);
                // Add the current line's text to the editor on the previous
                // line
                editor.insertAdjacentHTML("beforeend", text);
                newItems[index - 1].text += text;

                if (focus) {
                    // Create a new range
                    const range = document.createRange();
                    const selection = window.getSelection();

                    // Find the last child node
                    let lastChild = editor.lastChild;

                    if (text) {
                        // Set the range to the start of the newly added content
                        if (lastChild.nodeType === Node.TEXT_NODE) {
                            range.setStart(lastChild, 0);
                        } else {
                            range.setStart(lastChild.firstChild, 0);
                        }
                        range.collapse(true);

                        // Clear any existing selections and set the new range
                        selection.removeAllRanges();
                        selection.addRange(range);
                    } else {
                        // If the last child is an element, navigate to its last child
                        if (lastChild?.nodeType === Node.ELEMENT_NODE) {
                            lastChild = lastChild.lastChild;
                        }

                        // Set the range to the end of the last child node
                        range.setStart(
                            lastChild || editor,
                            lastChild?.nodeValue
                                ? lastChild.nodeValue.length
                                : 0
                        );
                        range.collapse(true);

                        // Clear any existing selections and set the new range
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }

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
                    />
                ))}
            </div>
        </div>
    );
};

export default DailyChecklist;
