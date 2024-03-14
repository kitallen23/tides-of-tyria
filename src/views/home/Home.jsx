import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "@/styles/modules/home.module.scss";
import {
    ChevronLeftSharp,
    ChevronRightSharp,
    HourglassTopSharp,
} from "@mui/icons-material";
import EventTimers from "./EventTimers";
import { useState } from "react";
import { Button } from "@mui/material";

const Home = () => {
    const [offset, setOffset] = useState(0);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.group}>
                <div className={globalStyles.centeredContent}>
                    <div className={styles.headingRow}>
                        <h3 className={styles.heading}>
                            <HourglassTopSharp
                                style={{ marginRight: "0.25rem" }}
                            />
                            Event Timers
                        </h3>
                        <div className={styles.buttonGroup}>
                            <Button
                                variant="text"
                                sx={{ minWidth: 0 }}
                                color="muted"
                                onClick={() => setOffset(offset - 1)}
                            >
                                <ChevronLeftSharp />
                            </Button>
                            <Button
                                variant="text"
                                sx={{ minWidth: 0 }}
                                color="muted"
                                onClick={() => setOffset(offset + 1)}
                            >
                                <ChevronRightSharp />
                            </Button>
                        </div>
                    </div>
                </div>
                <EventTimers offset={offset} />
            </div>
        </div>
    );
};

export default Home;
