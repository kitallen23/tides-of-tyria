import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "@/styles/modules/settings.module.scss";
import { getTitle } from "@/utils/util";

import SchemeSelector from "./SchemeSelector";
import { PaletteSharp } from "@mui/icons-material";
import { useColorScheme } from "@/utils/color-scheme-provider";

const Settings = () => {
    const title = useMemo(() => getTitle("Settings"), []);
    const { colorScheme: scheme, setColorScheme } = useColorScheme();

    const setScheme = key => {
        if (key) {
            setColorScheme(key);
        }
    };

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div
                className={`${globalStyles.pageContent} ${styles.pageWrapper}`}
            >
                <h3>
                    <PaletteSharp
                        fontSize="inherit"
                        style={{ marginRight: "0.25rem" }}
                    />
                    Theme
                </h3>
                <SchemeSelector scheme={scheme} onChange={setScheme} />
            </div>
        </>
    );
};

export default Settings;
