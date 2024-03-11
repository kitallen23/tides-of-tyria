import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "@/styles/modules/home.module.scss";
import { Helmet } from "react-helmet";

const Home = () => {
    return (
        <>
            <div
                className={`${globalStyles.pageContent} ${styles.pageWrapper}`}
            >
                <div className={styles.group}>
                    <h3 className={styles.heading}>
                        <TextFormatSharp
                            fontSize="inherit"
                            style={{ marginRight: "0.25rem" }}
                        />
                        Font type
                    </h3>
                </div>
            </div>
        </>
    );
};

export default Home;
