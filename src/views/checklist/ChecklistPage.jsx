import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "./checklist-page.module.scss";
import { EditorProvider } from "@/utils/editor-provider";

import { TestChecklist } from "./TestChecklist";

const ChecklistPage = () => {
    return (
        <div
            className={`${globalStyles.centeredContent} ${styles.pageWrapper}`}
        >
            <EditorProvider>
                <TestChecklist />
                {/* <DailyChecklist /> */}
            </EditorProvider>
        </div>
    );
};

export default ChecklistPage;
