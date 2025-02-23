import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import {
    BrowseGallerySharp,
    CheckCircleSharp,
    ColorLensSharp,
    DataObjectSharp,
    FormatColorFillSharp,
    FormatSizeSharp,
    GitHub,
    SaveAltSharp,
    TextFormatSharp,
    UploadSharp,
} from "@mui/icons-material";
import { Button, TextField, useMediaQuery } from "@mui/material";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "./settings.module.scss";
import { getLocalItem, getTitle, isHexValid } from "@/utils/util";
import { useSettingsPersistence } from "@/utils/hooks/useSettingsPersistence";
import { useTheme } from "@/utils/theme-provider";
import { SCHEMES } from "@/utils/color-schemes";
import { APP_VERSION, LOCAL_STORAGE_KEYS } from "@/utils/constants";

import SchemeSelector from "./SchemeSelector";
import Modal from "@/components/Modal/Modal";
import HeartIcon from "@/components/HeartIcon";

const SettingsPage = () => {
    const isSmallScreen = useMediaQuery("(max-width: 768px)");
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

    const { onSaveToFile, onRestoreFromFile } = useSettingsPersistence();

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
        window.location.reload();
    };

    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        try {
            const isRestored = searchParams.get("restored");
            if (isRestored === "true") {
                toast.success("Configuration restored successfully.");
                searchParams.delete("restored");
                setSearchParams(searchParams);
            }
        } catch {} // eslint-disable-line no-empty
    }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="robots" content="noindex, nofollow" />
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
                            <ColorLensSharp
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
                            aria-label="Set font to regular"
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
                            aria-label="Set font to monospaced"
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
                            aria-label="Set font size to small"
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
                            aria-label="Set font size to medium (default)"
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
                            aria-label="Set font size to large"
                        >
                            Large
                        </Button>
                    </div>
                </div>
                <div className={styles.inlineSetting}>
                    <h3 className={styles.heading}>
                        <BrowseGallerySharp
                            style={{ marginRight: "0.25rem" }}
                        />
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
                            aria-label="Set time format to 12h time"
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
                            aria-label="Set time format to 24h time"
                        >
                            24 hour
                        </Button>
                    </div>
                </div>
                <div className={styles.settingGroup}>
                    <h3 className={styles.heading}>
                        <DataObjectSharp style={{ marginRight: "0.25rem" }} />
                        Data
                    </h3>
                    <div style={{ display: "grid", gap: "0.5rem" }}>
                        <div
                            style={{
                                fontSize: "0.875em",
                                color: colors.muted,
                            }}
                        >
                            All data is stored locally. Clearing your browser
                            cache will erase your event timer settings and
                            checklist items. Use these buttons to backup or
                            restore from file.
                        </div>
                        <div
                            style={{
                                display: isSmallScreen ? "flex" : "grid",
                                flexWrap: "wrap",
                                gridTemplateColumns: "auto auto 1fr",
                                gap: "0.5rem",
                                alignItems: "start",
                            }}
                        >
                            <Button
                                variant="contained"
                                onClick={() => onSaveToFile()}
                                disableElevation
                                aria-label="Save site settings to file"
                                style={{ gap: "0.25em" }}
                            >
                                <SaveAltSharp />
                                Backup
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => onRestoreFromFile()}
                                disableElevation
                                aria-label="Restore site settings from file"
                                style={{ gap: "0.25em" }}
                            >
                                <UploadSharp />
                                Restore
                            </Button>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                }}
                            >
                                <Button
                                    variant="text"
                                    onClick={() =>
                                        setIsClearDataModalOpen(true)
                                    }
                                    color="error"
                                    disableElevation
                                    aria-label="Clear local data"
                                >
                                    Clear local data
                                </Button>
                            </div>
                        </div>
                    </div>
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
