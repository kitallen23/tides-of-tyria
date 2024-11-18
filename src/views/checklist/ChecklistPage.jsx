import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "./checklist-page.module.scss";

import ChecklistGroup from "@/components/editor/ChecklistGroup";
import useChecklistPage from "./useChecklistPage";

const ChecklistPage = () => {
    const { dailyChecklistItems, setDailyChecklistItems } = useChecklistPage();

    return (
        <div
            className={`${globalStyles.centeredContent} ${styles.pageWrapper}`}
        >
            <ChecklistGroup
                checklistItems={dailyChecklistItems}
                setChecklistItems={setDailyChecklistItems}
                placeholder="To-do daily"
            />
        </div>
    );
};

export default ChecklistPage;
