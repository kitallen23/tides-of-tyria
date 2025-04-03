import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, InputAdornment, Modal, OutlinedInput } from "@mui/material";
import classNames from "classnames";

import { useTheme } from "@/utils/theme-provider";
import styles from "@/components/Modal/modal.module.scss";
import useGlobalHotkeys from "@/utils/hooks/useGlobalHotkeys";
import useSearchModal from "./useSearchModal";

/**
 * Generates a Guild Wars 2 wiki search URL for the given search term.
 *
 * @param {string} searchTerm - The term to search for.
 * @returns {string} The complete search URL.
 */
const generateWikiSearchURL = searchTerm => {
    const baseUrl = "https://wiki.guildwars2.com/index.php?search=";
    const encodedSearch = encodeURIComponent(searchTerm).replace(/%20/g, "+");
    return `${baseUrl}${encodedSearch}`;
};

const SearchModal = ({ style = {}, className = "", ...rest }) => {
    const { colors } = useTheme();
    const inputRef = useRef(null);
    const [searchValue, setSearchValue] = useState("");
    const { isOpen, onOpen: _onOpen, onClose: _onClose } = useSearchModal();

    const onOpen = event => {
        event.preventDefault();
        _onOpen(event);
    };

    useGlobalHotkeys({
        "/": onOpen,
    });

    const _style = useMemo(
        () =>
            colors
                ? {
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(calc(-50% - 1em), -50%)",
                      maxWidth: `calc(768px - 2em)`,
                      width: `calc(100% - 2em)`,
                      bgcolor: colors.menu,
                      border: `2px solid ${colors.primary}`,
                      borderRadius: "8px",
                      boxShadow: 24,
                      outline: "none",
                      margin: "0 1em",
                      ...style,
                  }
                : undefined,
        [style, colors]
    );

    const onClose = useCallback(() => {
        setSearchValue("");
        _onClose();
    }, [_onClose]);

    useEffect(() => {
        const handleKeydown = event => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeydown);
        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, [onClose]);

    const handleChange = event => {
        let value = event.target.value;
        setSearchValue(value);
    };

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [isOpen]);

    const handleKeyDown = event => {
        if (event.key === "Enter") {
            const wikiUrl = generateWikiSearchURL(searchValue);
            window.open(wikiUrl, "_blank", "noopener,noreferrer");
            onClose();
        }
    };

    return (
        <Modal
            open={isOpen}
            className={classNames(styles.modal, className)}
            onClose={onClose}
            disableEscapeKeyDown={true}
            slotProps={{
                backdrop: {
                    style: {
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                    },
                },
            }}
            {...rest}
        >
            <Box sx={_style}>
                {isOpen ? (
                    <OutlinedInput
                        inputRef={inputRef}
                        id="theme-primary-color"
                        value={searchValue}
                        size="small"
                        onChange={handleChange}
                        startAdornment={
                            <InputAdornment
                                position="start"
                                sx={{ color: colors.muted }}
                                onClick={() => inputRef.current?.focus()}
                            >
                                /wiki
                            </InputAdornment>
                        }
                        // autoFocus
                        sx={{
                            width: "100%",
                            border: "none",
                            backgroundColor: "transparent",
                            fontSize: "1.6em",
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                        }}
                        onKeyDown={handleKeyDown}
                        aria-label="Search Guild Wars 2 Wiki"
                    />
                ) : null}
            </Box>
        </Modal>
    );
};

export default SearchModal;
