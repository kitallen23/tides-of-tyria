import DOMPurify from "dompurify";

// Utility function to merge redundant adjacent tags and remove empty tags
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

export function sanitizeRichText(dirty) {
    // console.info(`dirty: `, dirty);
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

    // console.info(`clean: `, clean);
    return clean;
}

export function setCursorAtOffset(ref, offset) {
    if (!ref.current) return;

    const element = ref.current;
    const selection = window.getSelection();
    const range = document.createRange();

    let charCount = 0;
    let nodeStack = [element];
    let node,
        found = false;

    while (nodeStack.length > 0 && !found) {
        node = nodeStack.pop();

        if (node.nodeType === Node.TEXT_NODE) {
            const nextCharCount = charCount + node.textContent.length;

            if (nextCharCount >= offset) {
                range.setStart(node, offset - charCount);
                found = true;
            } else {
                charCount = nextCharCount;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
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
    element.focus();
}

export function getDecodedLengthWithBr(htmlString) {
    const div = document.createElement("div");
    div.innerHTML = htmlString;

    // Count the number of <br> tags
    const brCount = div.querySelectorAll("br").length;

    // Calculate the length of text content and add the number of <br> tags
    return div.textContent.length + brCount;
}
