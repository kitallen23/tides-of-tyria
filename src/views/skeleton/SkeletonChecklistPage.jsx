import classNames from "classnames";
import { Skeleton } from "@mui/material";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "./skeleton-page.module.scss";

const SkeletonChecklistPage = () => (
    <div
        className={classNames(
            globalStyles.centeredContent,
            styles.pageWrapper,
            styles.checklist
        )}
    >
        <div className={styles.group}>
            <h3 style={{ width: "100%", maxWidth: "250px" }}>
                <Skeleton variant="text" width="100%" />
            </h3>
            <div style={{ marginLeft: "1.7em" }}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        variant="text"
                        width={`${Math.floor(Math.random() * 31) + 30}%`}
                    />
                ))}
            </div>
        </div>
        <div className={styles.group}>
            <div className={styles.headingRow}>
                <div className={styles.heading}>
                    <h3 style={{ width: "100%", maxWidth: "250px" }}>
                        <Skeleton variant="text" width="100%" />
                    </h3>
                </div>
            </div>
            <div style={{ marginLeft: "1.7em" }}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        variant="text"
                        width={`${Math.floor(Math.random() * 31) + 30}%`}
                    />
                ))}
            </div>
        </div>
    </div>
);

export default SkeletonChecklistPage;
