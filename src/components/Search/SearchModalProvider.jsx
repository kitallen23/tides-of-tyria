import { useState } from "react";
import { SearchModalContext } from "./SearchModalContext";

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
