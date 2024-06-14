import { useContext, useEffect, useMemo, useState } from "react";
import styles from "@/styles/modules/event-timer.module.scss";

import Portal from "@/components/Portal";
import EventTimerContext from "./EventTimerContext";
import classNames from "classnames";
import { useTheme } from "@/utils/theme-provider";
import {
    adjustLuminance,
    ensureContrast,
    isContrastEnough,
} from "@/utils/color";
import {
    ClearSharp,
    DoneSharp,
    LaunchSharp,
    LocationOnSharp,
} from "@mui/icons-material";
import { Button, ButtonGroup, useMediaQuery } from "@mui/material";
import { ON_COMPLETE_TYPES } from "@/utils/meta_events";
import { copyToClipboard } from "@/utils/util";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";
import { format } from "date-fns";

const MENU_WIDTH = 250;

const EventInfoMenu = () => {
    const { colors, timeFormat, mode } = useTheme();
    const formatString = useMemo(
        () => (timeFormat === "12h" ? "h:mmaaa" : "H:mm"),
        [timeFormat]
    );
    const isSmallScreen = useMediaQuery("(max-width: 768px)");

    const {
        selectedEvent,
        setSelectedEvent,
        eventWrapperRef,
        width: eventContainerWidth,
    } = useContext(EventTimerContext);

    const [containerDimensions, setContainerDimensions] = useState(null);

    // Find & store information we need to position the menu
    useEffect(() => {
        const pageContentElement = document.getElementById("page-content");
        const style = window.getComputedStyle(pageContentElement);
        const paddingHorizontal = parseFloat(style.paddingRight);
        const pageContentBoundingBox =
            pageContentElement.getBoundingClientRect();
        setContainerDimensions({
            ...pageContentBoundingBox.toJSON(),
            scrollTop: pageContentElement.scrollTop,
            paddingRight: paddingHorizontal,
        });
    }, [selectedEvent]);

    const [anchor, setAnchor] = useState(null);

    // Find the position to place the menu
    useEffect(() => {
        try {
            const selectedElement = eventWrapperRef.current.querySelector(
                `#${selectedEvent.id}`
            );
            if (!selectedElement || !containerDimensions) {
                throw new Error();
            }
            const boundingBox = selectedElement.getBoundingClientRect();

            if (
                boundingBox.left + MENU_WIDTH >
                containerDimensions.right - containerDimensions.paddingRight
            ) {
                // This means that the menu is "poking out" of the right side of the
                // event area, so anchor it to the right of the bounding box
                setAnchor({
                    top: `${
                        boundingBox.bottom -
                        containerDimensions.top +
                        containerDimensions.scrollTop +
                        4
                    }px`,
                    left: `${boundingBox.right - MENU_WIDTH}px`,
                });
            } else {
                // Menu can fit, so attach it left-aligned as usual
                setAnchor({
                    top: `${
                        boundingBox.bottom -
                        containerDimensions.top +
                        containerDimensions.scrollTop +
                        4
                    }px`,
                    left: `${boundingBox.left}px`,
                });
            }
        } catch {
            setAnchor(null);
        }
    }, [
        selectedEvent,
        eventWrapperRef,
        containerDimensions,
        eventContainerWidth,
    ]);

    // Color calculations
    const eventBackground = useMemo(
        () => colors?.[selectedEvent?.color] ?? undefined,
        [selectedEvent?.color, colors]
    );
    const borderColor = useMemo(
        () =>
            eventBackground ? adjustLuminance(eventBackground, -40) : undefined,
        [eventBackground]
    );

    const schemeColorString = useMemo(
        () =>
            selectedEvent?.color === "gray"
                ? "primary"
                : selectedEvent?.color || undefined,
        [selectedEvent?.color]
    );

    const highlightColor = useMemo(() => {
        const schemeColor = colors?.[schemeColorString] ?? undefined;
        const background = colors.background;
        if (schemeColor) {
            const schemeColorHasEnoughContrast = isContrastEnough(
                schemeColor,
                colors.background
            );
            if (schemeColorHasEnoughContrast) {
                return schemeColor;
            } else {
                return ensureContrast(
                    schemeColor,
                    background,
                    mode === "light" ? "darken" : "lighten"
                );
            }
        } else {
            return undefined;
        }
    }, [schemeColorString, colors, mode]);

    const highlightColorDark = useMemo(
        () =>
            highlightColor ? adjustLuminance(highlightColor, -20) : undefined,
        [highlightColor]
    );

    const buttonSx = useMemo(
        () => ({
            borderColor: highlightColor,
            color: highlightColor,
            "&:hover": {
                borderColor: highlightColorDark,
                background: `${highlightColor}26`,
            },
        }),
        [highlightColor, highlightColorDark]
    );

    const [buttonIsHovered, setButtonIsHovered] = useState(false);
    const [hoveredText, setHoveredText] = useState("");

    const copyWaypointToClipboard = () => {
        if (selectedEvent.waypoint) {
            copyToClipboard(selectedEvent.waypoint, {
                onSuccess: () => toast.success("Waypoint copied to clipboard!"),
                onError: () =>
                    toast.error(
                        "Something went wrong when copying to clipboard."
                    ),
            });
        }
    };

    useEffect(() => {
        if (!anchor) {
            setButtonIsHovered(false);
        }
    }, [anchor]);

    if (!anchor || !selectedEvent) {
        return null;
    }
    return (
        <Portal targetId="page-content">
            {isSmallScreen ? (
                <Modal
                    className="event-phase-menu"
                    open={true}
                    onClose={() => setSelectedEvent(null)}
                    closeButton={true}
                >
                    <div className={styles.eventPhaseModal}>
                        <div
                            className={styles.eventTitle}
                            style={{ color: highlightColor }}
                        >
                            {selectedEvent.name}
                        </div>
                        <div
                            className={styles.eventAreaName}
                            style={{ color: colors.muted }}
                        >
                            {format(selectedEvent.startDate, formatString)}
                            &nbsp;|&nbsp;
                            {selectedEvent.area.name}
                        </div>
                        <div className={styles.buttonArea}>
                            <div
                                className={styles.buttonText}
                                style={{
                                    opacity: buttonIsHovered ? 1 : 0,
                                }}
                            >
                                {hoveredText || ""}
                            </div>
                            <div className={styles.buttonRow}>
                                <ButtonGroup fullWidth>
                                    {selectedEvent.waypoint ? (
                                        <Button
                                            sx={buttonSx}
                                            onMouseEnter={() => {
                                                setButtonIsHovered(true);
                                                setHoveredText(
                                                    "Copy waypoint to clipboard"
                                                );
                                            }}
                                            onMouseLeave={() =>
                                                setButtonIsHovered(false)
                                            }
                                            onClick={copyWaypointToClipboard}
                                        >
                                            <LocationOnSharp />
                                        </Button>
                                    ) : null}
                                    <Button
                                        sx={buttonSx}
                                        component="a"
                                        href={selectedEvent.wikiUrl}
                                        onMouseEnter={() => {
                                            setButtonIsHovered(true);
                                            setHoveredText("Open wiki page");
                                        }}
                                        onMouseLeave={() =>
                                            setButtonIsHovered(false)
                                        }
                                    >
                                        <LaunchSharp />
                                    </Button>
                                    {selectedEvent.area.onComplete ===
                                    ON_COMPLETE_TYPES.none ? null : (
                                        <Button
                                            sx={buttonSx}
                                            onMouseEnter={() => {
                                                setButtonIsHovered(true);
                                                setHoveredText(
                                                    "Mark as complete"
                                                );
                                            }}
                                            onMouseLeave={() =>
                                                setButtonIsHovered(false)
                                            }
                                        >
                                            <DoneSharp />
                                        </Button>
                                    )}
                                </ButtonGroup>
                            </div>
                        </div>
                    </div>
                </Modal>
            ) : (
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
                        style={{ color: highlightColor }}
                    >
                        {selectedEvent.name}
                    </div>
                    <div
                        className={styles.eventAreaName}
                        style={{ color: colors.muted }}
                    >
                        {format(selectedEvent.startDate, formatString)}
                        &nbsp;|&nbsp;
                        {selectedEvent.area.name}
                    </div>
                    <div className={styles.buttonArea}>
                        <div
                            className={styles.buttonText}
                            style={{
                                opacity: buttonIsHovered ? 1 : 0,
                            }}
                        >
                            {hoveredText || ""}
                        </div>
                        <div className={styles.buttonRow}>
                            <ButtonGroup fullWidth>
                                {selectedEvent.waypoint ? (
                                    <Button
                                        sx={buttonSx}
                                        onMouseEnter={() => {
                                            setButtonIsHovered(true);
                                            setHoveredText(
                                                "Copy waypoint to clipboard"
                                            );
                                        }}
                                        onMouseLeave={() =>
                                            setButtonIsHovered(false)
                                        }
                                        onClick={copyWaypointToClipboard}
                                    >
                                        <LocationOnSharp />
                                    </Button>
                                ) : null}
                                <Button
                                    sx={buttonSx}
                                    component="a"
                                    href={selectedEvent.wikiUrl}
                                    onMouseEnter={() => {
                                        setButtonIsHovered(true);
                                        setHoveredText("Open wiki page");
                                    }}
                                    onMouseLeave={() =>
                                        setButtonIsHovered(false)
                                    }
                                >
                                    <LaunchSharp />
                                </Button>
                                {selectedEvent.area.onComplete ===
                                ON_COMPLETE_TYPES.none ? null : (
                                    <Button
                                        sx={buttonSx}
                                        onMouseEnter={() => {
                                            setButtonIsHovered(true);
                                            setHoveredText("Mark as complete");
                                        }}
                                        onMouseLeave={() =>
                                            setButtonIsHovered(false)
                                        }
                                    >
                                        <DoneSharp />
                                    </Button>
                                )}
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
            )}
        </Portal>
    );
};

export default EventInfoMenu;
