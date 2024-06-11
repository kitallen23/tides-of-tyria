import { useContext, useEffect, useMemo, useState } from "react";
import styles from "@/styles/modules/event-timer.module.scss";

import Portal from "@/components/Portal";
import EventTimerContext from "./EventTimerContext";
import classNames from "classnames";
import { useTheme } from "@/utils/theme-provider";
import { adjustLuminance } from "@/utils/color";
import { ClearSharp } from "@mui/icons-material";

const EventInfoMenu = () => {
    const {
        selectedEvent,
        setSelectedEvent,
        eventWrapperRef,
        width: eventContainerWidth,
    } = useContext(EventTimerContext);

    const [containerDimensions, setContainerDimensions] = useState(null);

    useEffect(() => {
        const pageContentElement = document.getElementById("page-content");
        const pageContentBoundingBox =
            pageContentElement.getBoundingClientRect();
        setContainerDimensions({
            ...pageContentBoundingBox.toJSON(),
            scrollTop: pageContentElement.scrollTop,
        });
    }, [selectedEvent]);

    const [anchor, setAnchor] = useState(null);

    useEffect(() => {
        try {
            const selectedElement = eventWrapperRef.current.querySelector(
                `#${selectedEvent.id}`
            );
            if (!selectedElement || !containerDimensions) {
                throw new Error();
            }
            const boundingBox = selectedElement.getBoundingClientRect();

            // TODO: Update this to detect width of final element & anchor it to
            // right, if necessary
            setAnchor({
                top: `${
                    boundingBox.bottom -
                    containerDimensions.top +
                    containerDimensions.scrollTop +
                    4
                }px`,
                left: `${boundingBox.left}px`,
            });
        } catch {
            setAnchor(null);
        }
    }, [
        selectedEvent,
        eventWrapperRef,
        containerDimensions,
        eventContainerWidth,
    ]);

    const { colors } = useTheme();
    const eventBackground = useMemo(
        () => colors?.[selectedEvent?.color] ?? undefined,
        [selectedEvent?.color, colors]
    );
    const borderColor = useMemo(
        () =>
            eventBackground ? adjustLuminance(eventBackground, -40) : undefined,
        [eventBackground]
    );

    if (!anchor || !selectedEvent) {
        return null;
    }
    return (
        <Portal targetId="page-content">
            <div
                className={classNames(
                    styles.eventPhaseMenu,
                    "event-phase-menu"
                )}
                style={{
                    ...anchor,
                    borderColor,
                }}
            >
                <div
                    className={styles.closeButtonWrapper}
                    onClick={() => setSelectedEvent(null)}
                >
                    <ClearSharp />
                </div>
                <div
                    className={styles.eventTitle}
                    style={{ color: eventBackground }}
                >
                    {selectedEvent.name}
                </div>
                <div
                    className={styles.eventAreaName}
                    style={{ color: colors.muted }}
                >
                    {selectedEvent.area.name}
                </div>
            </div>
        </Portal>
    );
};

export default EventInfoMenu;
