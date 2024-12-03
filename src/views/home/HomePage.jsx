import { useState } from "react";
import styles from "./home.module.scss";
import EventTimers from "./event-timers/EventTimers";

import useGlobalHotkeys from "@/utils/hooks/useGlobalHotkeys";
import HelpModal from "./HelpModal";

const HomePage = () => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    useGlobalHotkeys({
        "?": () => setIsHelpModalOpen(true),
    });

    return (
        <>
            <div className={styles.pageWrapper}>
                <EventTimers />
            </div>
            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
            />
        </>
    );
};

export default HomePage;
