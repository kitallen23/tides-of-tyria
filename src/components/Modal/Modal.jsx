import { useEffect, useMemo } from "react";
import { Box, Modal as _Modal } from "@mui/material";
import { ClearSharp } from "@mui/icons-material";
import classNames from "classnames";

import styles from "./modal.module.scss";
import { useTheme } from "@/utils/theme-provider";
import UnstyledButton from "@/components/UnstyledButton";

const Modal = ({
    children,
    style = {},
    closeButton = false,
    className = "",
    onClose,
    ...rest
}) => {
    const { colors } = useTheme();

    const _style = useMemo(
        () =>
            colors
                ? {
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      maxWidth: 250,
                      width: "100%",
                      bgcolor: colors.menu,
                      border: `2px solid ${
                          colors.menu === colors.backgroundNav
                              ? colors.background
                              : colors.backgroundNav
                      }`,
                      borderRadius: "12px",
                      boxShadow: 24,
                      p: 2,
                      outline: "none",
                      ...style,
                  }
                : undefined,
        [style, colors]
    );

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

    return (
        <_Modal
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
            <>
                <Box sx={_style}>
                    {closeButton && onClose ? (
                        <UnstyledButton
                            className={styles.closeButton}
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            <ClearSharp />
                        </UnstyledButton>
                    ) : null}
                    {children}
                </Box>
            </>
        </_Modal>
    );
};

export default Modal;
