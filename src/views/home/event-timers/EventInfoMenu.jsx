import {
    useContext,
    useEffect,
    useMemo,
    useState,
    useRef,
    useCallback,
} from "react";
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
import { addHours, format, isBefore } from "date-fns";
import { useTimer } from "@/utils/hooks/useTimer";

const MENU_WIDTH = 250;

const EventInfoMenu = () => {
    const eventPhaseMenuRef = useRef(null);
    const { colors, timeFormat, mode } = useTheme();
    const formatString = useMemo(
        () => (timeFormat === "12h" ? "h:mmaaa" : "H:mm"),
        [timeFormat]
    );
    const isSmallScreen = useMediaQuery("(max-width: 768px)");
    const { dailyReset } = useTimer();

    const {
        selectedEvent,
        setSelectedEvent,
        eventWrapperRef,
        width: eventContainerWidth,
        onComplete: _onComplete,
    } = useContext(EventTimerContext);

    const isEventComplete = useMemo(() => {
        if (!selectedEvent) {
            return false;
        }
        if (
            selectedEvent.area.lastCompletion &&
            !isBefore(selectedEvent.area.lastCompletion, dailyReset) &&
            isBefore(
                selectedEvent.area.lastCompletion,
                addHours(dailyReset, 24)
            )
        ) {
            return true;
        } else if (
            selectedEvent.lastCompletion &&
            !isBefore(selectedEvent.lastCompletion, dailyReset) &&
            isBefore(selectedEvent.lastCompletion, addHours(dailyReset, 24))
        ) {
            return true;
        }
        return false;
    }, [selectedEvent, dailyReset]);

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
    const [eventMenuHeight, setEventMenuHeight] = useState(0);

    useEffect(() => {
        let eventMenuHeight = 0;
        if (eventPhaseMenuRef.current) {
            eventMenuHeight = eventPhaseMenuRef.current.offsetHeight;
        }
        setEventMenuHeight(eventMenuHeight);
    }, [eventPhaseMenuRef, anchor]);

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
            const windowHeight = window.innerHeight;

            let top =
                boundingBox.bottom -
                containerDimensions.top +
                containerDimensions.scrollTop +
                4;
            // These values allow us to compare top & bottom against window's
            // innerHeight
            const topRelativeToViewport = boundingBox.bottom + 4;
            const bottomRelativeToViewport =
                topRelativeToViewport + eventMenuHeight;

            // Anchor to top of event instead of bottom, as there's not enough
            // screen space below the event. The user can still scroll down, but
            // this means the event menu will always be on the screen without
            // the user needing to scroll.
            if (
                bottomRelativeToViewport &&
                bottomRelativeToViewport > windowHeight
            ) {
                top = `${
                    boundingBox.top -
                    containerDimensions.top +
                    containerDimensions.scrollTop -
                    4 -
                    eventMenuHeight
                }px`;
            }

            if (
                boundingBox.left + MENU_WIDTH >
                containerDimensions.right - containerDimensions.paddingRight
            ) {
                // This means that the menu is "poking out" of the right side of the
                // event area, so anchor it to the right of the bounding box
                setAnchor({
                    top,
                    left: `${boundingBox.right - MENU_WIDTH}px`,
                    opacity: eventMenuHeight ? 1 : 0,
                });
            } else {
                // Menu can fit, so attach it left-aligned as usual
                setAnchor({
                    top,
                    left: `${boundingBox.left}px`,
                    opacity: eventMenuHeight ? 1 : 0,
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
        eventMenuHeight,
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

    const onComplete = useCallback(() => {
        if (selectedEvent) {
            _onComplete(selectedEvent);
        }
    }, [selectedEvent, _onComplete]);

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
                                        target="_blank"
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
                                            onClick={onComplete}
                                            disabled={isEventComplete}
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
                    ref={eventPhaseMenuRef}
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
                                    target="_blank"
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
                                        onClick={onComplete}
                                        disabled={isEventComplete}
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
