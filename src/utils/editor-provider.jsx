import { useState, useEffect } from "react";
import { EditorContext } from "@/components/editor/EditorContext";

export const EditorProvider = ({ children }) => {
    const [activeEditor, setActiveEditor] = useState(null);

    useEffect(() => {
        const handleClickOutside = event => {
            const isToolbarClick = Boolean(
                event.target.closest(".inline-editor-toolbar")
            );
            if (isToolbarClick) {
                return;
            }

            if (activeEditor && !activeEditor.contains(event.target)) {
                setActiveEditor(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activeEditor]);

    return (
        <EditorContext.Provider value={{ activeEditor, setActiveEditor }}>
            {children}
        </EditorContext.Provider>
    );
};
