import { useState } from "react";
import {
    DensityMediumSharp,
    DensitySmallSharp,
    DoneSharp,
    EditSharp,
    ExpandSharp,
    FullscreenExitSharp,
    FullscreenSharp,
    HelpTwoTone,
    RestartAltSharp,
    VerticalAlignCenterSharp,
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
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { toast } from "react-hot-toast";

import { useTheme } from "@/utils/theme-provider";
import styles from "../event-timer.module.scss";
import Modal from "@/components/Modal/Modal";
import { HIGHLIGHT_SCHEMES, MODES, UPCOMING_MINS } from "../utils";

const OptionsMenu = ({
    onClose,
    onReset,
    isTimerCollapsed,
    toggleIsTimerCollapsed,
    highlightScheme,
    onHighlightSchemeChange,
    showCompleted,
    toggleShowCompleted,
    setMode,
    denseMode,
    toggleDenseMode,
    groupedMode,
    toggleGroupedMode,
    ...rest
}) => {
    const { colors } = useTheme();
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const isSmallScreen = useMediaQuery("(max-width: 768px)");
    const isTouchDevice = useMediaQuery("(pointer: coarse)");

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
    const onModeClick = () => {
        setMode(MODES.edit);
        onClose();
    };
    const onToggleDenseModeClick = () => {
        toggleDenseMode();
        onClose();
    };
    const onToggleGroupedModeClick = () => {
        toggleGroupedMode();
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
                                ? "Hide completed areas"
                                : "Show completed areas"}

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
                <MenuItem onClick={onToggleDenseModeClick}>
                    <ListItemIcon>
                        {denseMode ? (
                            <DensityMediumSharp />
                        ) : (
                            <DensitySmallSharp />
                        )}
                    </ListItemIcon>
                    <ListItemText>
                        <Typography
                            variant="inherit"
                            noWrap
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5em",
                            }}
                        >
                            {denseMode
                                ? "Disable dense mode"
                                : "Enable dense mode"}
                            {isTouchDevice ? null : (
                                <Tooltip title="Dense mode reduces the height of each event, allowing more events to be displayed on one page.">
                                    <HelpTwoTone
                                        sx={{
                                            fontSize: "1.2em",
                                            color: colors.muted,
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Typography>
                    </ListItemText>
                </MenuItem>
                <MenuItem onClick={onToggleGroupedModeClick}>
                    <ListItemIcon>
                        {groupedMode ? (
                            <ExpandSharp />
                        ) : (
                            <VerticalAlignCenterSharp />
                        )}
                    </ListItemIcon>
                    <ListItemText>
                        <Typography
                            variant="inherit"
                            noWrap
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5em",
                            }}
                        >
                            {groupedMode
                                ? "Disable grouped mode"
                                : "Enable grouped mode"}
                            {isTouchDevice ? null : (
                                <Tooltip title="Grouped mode places non-overlapping events on the same line as each other, where possible.">
                                    <HelpTwoTone
                                        sx={{
                                            fontSize: "1.2em",
                                            color: colors.muted,
                                        }}
                                    />
                                </Tooltip>
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
                <MenuItem onClick={onModeClick}>
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
                        <Button
                            variant="contained"
                            onClick={_onReset}
                            color="error"
                        >
                            Yes, reset them
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default OptionsMenu;
