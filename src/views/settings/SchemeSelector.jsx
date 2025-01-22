import { useMemo } from "react";

import styles from "./settings.module.scss";
import { SCHEMES } from "@/utils/color-schemes";
import { getLocalItem } from "@/utils/util";
import { useTheme } from "@/utils/theme-provider";
import { LOCAL_STORAGE_KEYS } from "@/utils/constants";

import UnstyledButton from "@/components/UnstyledButton";

const SchemeItem = ({ scheme, selected, onChange }) => (
    <UnstyledButton
        className={styles.schemeItem}
        style={{
            color: scheme.colors.primary,
            background: scheme.colors.background,
            borderColor: selected ? scheme.colors.primary : "transparent",
        }}
        onClick={() => onChange(scheme.key)}
        aria-label={`Set color scheme to ${scheme.name}`}
    >
        {scheme.name}
        <div className={styles.colorIndicators}>
            <div
                className={styles.colorIndicator}
                style={{ background: scheme.colors.primary }}
            />
            <div
                className={styles.colorIndicator}
                style={{ background: scheme.colors.secondary }}
            />
            <div
                className={styles.colorIndicator}
                style={{ background: scheme.colors.body }}
            />
        </div>
    </UnstyledButton>
);

const SchemeSelector = ({ scheme, onChange }) => {
    const { colors } = useTheme();

    const primaryColor = useMemo(
        () => getLocalItem(LOCAL_STORAGE_KEYS.primaryColor || ""),
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
        [colors]
    );
    const schemes = useMemo(() => {
        let schemeArray = [];
        Object.keys(SCHEMES).forEach(key => {
            let colors = { ...SCHEMES[key].colors };
            if (key === "dark" || key === "light") {
                colors.primary = primaryColor || colors.primary;
            }
            schemeArray.push({
                ...SCHEMES[key],
                colors,
                key,
            });
        });
        return schemeArray;
    }, [primaryColor]);

    return (
        <div className={styles.schemeSelector}>
            {schemes.map(item => (
                <SchemeItem
                    key={item.key}
                    scheme={item}
                    selected={scheme === item.key}
                    onChange={onChange}
                />
            ))}
        </div>
    );
};

export default SchemeSelector;
