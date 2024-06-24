import { DoneSharp, RestartAltSharp } from "@mui/icons-material";
import {
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import { useTheme } from "@/utils/theme-provider";

const OptionsMenu = ({ onClose, ...rest }) => {
    const { colors } = useTheme();
    return (
        <Menu
            id="event-options-menu"
            onClose={onClose}
            MenuListProps={{ dense: true }}
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
            <Divider />
            <MenuItem onClick={onClose}>
                <ListItemText inset>Hightlight past events</ListItemText>
            </MenuItem>
            <MenuItem onClick={onClose}>
                <ListItemText inset>Hightlight upcoming events</ListItemText>
            </MenuItem>
            <MenuItem onClick={onClose}>
                <ListItemText inset>Hightlight all events</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={onClose}>
                <ListItemIcon>
                    <RestartAltSharp />
                </ListItemIcon>
                <ListItemText>Reset completed</ListItemText>
            </MenuItem>
        </Menu>
    );
};

export default OptionsMenu;
