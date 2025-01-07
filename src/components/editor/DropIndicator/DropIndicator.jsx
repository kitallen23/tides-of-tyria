import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import styles from "../checklist-group.module.scss";
import { useTheme } from "@/utils/theme-provider";

const DropIndicator = ({ items, index, containerRef, ...rest }) => {
    const { colors } = useTheme();
    const show = index !== null;
    const indicatorRef = useRef(null);
    const [style, setStyle] = useState({});

    useEffect(() => {
        if (items.length && index !== null) {
            let item;
            if (index === items.length) {
                item = containerRef.current.querySelector('[id^="dummy-"]');
            } else {
                const aboveEditor = items[index]?.inputRef.current;
                item = aboveEditor.closest(".checklist-item");
            }
            if (!item) {
                return;
            }

            const containerTop =
                containerRef?.current?.getBoundingClientRect().top;
            const itemTop = item.getBoundingClientRect().top;
            const indicatorHeight =
                indicatorRef?.current?.getBoundingClientRect().height;

            const itemDistanceFromContainerTop = itemTop - containerTop;

            setStyle({
                top: `${itemDistanceFromContainerTop - indicatorHeight / 2}px`,
            });
        } else {
            setStyle({});
        }
    }, [items, index, containerRef, indicatorRef]);

    return (
        <div
            {...rest}
            ref={indicatorRef}
            className={classNames(styles.dropIndicator, {
                [styles.show]: show && style?.top,
            })}
            style={{ backgroundColor: colors.primary, ...style }}
        />
    );
};

export default DropIndicator;
