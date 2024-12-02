import DOMPurify from "dompurify";

/**
 * Moves the cursor to the specified x-coordinate on the last line of an editor.
 *
 * This function focuses the editor and attempts to place the cursor at a specific x-coordinate
 * on the last line of text. If the x-coordinate does not correspond to any character, it places
 * the cursor at the end of the last line.
 *
 * @param {Object} ref - A reference object pointing to the editor DOM element.
 * @param {number} x - The x-coordinate where the cursor should be moved.
 */
export const moveCursorToLastLineOfEditor = (ref, x) => {
    const targetEditor = ref.current;
    targetEditor.focus();

    const range = document.createRange();
    const selection = window.getSelection();

    let lastLineTop = -1;
    const lastLineRects = [];
    let lineChanged = false;

    // Iterate over each child node of the editor to determine the last line
    targetEditor.childNodes.forEach(node => {
        // Exit early if we've moved to a new line
        if (lineChanged) {
            return;
        }
        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(node);

        // Get all rectangles representing the rendered positions of the node
        const rects = Array.from(nodeRange.getClientRects());
        rects.forEach(rect => {
            if (rect.top > lastLineTop) {
                // Found a new line, update lastLineTop and reset lastLineRects
                lastLineTop = rect.top;
                lastLineRects.length = 0;
                lastLineRects.push({ node, rect });
            } else if (rect.top === lastLineTop) {
                // Add rect to lastLineRects if it is on the same line
                lastLineRects.push({ node, rect });
            } else if (rect.top < lastLineTop) {
                lineChanged = true; // Mark that we've moved to a previous line
                return;
            }
        });
    });

    if (lastLineRects.length > 0) {
        let found = false;

        const lastIndex = lastLineRects.length - 1;
        let currentIndex = 0;
        for (const { node, rect } of lastLineRects) {
            const isLastIteration = currentIndex === lastIndex;
            // Check if x is within the current rect or if it's the last
            // iteration
            if ((x >= rect.left && x <= rect.right) || isLastIteration) {
                // Get character index at the x position within the node
                const charIndex = getCharacterIndexAtX(node, x, rect);
                if (isLastIteration && x > rect.right) {
                    found = false;
                    break;
                }
                currentIndex++;
                if (charIndex !== -1) {
                    // Set the cursor at the calculated character index
                    setCursorAtCharacterIndex(node, charIndex, range);
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            // If no suitable position found, put cursor at end of editor
            const lastNode = lastLineRects[lastLineRects.length - 1].node;
            range.selectNodeContents(lastNode);
            range.collapse(false);
        }
    } else {
        // If no rects found, put the cursor at end of editor
        range.selectNodeContents(targetEditor);
        range.collapse(false);
    }

    // Update the selection with the new range
    selection.removeAllRanges();
    selection.addRange(range);

    targetEditor.scrollIntoView({ behaviour: "instant", block: "nearest" });
};

/**
 * Moves the cursor to the specified x-coordinate on the first line of an editor.
 *
 * This function focuses the editor and attempts to place the cursor at a specific x-coordinate
 * on the first line of text. If the x-coordinate does not correspond to any character, it places
 * the cursor at the start of the first line.
 *
 * @param {Object} ref - A reference object pointing to the editor DOM element.
 * @param {number} x - The x-coordinate where the cursor should be moved.
 */

export const moveCursorToFirstLineOfEditor = (ref, x) => {
    const targetEditor = ref.current;
    targetEditor.focus();

    const range = document.createRange();
    const selection = window.getSelection();

    let firstLineTop = Infinity;
    const firstLineRects = [];
    let lineFound = false;

    // Iterate over each child node of the editor to determine the first line
    targetEditor.childNodes.forEach(node => {
        // Exit early if we're on a subsequent line (no need to do anything)
        if (lineFound) {
            return;
        }
        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(node);

        // Get all rectangles representing the rendered positions of the node
        const rects = Array.from(nodeRange.getClientRects());
        rects.forEach(rect => {
            if (rect.top < firstLineTop) {
                // Found a new line, so update firstLineTop and reset
                // firstLineRects
                firstLineTop = rect.top;
                firstLineRects.length = 0;
                firstLineRects.push({ node, rect });
            } else if (rect.top === firstLineTop) {
                // Add rect to firstLineRects if it is on the same line
                firstLineRects.push({ node, rect });
            } else if (rect.top > firstLineTop) {
                lineFound = true; // Mark that we've moved to a new line
                return;
            }
        });
    });

    if (firstLineRects.length > 0) {
        let found = false;

        const lastIndex = firstLineRects.length - 1;
        let currentIndex = 0;
        for (const { node, rect } of firstLineRects) {
            const isLastIteration = currentIndex === lastIndex;
            // Check of x is within the current rect or if it's the last
            // iteration
            if ((x >= rect.left && x <= rect.right) || isLastIteration) {
                // Get character index at the x position within the node
                const charIndex = getCharacterIndexAtX(node, x, rect);
                if (isLastIteration && x > rect.right) {
                    // Place cursor at the end of the last node on the first line
                    const lastNode = firstLineRects[lastIndex].node;
                    range.selectNodeContents(lastNode);
                    range.collapse(false);
                    found = true;
                    break;
                }
                currentIndex++;
                if (charIndex !== -1) {
                    // Set the cursor at the calculated character index
                    setCursorAtCharacterIndex(node, charIndex, range);
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            // If no suitable position found, put cursor at start of editor
            const firstNode = firstLineRects[0].node;
            range.selectNodeContents(firstNode);
            range.collapse(true);
        }
    } else {
        // If no suitable position found, put cursor at start of editor
        range.selectNodeContents(targetEditor);
        range.collapse(true);
    }

    // Update the selection with the new range
    selection.removeAllRanges();
    selection.addRange(range);
    targetEditor.scrollIntoView({ behaviour: "instant", block: "nearest" });
};

/**
 * Determines the character index at a given x-coordinate within a specified line of a DOM node.
 *
 * This function traverses the text content of a DOM node to find the character index that
 * corresponds to a specified x-coordinate within a given line's bounding rectangle.
 *
 * @param {Node} node - The DOM node to search within. This should be an element node containing text.
 * @param {number} x - The x-coordinate to find the character index for.
 * @param {DOMRect} lineRect - The bounding rectangle of the line to consider for the x-coordinate.
 *
 * @returns {number} The character index at the specified x-coordinate, or the closest character index if no exact match is found.
 */
const getCharacterIndexAtX = (node, x, lineRect) => {
    const range = document.createRange();
    let closestIndex = -1;
    let closestDistance = Infinity;

    const traverseNode = (currentNode, offset = 0) => {
        if (currentNode.nodeType === Node.TEXT_NODE) {
            for (let i = 0; i < currentNode.textContent.length; i++) {
                range.setStart(currentNode, i);
                range.setEnd(currentNode, i + 1);
                const rect = range.getBoundingClientRect();

                if (rect.top !== lineRect.top) {
                    continue;
                }

                const distance = Math.abs(x - rect.left);

                if (x >= rect.left && x <= rect.right) {
                    return offset + i;
                } else if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = offset + i;
                }
            }
        } else {
            let childOffset = offset;
            for (let child of currentNode.childNodes) {
                const result = traverseNode(child, childOffset);
                if (result !== -1) {
                    return result;
                }
                childOffset += child.textContent.length;
            }
        }
        return closestIndex;
    };

    return traverseNode(node);
};

/**
 * Moves the cursor to a specified character offset within a DOM element.
 *
 * This function traverses the DOM tree starting from the specified element reference
 * and sets the cursor (caret) position at the specified character offset within the text content.
 *
 * @param {Object} ref - A reference object pointing to the DOM element.
 * @param {number} offset - The character offset where the cursor should be placed.
 */
export function moveCursorToCharacterOffsetOfEditor(ref, offset) {
    if (!ref.current) return;

    const element = ref.current;
    const selection = window.getSelection();
    const range = document.createRange();

    let charCount = 0;
    let nodeStack = [element];
    let node,
        found = false;

    // Traverse the DOM tree in a depth-first manner
    while (nodeStack.length > 0 && !found) {
        node = nodeStack.pop();

        if (node.nodeType === Node.TEXT_NODE) {
            // Calculate the cumulative character count
            const nextCharCount = charCount + node.textContent.length;

            if (nextCharCount >= offset) {
                // If the offset is within this text node, set the start range
                range.setStart(node, offset - charCount);
                found = true;
            } else {
                // Update the charCount if offset is not reached
                charCount = nextCharCount;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Push child nodes onto the stack for further traversal
            for (let i = node.childNodes.length - 1; i >= 0; i--) {
                nodeStack.push(node.childNodes[i]);
            }
        }
    }

    if (found) {
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    // Focus the element to ensure the cursor is visible
    element.focus();
    element.scrollIntoView({ behaviour: "instant", block: "nearest" });
}

/**
 * Sets the cursor at a specified character index within a given DOM node.
 *
 * This function traverses the DOM tree starting from the specified node and
 * sets the cursor (caret) position at the specified character index within
 * the text content of the node.
 *
 * @param {Node} node - The DOM node to start traversal from. This should be an element node.
 * @param {number} charIndex - The character index where the cursor should be placed.
 * @param {Range} range - A Range object that will be used to set the cursor position.
 */
function setCursorAtCharacterIndex(node, charIndex, range) {
    let currentNode = node;
    let currentIndex = 0;

    function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const textLength = node.textContent.length;
            if (currentIndex + textLength >= charIndex) {
                range.setStart(node, charIndex - currentIndex);
                range.collapse(true);
                return true; // Stop traversal
            }
            currentIndex += textLength;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let i = 0; i < node.childNodes.length; i++) {
                if (traverseNodes(node.childNodes[i])) {
                    return true; // Stop traversal
                }
            }
        }
        return false;
    }

    traverseNodes(currentNode);
}

/**
 * Moves the cursor to a specified position within an editor.
 *
 * This function sets the cursor position within a DOM element referenced by `ref`.
 * It can move the cursor to the start or end of the editor's content.
 *
 * @param {Object} ref - A reference object pointing to the editor DOM element.
 * @param {string} [pos="start"] - The position to move the cursor to, either "start" or "end".
 */
export function moveCursorToEditor(ref, pos = "start") {
    const range = document.createRange();
    const selection = window.getSelection();

    if (pos === "start") {
        range.setStart(ref.current, 0);
        range.collapse(true);
    } else {
        range.selectNodeContents(ref.current);
        range.collapse(false);
    }

    selection.removeAllRanges();
    selection.addRange(range);

    ref.current.scrollIntoView({ behaviour: "instant", block: "nearest" });
}

/**
 * Calculates the decoded length of an HTML string, including <br> tags as additional characters.
 *
 * This function creates a temporary DOM element to decode the HTML string and count the number
 * of `<br>` tags. It returns the total length of the text content plus the number of `<br>` tags,
 * treating each `<br>` as a single character.
 *
 * @param {string} htmlString - The HTML string to decode and measure.
 * @returns {number} The length of the decoded text content plus the number of `<br>` tags.
 */
export function getDecodedLengthWithBr(htmlString) {
    const div = document.createElement("div");
    div.innerHTML = htmlString;

    // Count the number of <br> tags
    const brCount = div.querySelectorAll("br").length;

    // Calculate the length of the text content and add the number of <br> tags.
    // Each <br> is considered as an additional character for the length
    // calculation.
    return div.textContent.length + brCount;
}

/**
 * Sanitizes a rich text HTML string by processing and cleaning it.
 *
 * This function first processes the HTML to merge redundant tags and remove empty ones,
 * then sanitizes the processed HTML using DOMPurify to ensure it is safe for use.
 *
 * @param {string} dirty - The dirty HTML string to be sanitized.
 * @returns {string} The sanitized HTML string, containing only allowed tags and attributes.
 *
 * @note This function uses DOMPurify to sanitize the HTML. It allows a limited set of tags
 * (`b`, `u`, `i`, `a`, `br`) and attributes (`href`, `target`, `rel` for `<a>` tags).
 */
export function sanitizeRichText(dirty) {
    // First, process HTML to merge redundant tags and remove empty ones
    const processedHtml = processHtml(dirty);

    // Then, sanitize the processed HTML
    const clean = DOMPurify.sanitize(processedHtml, {
        ALLOWED_TAGS: ["b", "u", "i", "a", "br"],
        ALLOWED_ATTRS: {
            a: ["href", "target", "rel"],
        },
        ADD_ATTR: ["target"],
    });

    // Remove all <br> tags from the end of the string
    let result = clean;
    while (result.endsWith("<br>")) {
        result = result.slice(0, -4).trimEnd();
    }

    return result;
}

/**
 * Processes an HTML string to merge redundant tags and remove empty elements.
 *
 * This function parses the HTML string into a temporary DOM element, then recursively processes
 * its nodes to remove empty elements (except `<br>` tags) and merge consecutive elements of the
 * same type.
 *
 * @param {string} html - The HTML string to be processed.
 * @returns {string} The processed HTML string with redundant tags merged and empty elements removed.
 */
function processHtml(html) {
    // Create a temporary DOM element to parse the HTML string
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Function to recursively process nodes
    function processNodes(node) {
        if (!node || !node.childNodes) return;

        let previousNode = null;

        Array.from(node.childNodes).forEach(childNode => {
            if (childNode.nodeType === Node.ELEMENT_NODE) {
                // Remove the node if it's empty and not a <br> tag
                if (
                    childNode.tagName.toLowerCase() !== "br" &&
                    childNode.innerHTML.trim() === ""
                ) {
                    node.removeChild(childNode);
                    return;
                }

                // If the current node is the same as the previous node, merge them
                if (
                    previousNode &&
                    previousNode.tagName === childNode.tagName &&
                    childNode.tagName.toLowerCase() !== "br"
                ) {
                    previousNode.innerHTML += childNode.innerHTML;
                    node.removeChild(childNode);
                    processNodes(previousNode); // Recursively process within the merged node
                } else {
                    previousNode = childNode;
                    processNodes(childNode); // Recursively check this node's children
                }
            } else {
                previousNode = null; // Reset if it's not an element node
            }
        });
    }

    processNodes(tempDiv);
    return tempDiv.innerHTML;
}

/**
 * Retrieves the minimum and maximum values from an array of numbers.
 *
 * This function takes an array of numbers and returns an object containing the minimum and maximum values.
 *
 * @param {number[]} numbers - An array of numbers from which to determine the minimum and maximum values.
 * @returns {{ min: number, max: number }} An object containing the minimum and maximum numbers.
 */
export function getMinAndMax(numbers) {
    const max = Math.max(...numbers);
    const min = Math.min(...numbers);
    return { min, max };
}
