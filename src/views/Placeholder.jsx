import { useMemo } from "react";
import { Helmet } from "react-helmet";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import { useColorScheme } from "@/utils/color-scheme-provider";
import { getTitle } from "@/utils/util";

const Placeholder = () => {
    const { body: bodyColor } = useColorScheme();
    const title = useMemo(() => getTitle("Placeholder"), []);
    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div className={`${globalStyles.pageContent}`}>
                <h1 style={{ color: bodyColor }}>Placeholder</h1>
            </div>
        </>
    );
};

export default Placeholder;
