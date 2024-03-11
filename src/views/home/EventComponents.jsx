import { useMemo } from "react";
import { addMinutes, format } from "date-fns";
import styles from "@/styles/modules/event-timer.module.scss";
import globalStyles from "@/styles/modules/global-styles.module.scss";

import { useTheme } from "@/utils/theme-provider";
import { isLight } from "@/utils/util";

export const TimeRow = ({ currentTimeBlockStart }) => {
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
            <div className={styles.timeRowInnerWrapper}>
                <div>
                    <div className={styles.timeMarker} />
                    <div className={styles.timeLabel}>
                        {format(currentTimeBlockStart, formatString)}
                    </div>
                </div>
                <div>
                    <div className={styles.timeMarker} />
                </div>
                <div>
                    <div className={styles.timeMarker} />
                    <div className={styles.timeLabel}>
                        {format(
                            addMinutes(currentTimeBlockStart, 30),
                            formatString
                        )}
                    </div>
                </div>
                <div>
                    <div className={styles.timeMarker} />
                </div>
                <div>
                    <div className={styles.timeMarker} />
                    <div className={styles.timeLabel}>
                        {format(
                            addMinutes(currentTimeBlockStart, 60),
                            formatString
                        )}
                    </div>
                </div>
                <div>
                    <div className={styles.timeMarker} />
                </div>
                <div>
                    <div className={styles.timeMarker} />
                    <div className={styles.timeLabel}>
                        {format(
                            addMinutes(currentTimeBlockStart, 90),
                            formatString
                        )}
                    </div>
                </div>
                <div>
                    <div className={styles.timeMarker} />
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
    const isBackgroundLight = useMemo(
        () => isLight(eventBackground),
        [eventBackground]
    );

    return (
        <div
            className={`${styles.area} ${
                isBackgroundLight
                    ? globalStyles.textDark
                    : globalStyles.textLight
            }`}
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
