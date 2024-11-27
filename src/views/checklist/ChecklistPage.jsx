import { AddSharp, TaskAltSharp } from "@mui/icons-material";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "./checklist-page.module.scss";
import ChecklistGroup from "@/components/editor/ChecklistGroup";
import useChecklistPage from "./useChecklistPage";
import classNames from "classnames";
import { Button } from "@mui/material";

const ChecklistPage = () => {
    const {
        todoChecklistItems,
        setTodoChecklistItems,
        addTodoChecklistItem,

        dailyChecklistItems,
        timeUntilDailyReset,
        setDailyChecklistItems,
        addDailyChecklistItem,

        weeklyChecklistItems,
        timeUntilWeeklyReset,
        setWeeklyChecklistItems,
        addWeeklyChecklistItem,
    } = useChecklistPage();

    return (
        <div
            className={`${globalStyles.centeredContent} ${styles.pageWrapper}`}
        >
            {/* Todo checklist */}
            <div className={styles.group}>
                <div className={styles.headingRow}>
                    <div className={styles.heading}>
                        <h3>
                            <TaskAltSharp style={{ marginRight: "0.25rem" }} />
                            To-Do List
                        </h3>
                    </div>
                    {todoChecklistItems.length === 0 ? (
                        <Button
                            variant="text"
                            sx={{ minWidth: 0, padding: "4px 6px" }}
                            color="muted"
                            onClick={addTodoChecklistItem}
                        >
                            <AddSharp sx={{ fontSize: "1.17em" }} />
                        </Button>
                    ) : null}
                </div>
                <ChecklistGroup
                    checklistItems={todoChecklistItems}
                    setChecklistItems={setTodoChecklistItems}
                    placeholder="To-do"
                />
            </div>

            {/* Daily checklist */}
            <div className={styles.group}>
                <div className={styles.headingRow}>
                    <div className={styles.heading}>
                        <h3>
                            <TaskAltSharp style={{ marginRight: "0.25rem" }} />
                            Daily Checklist
                        </h3>
                        <span
                            className={classNames(
                                styles.resetIndicator,
                                globalStyles.hideBelowMd
                            )}
                        >
                            &nbsp;| resets in {timeUntilDailyReset}
                        </span>
                    </div>
                    {dailyChecklistItems.length === 0 ? (
                        <Button
                            variant="text"
                            sx={{ minWidth: 0, padding: "4px 6px" }}
                            color="muted"
                            onClick={addDailyChecklistItem}
                        >
                            <AddSharp sx={{ fontSize: "1.17em" }} />
                        </Button>
                    ) : null}
                </div>
                <ChecklistGroup
                    checklistItems={dailyChecklistItems}
                    setChecklistItems={setDailyChecklistItems}
                    placeholder="To-do daily"
                />
            </div>

            {/* Weekly checklist */}
            <div className={styles.group}>
                <div className={styles.headingRow}>
                    <div className={styles.heading}>
                        <h3>
                            <TaskAltSharp style={{ marginRight: "0.25rem" }} />
                            Weekly Checklist
                        </h3>
                        <span
                            className={classNames(
                                styles.resetIndicator,
                                globalStyles.hideBelowMd
                            )}
                        >
                            &nbsp;| resets in {timeUntilWeeklyReset}
                        </span>
                    </div>
                    {weeklyChecklistItems.length === 0 ? (
                        <Button
                            variant="text"
                            sx={{ minWidth: 0, padding: "4px 6px" }}
                            color="muted"
                            onClick={addWeeklyChecklistItem}
                        >
                            <AddSharp sx={{ fontSize: "1.17em" }} />
                        </Button>
                    ) : null}
                </div>
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
