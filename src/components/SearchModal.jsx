import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, InputAdornment, Modal, OutlinedInput } from "@mui/material";
import classNames from "classnames";

import { useTheme } from "@/utils/theme-provider";
import styles from "@/components/Modal/modal.module.scss";

const SearchModal = ({
    style = {},
    className = "",
    open,
    onClose,
    ...rest
}) => {
    const { colors } = useTheme();
    const inputRef = useRef(null);
    const [searchValue, setSearchValue] = useState("");

    const _style = useMemo(
        () =>
            colors
                ? {
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      maxWidth: 768,
                      width: "100%",
                      bgcolor: colors.menu,
                      border: `2px solid ${colors.primary}`,
                      borderRadius: "8px",
                      boxShadow: 24,
                      outline: "none",
                      ...style,
                  }
                : undefined,
        [style, colors]
    );

    const _onClose = useCallback(() => {
        setSearchValue("");
        onClose();
    }, [onClose]);

    useEffect(() => {
        const handleKeydown = event => {
            if (event.key === "Escape") {
                _onClose();
            }
        };

        document.addEventListener("keydown", handleKeydown);
        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, [_onClose]);

    const handleChange = event => {
        let value = event.target.value;
        setSearchValue(value);
    };

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [open]);

    return (
        <Modal
            open={open}
            className={classNames(styles.modal, className)}
            onClose={_onClose}
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
                {open ? (
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
                    />
                ) : null}
            </Box>
        </Modal>
    );
};

export default SearchModal;
