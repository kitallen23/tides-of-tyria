import { createContext, useState } from "react";

/**
 * @typedef {Object} SearchModalContextProps
 * @property {boolean} isOpen
 * @property {() => void} onOpen
 * @property {() => void} onClose
 */

/** @type {React.Context<SearchModalContextProps>} */
export const SearchModalContext = createContext({
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
});

/**
 * Provider for SearchModalContext
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const SearchModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

    return (
        <SearchModalContext.Provider value={{ isOpen, onOpen, onClose }}>
            {children}
        </SearchModalContext.Provider>
    );
};
