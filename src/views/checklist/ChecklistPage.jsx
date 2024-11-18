import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "./checklist-page.module.scss";

import { EditorGroup } from "@/components/editor/EditorGroup";
import { LOCAL_STORAGE_KEYS } from "@/utils/constants";

const ChecklistPage = () => {
    return (
        <div
            className={`${globalStyles.centeredContent} ${styles.pageWrapper}`}
        >
            <EditorGroup
                localStorageKey={LOCAL_STORAGE_KEYS.dailyChecklist}
                placeholder="To-do daily"
            />
        </div>
    );
};

export default ChecklistPage;
