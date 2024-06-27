import { useState } from "react";
import {
    DoneSharp,
    EditSharp,
    FullscreenExitSharp,
    FullscreenSharp,
    RestartAltSharp,
    VisibilityOffSharp,
    VisibilitySharp,
} from "@mui/icons-material";
import {
    Button,
    Divider,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Menu,
    MenuItem,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { toast } from "react-hot-toast";

import { useTheme } from "@/utils/theme-provider";
import styles from "@/styles/modules/event-timer.module.scss";
import Modal from "@/components/Modal";
import { HIGHLIGHT_SCHEMES, UPCOMING_MINS } from "../utils";

const OptionsMenu = ({
    onClose,
    onReset,
    isTimerCollapsed,
    toggleIsTimerCollapsed,
    highlightScheme,
    onHighlightSchemeChange,
    showCompleted,
    toggleShowCompleted,
    ...rest
}) => {
    const { colors } = useTheme();
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const isSmallScreen = useMediaQuery("(max-width: 768px)");

    const onResetClick = () => {
        setIsResetModalOpen(true);
        onClose();
    };

    const _onReset = () => {
        onReset();
        toast.success("All events marked as incomplete.");
        setIsResetModalOpen(false);
    };

    const onCollapsedClick = () => {
        toggleIsTimerCollapsed();
        onClose();
    };
    const onShowCompletedClick = () => {
        toggleShowCompleted();
        onClose();
    };

    return (
        <>
            <Menu
                id="event-options-menu"
                onClose={onClose}
                MenuListProps={{ dense: true }}
                className={styles.eventOptionsMenu}
                {...rest}
            >
                <MenuItem onClick={onShowCompletedClick}>
                    <ListItemIcon>
                        {showCompleted ? (
                            <VisibilityOffSharp />
                        ) : (
                            <VisibilitySharp />
                        )}
                    </ListItemIcon>
                    <ListItemText>
                        <Typography variant="inherit" noWrap>
                            {showCompleted
                                ? "Hide completed"
                                : "Show completed"}

                            {isSmallScreen ? null : (
                                <>
                                    &nbsp;&nbsp;
                                    <span style={{ color: colors.muted }}>
                                        <code>H</code>
                                    </span>
                                </>
                            )}
                        </Typography>
                    </ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={onCollapsedClick}
                    className={styles.eventOptions__fullscreenOption}
                >
                    <ListItemIcon>
                        {isTimerCollapsed ? (
                            <FullscreenSharp />
                        ) : (
                            <FullscreenExitSharp />
                        )}
                    </ListItemIcon>
                    <ListItemText>
                        <Typography variant="inherit" noWrap>
                            {isTimerCollapsed
                                ? "Expand to full width"
                                : "Fit to content width"}
                            {isSmallScreen ? null : (
                                <>
                                    &nbsp;&nbsp;
                                    <span style={{ color: colors.muted }}>
                                        <code>F</code>
                                    </span>
                                </>
                            )}
                        </Typography>
                    </ListItemText>
                </MenuItem>
                <Divider />
                <ListSubheader
                    sx={{
                        lineHeight: "1.43",
                        backgroundColor: "transparent",
                        paddingTop: 0.5,
                        paddingBottom: 0.5,
                    }}
                >
                    Highlight scheme
                    {isSmallScreen ? null : (
                        <>
                            &nbsp;&nbsp;
                            <code>S</code>
                        </>
                    )}
                </ListSubheader>
                <MenuItem
                    onClick={() =>
                        onHighlightSchemeChange(HIGHLIGHT_SCHEMES.upcoming)
                    }
                >
                    {highlightScheme === HIGHLIGHT_SCHEMES.upcoming ? (
                        <ListItemIcon>
                            <DoneSharp />
                        </ListItemIcon>
                    ) : null}
                    <ListItemText
                        inset={highlightScheme !== HIGHLIGHT_SCHEMES.upcoming}
                    >
                        <Typography variant="inherit" noWrap>
                            Highlight current & upcoming events ({UPCOMING_MINS}{" "}
                            mins)
                        </Typography>
                    </ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        onHighlightSchemeChange(HIGHLIGHT_SCHEMES.future)
                    }
                >
                    {highlightScheme === HIGHLIGHT_SCHEMES.future ? (
                        <ListItemIcon>
                            <DoneSharp />
                        </ListItemIcon>
                    ) : null}
                    <ListItemText
                        inset={highlightScheme !== HIGHLIGHT_SCHEMES.future}
                    >
                        <Typography variant="inherit" noWrap>
                            Highlight all current & future events
                        </Typography>
                    </ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        onHighlightSchemeChange(HIGHLIGHT_SCHEMES.all)
                    }
                >
                    {highlightScheme === HIGHLIGHT_SCHEMES.all ? (
                        <ListItemIcon>
                            <DoneSharp />
                        </ListItemIcon>
                    ) : null}
                    <ListItemText
                        inset={highlightScheme !== HIGHLIGHT_SCHEMES.all}
                    >
                        <Typography variant="inherit" noWrap>
                            Highlight all events
                        </Typography>
                    </ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={onClose}>
                    <ListItemIcon>
                        <EditSharp />
                    </ListItemIcon>
                    <ListItemText>
                        <Typography variant="inherit" noWrap>
                            Edit list
                        </Typography>
                    </ListItemText>
                </MenuItem>
                <MenuItem onClick={onResetClick}>
                    <ListItemIcon>
                        <RestartAltSharp />
                    </ListItemIcon>
                    <ListItemText>
                        <Typography variant="inherit" noWrap>
                            Reset completed
                        </Typography>
                    </ListItemText>
                </MenuItem>
            </Menu>
            <Modal
                open={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                closeButton={true}
                style={{ maxWidth: 350 }}
            >
                <div className={styles.eventOptionsMenuModal}>
                    <h3>Reset completed events</h3>
                    <p style={{ textAlign: "center" }}>
                        Are you sure you wish to reset all completed events?
                    </p>
                    <div style={{ textAlign: "center" }}>
                        <Button variant="contained" onClick={_onReset}>
                            Yes, reset them
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default OptionsMenu;
