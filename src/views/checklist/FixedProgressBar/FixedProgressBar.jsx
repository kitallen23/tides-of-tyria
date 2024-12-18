import { useMemo } from "react";
import classNames from "classnames";

import styles from "./fixed-progress-bar.module.scss";

const FixedProgressBar = ({ checklistItems, position, color }) => {
    const numCompleted = useMemo(
        () =>
            checklistItems?.filter(
                item => item?.type !== "text" && item.isComplete
            ).length || 0,
        [checklistItems]
    );
    const numTotal = useMemo(
        () =>
            (checklistItems || []).filter(item => item?.type !== "text")
                .length || 0,
        [checklistItems]
    );
    const percentageComplete = useMemo(
        () => (numTotal ? (numCompleted / numTotal) * 100 : 0),
        [numCompleted, numTotal]
    );

    return (
        <>
            <div
                className={classNames(styles.progressBar, {
                    [styles.left]: position === "left",
                })}
            >
                <div
                    className={styles.bar}
                    style={{
                        height: `${percentageComplete}%`,
                        background: color,
                    }}
                >
                    <div className={styles.progressText}>
                        <div className={styles.text}>
                            {numCompleted} / {numTotal}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FixedProgressBar;
