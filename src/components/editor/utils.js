export const moveCursorToEditor = (ref, x) => {
    const targetEditor = ref.current;
    targetEditor.focus();

    const range = document.createRange();
    const selection = window.getSelection();

    let lastLineTop = -1;
    const lastLineRects = [];

    targetEditor.childNodes.forEach(node => {
        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(node);

        const rects = Array.from(nodeRange.getClientRects());
        rects.forEach(rect => {
            if (rect.top > lastLineTop) {
                lastLineTop = rect.top;
                // Clear previous rects, as we found a new line
                lastLineRects.length = 0;
                lastLineRects.push({ node, rect });
            } else if (rect.top === lastLineTop) {
                lastLineRects.push({ node, rect });
            }
        });
    });

    if (lastLineRects.length > 0) {
        let found = false;

        const lastIndex = lastLineRects.length - 1;
        let currentIndex = 0;
        for (const { node, rect } of lastLineRects) {
            const isLastIteration = currentIndex === lastIndex;
            if ((x >= rect.left && x <= rect.right) || isLastIteration) {
                const charIndex = getCharacterIndexAtX(node, x, rect);
                if (isLastIteration && x > rect.right) {
                    found = false;
                    break;
                }
                currentIndex++;
                if (charIndex !== -1) {
                    setCursorAtCharacterIndex(node, charIndex, range);
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            const lastNode = lastLineRects[lastLineRects.length - 1].node;
            range.selectNodeContents(lastNode);
            range.collapse(false);
        }
    } else {
        range.selectNodeContents(targetEditor);
        range.collapse(false);
    }

    selection.removeAllRanges();
    selection.addRange(range);
};

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
