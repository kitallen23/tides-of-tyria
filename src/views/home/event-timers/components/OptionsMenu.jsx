import { useState } from "react";
import {
    DoneSharp,
    EditSharp,
    FullscreenExitSharp,
    FullscreenSharp,
    RestartAltSharp,
} from "@mui/icons-material";
import {
    Button,
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import { toast } from "react-hot-toast";

import { useTheme } from "@/utils/theme-provider";
import styles from "@/styles/modules/event-timer.module.scss";
import Modal from "@/components/Modal";

const OptionsMenu = ({
    onClose,
    onReset,
    isTimerCollapsed,
    onToggleIsTimerCollapsed,
    ...rest
}) => {
    const { colors } = useTheme();
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

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
        onToggleIsTimerCollapsed();
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
                <MenuItem onClick={onClose}>
                    <ListItemIcon>
                        <DoneSharp />
                    </ListItemIcon>
                    <ListItemText>
                        Hide completed&nbsp;&nbsp;
                        <span style={{ color: colors.muted }}>(H)</span>
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
                        {isTimerCollapsed
                            ? "Expand to full width"
                            : "Fit to content width"}
                        &nbsp;&nbsp;
                        <span style={{ color: colors.muted }}>(F)</span>
                    </ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={onClose}>
                    <ListItemText inset>Hightlight past events</ListItemText>
                </MenuItem>
                <MenuItem onClick={onClose}>
                    <ListItemText inset>
                        Hightlight upcoming events
                    </ListItemText>
                </MenuItem>
                <MenuItem onClick={onClose}>
                    <ListItemText inset>Hightlight all events</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={onClose}>
                    <ListItemIcon>
                        <EditSharp />
                    </ListItemIcon>
                    <ListItemText>Edit list</ListItemText>
                </MenuItem>
                <MenuItem onClick={onResetClick}>
                    <ListItemIcon>
                        <RestartAltSharp />
                    </ListItemIcon>
                    <ListItemText>Reset completed</ListItemText>
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
