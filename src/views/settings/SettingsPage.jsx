import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "./settings.module.scss";
import { getLocalItem, getTitle, isHexValid } from "@/utils/util";

import SchemeSelector from "./SchemeSelector";
import {
    CheckCircleSharp,
    FormatColorFillSharp,
    FormatSizeSharp,
    GitHub,
    TextFormatSharp,
} from "@mui/icons-material";
import { useTheme } from "@/utils/theme-provider";
import { Button, TextField } from "@mui/material";
import { SCHEMES } from "@/utils/color-schemes";
import { APP_VERSION, LOCAL_STORAGE_KEYS } from "@/utils/constants";
import Modal from "@/components/Modal/Modal";
import HeartIcon from "@/components/HeartIcon";

const SettingsPage = () => {
    const title = useMemo(() => getTitle("Settings"), []);
    const {
        colorScheme: scheme,
        colors,
        fontType,
        fontSize,
        timeFormat,

        setThemeKey,
        setFontType,
        setFontSize,
        setTimeFormat,
        setPrimaryColor,
    } = useTheme();

    const setScheme = key => {
        if (key) {
            setThemeKey(key);
        }
    };

    const [localPrimaryColor, setLocalPrimaryColor] = useState(
        getLocalItem(LOCAL_STORAGE_KEYS.primaryColor, "")
    );
    const isPrimaryColorValid = useMemo(
        () => isHexValid(localPrimaryColor),
        [localPrimaryColor]
    );

    const onPrimaryColorChange = e => {
        let value = e.target.value;
        if (value && !value.startsWith("#")) {
            value = `#${value}`;
        }
        setLocalPrimaryColor(value);
        if (isHexValid(value) || value === "") {
            setPrimaryColor(value);
        }
    };

    const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);

    const clearLocalData = () => {
        Object.values(LOCAL_STORAGE_KEYS).forEach(key =>
            localStorage.removeItem(key)
        );
        location.reload();
    };

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div
                className={`${globalStyles.centeredContent} ${styles.pageWrapper}`}
            >
                <div className={styles.settingGroup}>
                    <h3 className={styles.heading}>
                        <FormatColorFillSharp
                            style={{ marginRight: "0.25rem" }}
                        />
                        Theme
                    </h3>
                    <SchemeSelector scheme={scheme} onChange={setScheme} />
                </div>
                {scheme === "dark" || scheme === "light" ? (
                    <div className={styles.inlineSetting}>
                        <h3 className={styles.heading}>
                            <TextFormatSharp
                                style={{ marginRight: "0.25rem" }}
                            />
                            Primary color
                        </h3>
                        <div className={styles.colorInputWithIndicator}>
                            {colors.primary && isPrimaryColorValid ? (
                                <CheckCircleSharp
                                    color="primary"
                                    sx={{ fontSize: "1.17em" }}
                                />
                            ) : null}
                            <div className={styles.settingsTextInput}>
                                <TextField
                                    id="theme-primary-color"
                                    value={localPrimaryColor}
                                    variant="outlined"
                                    placeholder={
                                        SCHEMES?.[scheme]?.colors?.primary || ""
                                    }
                                    size="small"
                                    color="primary"
                                    sx={{
                                        maxWidth: "7em",
                                    }}
                                    onChange={onPrimaryColorChange}
                                />
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className={styles.inlineSetting}>
                    <h3 className={styles.heading}>
                        <TextFormatSharp style={{ marginRight: "0.25rem" }} />
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
                            className={styles.uniformButton}
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
                            className={styles.uniformButton}
                        >
                            Monospace
                        </Button>
                    </div>
                </div>
                <div className={styles.inlineSetting}>
                    <h3 className={styles.heading}>
                        <FormatSizeSharp style={{ marginRight: "0.25rem" }} />
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
                            className={styles.uniformButton}
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
                            className={styles.uniformButton}
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
                            className={styles.uniformButton}
                        >
                            Large
                        </Button>
                    </div>
                </div>
                <div className={styles.inlineSetting}>
                    <h3 className={styles.heading}>
                        <FormatSizeSharp style={{ marginRight: "0.25rem" }} />
                        Time format
                    </h3>
                    <div className={styles.settingsButtons}>
                        <Button
                            variant={
                                timeFormat !== "24h" ? "contained" : "text"
                            }
                            onClick={() => setTimeFormat("12h")}
                            disableElevation
                            className={styles.uniformButton}
                        >
                            12 hour
                        </Button>
                        <Button
                            variant={
                                timeFormat === "24h" ? "contained" : "text"
                            }
                            onClick={() => setTimeFormat("24h")}
                            disableElevation
                            className={styles.uniformButton}
                        >
                            24 hour
                        </Button>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <Button
                        variant="text"
                        onClick={() => setIsClearDataModalOpen(true)}
                        color="error"
                        disableElevation
                    >
                        Clear local data
                    </Button>
                </div>
                <div className={styles.attributionTextContainer}>
                    <div>
                        Made with&nbsp;
                        <HeartIcon
                            style={{
                                fontSize: "0.875em",
                                color: colors.primary,
                            }}
                        />
                        &nbsp;by Woods to Eternity.9851
                    </div>
                    <div style={{ fontSize: "0.875em" }}>
                        Have some feedback? Found a bug? I'd love to hear from
                        you!
                        <br />
                        Send me mail in-game, or open an issue on{" "}
                        <a
                            href="https://github.com/kitallen23/tides-of-tyria"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <GitHub
                                style={{
                                    marginRight: "0.2em",
                                    fontSize: "0.875em",
                                }}
                            />
                            GitHub
                        </a>
                        .
                    </div>
                    <div style={{ fontSize: "0.65em" }}>v{APP_VERSION}</div>
                </div>
            </div>
            <Modal
                open={isClearDataModalOpen}
                onClose={() => setIsClearDataModalOpen(false)}
                closeButton={true}
                style={{ maxWidth: 400 }}
            >
                <div className={styles.clearLocalDataModal}>
                    <h3>Clear local data</h3>
                    <p>
                        Are you sure you wish to clear all local data? This
                        will:
                    </p>
                    <ul>
                        <li>Reset all settings back to their default</li>
                        <li>Clear your timer configuration & completions</li>
                        <li>Remove all checklist items</li>
                    </ul>
                    <div style={{ textAlign: "center" }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={clearLocalData}
                            disableElevation
                        >
                            Yes, reset everything
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SettingsPage;
