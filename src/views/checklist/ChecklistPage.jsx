import InlineEditor from "@/components/editor/InlineEditor";
import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "@/styles/modules/checklist.module.scss";
import { ChecklistSharp } from "@mui/icons-material";

const DEFAULT =
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Interdum vulputate purus praesent feugiat fermentum facilisi quam. Cursus ac hendrerit semper primis; hac parturient velit. Sed id etiam pharetra suscipit mauris elit. Conubia nullam sed id orci in finibus felis nisi mauris. Feugiat molestie dictum neque; nulla gravida turpis! Et placerat accumsan vehicula proin tristique nibh. Mollis neque curae sem sapien leo enim; nisl ultrices. Montes proin phasellus mattis nam scelerisque volutpat netus. Fringilla primis nascetur, eleifend sollicitudin nisl morbi erat.";

const ChecklistPage = () => {
    return (
        <div
            className={`${globalStyles.centeredContent} ${styles.pageWrapper}`}
        >
            <div className={styles.group}>
                <h3 className={styles.heading}>
                    <ChecklistSharp style={{ marginRight: "0.25rem" }} />
                    Daily Checklist
                </h3>
                <div>
                    <InlineEditor defaultValue={DEFAULT} />
                </div>
            </div>
        </div>
    );
};

export default ChecklistPage;
