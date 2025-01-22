import classNames from "classnames";
import { Skeleton } from "@mui/material";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "./skeleton-page.module.scss";

const NUM_COLOR_SCHEMES = 9;

const SkeletonEventTimerPage = () => (
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
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                }}
            >
                {Array.from({ length: NUM_COLOR_SCHEMES }).map((_, i) => (
                    <Skeleton
                        key={i}
                        variant="text"
                        height="45px"
                        sx={{ transform: "unset" }}
                    />
                ))}
            </div>
        </div>
    </div>
);

export default SkeletonEventTimerPage;
