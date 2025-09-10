import { useTheme } from "@/utils/theme-provider";
import EventTimerContext from "@/views/home/event-timers/EventTimerContext";
import { MenuItem, Select } from "@mui/material";
import { useContext } from "react";

const SPECIAL_EVENTS = {
    none: "None",
    dragon_bash: "Dragon Bash",
    fractal_incursions: "Fractal Incursions",
    halloween: "Halloween",
    labyrinthine_cliffs: "Labyrinthine Cliffs",
};

const CurrentSpecialEventPicker = () => {
    const { colors } = useTheme();
    const { currentSpecialEvent, setCurrentSpecialEvent } =
        useContext(EventTimerContext);

    const handleChange = event => {
        setCurrentSpecialEvent(event.target?.value || "none");
    };

    return (
        <div>
            <Select
                value={currentSpecialEvent || "none"}
                renderValue={value =>
                    `Current special event: ${SPECIAL_EVENTS[value]}`
                }
                size="small"
                sx={{
                    zIndex: 10,
                    "& .MuiSelect-select": {
                        padding: "4px 4px",
                        fontSize: "0.875em",
                        color: colors.muted,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "transparent",
                    },
                    "& .MuiSelect-iconOutlined": {
                        fill: colors.muted,
                    },
                }}
                onChange={handleChange}
            >
                {Object.keys(SPECIAL_EVENTS).map(key => (
                    <MenuItem
                        key={key}
                        value={key}
                        sx={{ fontSize: "0.875em" }}
                        dense={true}
                    >
                        {SPECIAL_EVENTS[key]}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
};

export default CurrentSpecialEventPicker;
