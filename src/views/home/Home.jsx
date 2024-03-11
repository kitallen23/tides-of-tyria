import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "@/styles/modules/home.module.scss";
import { HourglassTopSharp } from "@mui/icons-material";
import EventTimers from "./EventTimers";

const Home = () => {
    return (
        <>
            <div
                className={`${globalStyles.pageContent} ${styles.pageWrapper}`}
            >
                <div className={styles.group}>
                    <h3 className={styles.heading}>
                        <HourglassTopSharp style={{ marginRight: "0.25rem" }} />
                        Event Timers
                    </h3>
                    <EventTimers />
                </div>
            </div>
        </>
    );
};

export default Home;
