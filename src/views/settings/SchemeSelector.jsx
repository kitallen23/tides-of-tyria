import { SCHEMES } from "@/utils/color-schemes";
import styles from "@/styles/modules/settings.module.scss";
import { useEffect, useMemo } from "react";
import { CircleSharp } from "@mui/icons-material";

const SchemeItem = ({ scheme, selected }) => (
    <div
        className={styles.schemeItem}
        style={{
            color: scheme.colors.primary,
            background: scheme.colors.background,
            borderColor: selected
                ? scheme.colors.primary
                : `rgba(${scheme.colors.primary}, 0.25)`,
        }}
    >
        {scheme.name}
        <div className={styles.colorIndicators}>
            <div
                className={styles.colorIndicator}
                style={{ background: scheme.colors.primary }}
            />
            <div
                className={styles.colorIndicator}
                style={{ background: scheme.colors.body }}
            />
            <div
                className={styles.colorIndicator}
                style={{ background: scheme.colors.secondary }}
            />
        </div>
    </div>
);

const SchemeSelector = ({ scheme, onChange }) => {
    const schemes = useMemo(() => {
        let schemeArray = [];
        Object.keys(SCHEMES).forEach(key => {
            const scheme = SCHEMES[key];
            schemeArray.push({
                ...scheme,
                name: key,
            });
        });
        return schemeArray;
    }, []);

    useEffect(() => {
        console.log(">>> Schemes: ", schemes);
    }, [schemes]);

    return (
        <div className={styles.schemeSelector}>
            {schemes.map(item => (
                <SchemeItem
                    key={item.name}
                    scheme={item}
                    selected={scheme === item.name}
                />
            ))}
        </div>
    );
};

export default SchemeSelector;
