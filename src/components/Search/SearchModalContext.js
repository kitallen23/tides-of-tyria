import { createContext } from "react";

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
