import { useRef, useState } from "react";
import { Button } from "@mui/material";
import Editor from "@/components/editor/Editor/Editor";
import DOMPurify from "dompurify";

// This one has some broken HTML for testing
// const TEMP_VALUE = `[{"text":"Hello, <b>wo</b>","isComplete":false,"id":"Na6rkc","indentLevel":0},{"text":"<b>rld</b>","isComplete":false,"id":"Z9clUU","indentLevel":0},{"text":"<b></b>Test 3","isComplete":false,"id":"2HTcnd","indentLevel":0}]`;

const TEMP_VALUE = `[{"text":"Hello, <b>wo</b>","isComplete":false,"id":"Na6rkc","indentLevel":0},{"text":"<b>rld</b>","isComplete":false,"id":"Z9clUU","indentLevel":0},{"text":"<a rel='noopener noreferrer' target='_blank' href='https://google.com'>Hello</a> 3","isComplete":false,"id":"2HTcnd","indentLevel":0}]`;

export const TestChecklist = () => {
    const editorRef = useRef(null);
    const [lines] = useState(JSON.parse(TEMP_VALUE));

    // TODO: Remove me
    const logContent = () => {
        const content = editorRef.current.innerHTML;
        const sanitizedContent = DOMPurify.sanitize(content, {
            ALLOWED_TAGS: ["b", "i", "u", "div", "a"],
            ALLOWED_ATTR: ["class", "href", "rel", "target"],
        });
        // TODO: Remove me
        console.info(`content: `, content);
        console.info(`sanitizedContent: `, sanitizedContent);
    };

    return (
        <div>
            <Editor ref={editorRef} lines={lines} />
            <Button onClick={logContent} sx={{ width: "100%" }}>
                Log content
            </Button>
        </div>
    );
};
