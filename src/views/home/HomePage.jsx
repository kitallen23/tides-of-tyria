import styles from "./home.module.scss";
import EventTimers from "./event-timers/EventTimers";

const HomePage = () => {
    return (
        <div className={styles.pageWrapper}>
            <EventTimers />
        </div>
    );
};

export default HomePage;
