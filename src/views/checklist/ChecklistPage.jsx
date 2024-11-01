import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "./checklist-page.module.scss";

import { EditorGroup } from "@/components/editor/EditorGroup";

const ChecklistPage = () => {
    return (
        <div
            className={`${globalStyles.centeredContent} ${styles.pageWrapper}`}
        >
            <EditorGroup />
        </div>
    );
};

export default ChecklistPage;
