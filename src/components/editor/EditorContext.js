import { createContext, useContext } from "react";
export const EditorContext = createContext();
const useEditorContext = () => useContext(EditorContext);
export default useEditorContext;
