import { useMemo } from "react";
import { Helmet } from "react-helmet";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "@/styles/modules/settings.module.scss";
import { getTitle } from "@/utils/util";

import SchemeSelector from "./SchemeSelector";
import {
    FormatColorFillSharp,
    FormatSizeSharp,
    TextFormatSharp,
} from "@mui/icons-material";
import { useTheme } from "@/utils/theme-provider";
import { Button } from "@mui/material";

const Settings = () => {
    const title = useMemo(() => getTitle("Settings"), []);
    const {
        colorScheme: scheme,
        fontType,
        fontSize,
        setThemeKey,
        setFontType,
        setFontSize,
    } = useTheme();

    const setScheme = key => {
        if (key) {
            setThemeKey(key);
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
                <div className={styles.settingGroup}>
                    <h3 className={styles.heading}>
                        <FormatColorFillSharp
                            fontSize="inherit"
                            style={{ marginRight: "0.25rem" }}
                        />
                        Theme
                    </h3>
                    <SchemeSelector scheme={scheme} onChange={setScheme} />
                </div>
                <div className={styles.inlineSetting}>
                    <h3 className={styles.heading}>
                        <TextFormatSharp
                            fontSize="inherit"
                            style={{ marginRight: "0.25rem" }}
                        />
                        Font type
                    </h3>
                    <div className={styles.settingsButtons}>
                        <Button
                            variant={
                                fontType === "regular" ? "contained" : "text"
                            }
                            onClick={() => setFontType("regular")}
                            disableElevation
                            sx={{
                                fontFamily: "Noto Sans",
                            }}
                        >
                            Regular
                        </Button>
                        <Button
                            variant={
                                fontType === "regular" ? "text" : "contained"
                            }
                            onClick={() => setFontType("monospace")}
                            disableElevation
                            sx={{
                                fontFamily: "Noto Sans Mono",
                            }}
                        >
                            Monospace
                        </Button>
                    </div>
                </div>
                <div className={styles.inlineSetting}>
                    <h3 className={styles.heading}>
                        <FormatSizeSharp
                            fontSize="inherit"
                            style={{ marginRight: "0.25rem" }}
                        />
                        Text size
                    </h3>
                    <div className={styles.settingsButtons}>
                        <Button
                            variant={fontSize === "sm" ? "contained" : "text"}
                            onClick={() => setFontSize("sm")}
                            disableElevation
                            sx={{
                                fontSize: "0.75rem",
                            }}
                        >
                            Small
                        </Button>
                        <Button
                            variant={
                                fontSize === "md" || !fontSize
                                    ? "contained"
                                    : "text"
                            }
                            onClick={() => setFontSize("md")}
                            disableElevation
                            sx={{
                                fontSize: "0.875rem",
                            }}
                        >
                            Medium
                        </Button>
                        <Button
                            variant={fontSize === "lg" ? "contained" : "text"}
                            onClick={() => setFontSize("lg")}
                            disableElevation
                            sx={{
                                fontSize: "1rem",
                            }}
                        >
                            Large
                        </Button>
                    </div>
                </div>
                {/*<div>Regular text</div>
                <div className="text-muted">Muted text</div>
                <div style={{ height: "2000px" }} />*/}
            </div>
        </>
    );
};

export default Settings;
