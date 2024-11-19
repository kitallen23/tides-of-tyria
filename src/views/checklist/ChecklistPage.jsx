import { TaskAltSharp } from "@mui/icons-material";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "./checklist-page.module.scss";
import ChecklistGroup from "@/components/editor/ChecklistGroup";
import useChecklistPage from "./useChecklistPage";
import { useTheme } from "@/utils/theme-provider";

const ChecklistPage = () => {
    const { colors } = useTheme();
    const { dailyChecklistItems, setDailyChecklistItems, timeUntilDailyReset } =
        useChecklistPage();

    return (
        <div
            className={`${globalStyles.centeredContent} ${styles.pageWrapper}`}
        >
            <div className={styles.group}>
                <h3 className={styles.heading}>
                    <TaskAltSharp style={{ marginRight: "0.25rem" }} />
                    Daily Checklist
                    <span
                        style={{
                            color: colors.muted,
                            fontSize: "0.85em",
                            fontWeight: "normal",
                        }}
                        className={globalStyles.hideBelowMd}
                    >
                        &nbsp;| resets in {timeUntilDailyReset}
                    </span>
                </h3>
                <ChecklistGroup
                    checklistItems={dailyChecklistItems}
                    setChecklistItems={setDailyChecklistItems}
                    placeholder="To-do daily"
                />
            </div>
        </div>
    );
};

export default ChecklistPage;
