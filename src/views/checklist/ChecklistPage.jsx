import { TaskAltSharp } from "@mui/icons-material";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "./checklist-page.module.scss";
import ChecklistGroup from "@/components/editor/ChecklistGroup";
import useChecklistPage from "./useChecklistPage";
import { useTheme } from "@/utils/theme-provider";

const ChecklistPage = () => {
    const { colors } = useTheme();
    const {
        todoChecklistItems,
        setTodoChecklistItems,

        dailyChecklistItems,
        setDailyChecklistItems,
        timeUntilDailyReset,

        weeklyChecklistItems,
        setWeeklyChecklistItems,
        timeUntilWeeklyReset,
    } = useChecklistPage();

    return (
        <div
            className={`${globalStyles.centeredContent} ${styles.pageWrapper}`}
        >
            {/* Todo checklist */}
            <div className={styles.group}>
                <h3 className={styles.heading}>
                    <TaskAltSharp style={{ marginRight: "0.25rem" }} />
                    To-Do List
                </h3>
                <ChecklistGroup
                    checklistItems={todoChecklistItems}
                    setChecklistItems={setTodoChecklistItems}
                    placeholder="To-do"
                />
            </div>

            {/* Daily checklist */}
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

            {/* Weekly checklist */}
            <div className={styles.group}>
                <h3 className={styles.heading}>
                    <TaskAltSharp style={{ marginRight: "0.25rem" }} />
                    Weekly Checklist
                    <span
                        style={{
                            color: colors.muted,
                            fontSize: "0.85em",
                            fontWeight: "normal",
                        }}
                        className={globalStyles.hideBelowMd}
                    >
                        &nbsp;| resets in {timeUntilWeeklyReset}
                    </span>
                </h3>
                <ChecklistGroup
                    checklistItems={weeklyChecklistItems}
                    setChecklistItems={setWeeklyChecklistItems}
                    placeholder="To-do weekly"
                />
            </div>
        </div>
    );
};

export default ChecklistPage;
