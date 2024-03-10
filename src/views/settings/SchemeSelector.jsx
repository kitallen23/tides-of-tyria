import { SCHEMES } from "@/utils/color-schemes";
import styles from "@/styles/modules/settings.module.scss";
import { useMemo } from "react";

const SchemeItem = ({ scheme, selected, onChange }) => (
    <div
        className={styles.schemeItem}
        style={{
            color: scheme.colors.primary,
            background: scheme.colors.background,
            borderColor: selected ? scheme.colors.primary : "transparent",
        }}
        onClick={() => onChange(scheme.key)}
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
    </div>
);

const SchemeSelector = ({ scheme, onChange }) => {
    const schemes = useMemo(() => {
        let schemeArray = [];
        Object.keys(SCHEMES).forEach(key => {
            schemeArray.push({
                ...SCHEMES[key],
                key,
            });
        });
        return schemeArray;
    }, []);

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
