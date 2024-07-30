import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "@/styles/modules/home.module.scss";
import { HourglassTopSharp } from "@mui/icons-material";
import EventTimers from "./event-timers/EventTimers";

const HomePage = () => {
    return (
        <div className={styles.pageWrapper}>
            <EventTimers />
            <div className={styles.group} style={{ display: "initial" }}>
                <div className={globalStyles.centeredContent}>
                    <div className={styles.headingRow}>
                        <h3 className={styles.heading}>
                            <HourglassTopSharp
                                style={{ marginRight: "0.25rem" }}
                            />
                            Scratchpad
                        </h3>
                    </div>
                </div>
                <div
                    className={globalStyles.centeredContent}
                    style={{ display: "grid", gap: "0.25rem" }}
                >
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                    <div className={styles.scratchpadPlaceholder}>
                        <div />
                        <div
                            style={{ width: `${100 + Math.random() * 200}px` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
