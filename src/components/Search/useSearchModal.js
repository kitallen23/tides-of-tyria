import { useContext } from "react";
import { SearchModalContext } from "./SearchModalContext";

/**
 * Custom hook to use SearchModalContext
 */
const useSearchModal = () => {
    const context = useContext(SearchModalContext);
    if (!context) {
        throw new Error(
            "useSearchModal must be used within a SearchModalProvider"
        );
    }
    return context;
};

export default useSearchModal;
