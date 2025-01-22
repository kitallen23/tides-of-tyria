import classNames from "classnames";
import { Skeleton } from "@mui/material";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "./skeleton-page.module.scss";

/**
 * Generates `count` random widths that sum to 100%.
 * @param {number} count
 * @returns {number[]}
 */
const generateRandomWidths = count => {
    const minWidth = 15;
    let widths = [];
    let total = minWidth * count;
    let remaining = 100 - total;

    for (let i = 0; i < count - 1; i++) {
        const width =
            Math.floor(Math.random() * (remaining - (count - i - 1))) + 1;
        widths.push(width + minWidth);
        remaining -= width;
    }
    widths.push(remaining + minWidth);
    return widths;
};

const SkeletonEventTimerPage = () => {
    const rows = 6;
    const itemsPerRow = 4;

    return (
        <div
            className={classNames(
                globalStyles.centeredContent,
                styles.pageWrapper,
                styles.eventTimer
            )}
        >
            <div className={styles.group}>
                <h3 style={{ width: "100%", maxWidth: "250px" }}>
                    <Skeleton variant="text" width="100%" />
                </h3>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        marginTop: "25px",
                    }}
                >
                    {Array.from({ length: rows }).map((_, rowIndex) => {
                        const widths = generateRandomWidths(itemsPerRow);
                        return (
                            <div
                                key={rowIndex}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: widths
                                        .map(w => `0.${w}fr`)
                                        .join(" "),
                                    gap: "6px",
                                    width: "100%",
                                }}
                            >
                                {widths.map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        variant="text"
                                        height="41px"
                                        sx={{
                                            transform: "unset",
                                        }}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SkeletonEventTimerPage;
