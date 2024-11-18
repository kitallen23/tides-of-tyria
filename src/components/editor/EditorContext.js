import { createContext, useContext } from "react";
export const EditorContext = createContext();
const useEditorContext = editorRef => {
    const context = useContext(EditorContext);

    if (!context) {
        throw new Error(
            "useEditorContext must be used within an EditorProvider."
        );
    }

    const { activeEditor, ...rest } = context;

    return {
        isActiveEditor: activeEditor === editorRef?.current,
        ...rest,
    };
};
export default useEditorContext;
