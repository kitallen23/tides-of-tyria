import { useMemo } from "react";
import { Helmet } from "react-helmet";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import { getTitle } from "@/utils/util";

const Placeholder = () => {
    const title = useMemo(() => getTitle("Placeholder"), []);
    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div className={`${globalStyles.pageContent}`}>
                <h2>Placeholder</h2>
            </div>
        </>
    );
};

export default Placeholder;
