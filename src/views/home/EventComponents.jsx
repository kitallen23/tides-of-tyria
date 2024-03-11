import { useMemo } from "react";
import { addMinutes, format } from "date-fns";
import styles from "@/styles/modules/event-timer.module.scss";

import { useTheme } from "@/utils/theme-provider";

export const TimeRow = ({ currentTimeBlock }) => {
    const { timeFormat, colors } = useTheme();
    const formatString = useMemo(
        () => (timeFormat === "12h" ? "h:mm" : "H:mm"),
        [timeFormat]
    );

    return (
        <div
            className={styles.timeRow}
            style={{ background: colors.background }}
        >
            <div>
                <div className={styles.timeLabel}>
                    {format(currentTimeBlock, formatString)}
                </div>
            </div>
            <div>
                <div className={styles.timeLabel}>
                    {format(addMinutes(currentTimeBlock, 30), formatString)}
                </div>
            </div>
            <div>
                <div className={styles.timeLabel}>
                    {format(addMinutes(currentTimeBlock, 60), formatString)}
                </div>
            </div>
            <div>
                <div className={styles.timeLabel}>
                    {format(addMinutes(currentTimeBlock, 90), formatString)}
                </div>
            </div>
        </div>
    );
};

const Area = ({ area }) => {
    const { colors } = useTheme();
    const eventBackground = useMemo(
        () => colors[area.color],
        [area.color, colors]
    );

    return (
        <div
            className={styles.area}
            style={{
                background: eventBackground,
            }}
        >
            {area.name}
        </div>
    );
};

const EventRegion = ({ region }) => {
    return (
        <div className={styles.region}>
            {region.sub_areas.map(area => (
                <Area key={area.key} area={area} />
            ))}
        </div>
    );
};

export default EventRegion;
