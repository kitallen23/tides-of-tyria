import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "@/styles/modules/checklist.module.scss";
import { EditorProvider } from "@/utils/editor-provider";
import DailyChecklist from "./DailyChecklist";

const ChecklistPage = () => {
    return (
        <div
            className={`${globalStyles.centeredContent} ${styles.pageWrapper}`}
        >
            <EditorProvider>
                <DailyChecklist />
            </EditorProvider>
        </div>
    );
};

export default ChecklistPage;
