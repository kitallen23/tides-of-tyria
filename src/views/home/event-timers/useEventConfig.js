import { useEffect, useState } from "react";
import { addHours, isBefore } from "date-fns";

import { useTimer } from "@/utils/hooks/useTimer";
import { ON_COMPLETE_TYPES } from "@/utils/meta_events";
import { MODES } from "./utils";

const isAreaEventsComplete = (area, dailyReset) => {
    const isIncomplete = area.phases
        .filter(phase => !phase.hidePhase)
        .some(event => {
            if (
                event.lastCompletion &&
                !isBefore(event.lastCompletion, dailyReset) &&
                isBefore(event.lastCompletion, addHours(dailyReset, 24))
            ) {
                return false;
            }
            return true;
        });
    return !isIncomplete;
};
const isAreaComplete = (area, dailyReset) => {
    if (
        area.lastCompletion &&
        !isBefore(area.lastCompletion, dailyReset) &&
        isBefore(area.lastCompletion, addHours(dailyReset, 24))
    ) {
        return true;
    }
    return false;
};
const shouldRenderArea = ({
    area,
    dailyReset,
    showCompleted,
    mode,
    region,
}) => {
    if (mode === MODES.edit) {
        return true;
    } else if (region.key === "special_events") {
        return true;
    } else if (area.hideArea === true) {
        // If area hidden by user, never show it
        return false;
    } else if (showCompleted) {
        // If "show completed" setting is turned on, show it
        return true;
    } else if (area.onComplete === ON_COMPLETE_TYPES.none) {
        // If area doesn't have a completion criteria, show it
        return true;
    } else if (area.onComplete === ON_COMPLETE_TYPES.completeArea) {
        const isComplete = isAreaComplete(area, dailyReset);
        // If area is not complete, return true (region should render
        // because it has an area with incomplete events in it)
        return !isComplete;
    } else if (area.onComplete === ON_COMPLETE_TYPES.completeEvent) {
        const isComplete = isAreaEventsComplete(area, dailyReset);
        const hasPhases = area.phases.some(phase => phase.hidePhase !== true);
        // If area is not complete, return true (region should render
        // because it has an area with incomplete events in it)
        return hasPhases && !isComplete;
    }
};
const shouldRenderRegion = ({ region, dailyReset, showCompleted, mode }) => {
    return region.sub_areas.some(area =>
        shouldRenderArea({ area, dailyReset, showCompleted, region, mode })
    );
};

const addRenderStatesToArea = ({
    area,
    showCompleted,
    mode,
    dailyReset,
    region,
}) => {
    const shouldRender = shouldRenderArea({
        area,
        dailyReset,
        showCompleted,
        mode,
        region,
    });
    return {
        ...area,
        shouldRender,
    };
};
const addRenderStatesToRegion = ({
    region,
    showCompleted,
    mode,
    dailyReset,
}) => {
    const shouldRender = shouldRenderRegion({
        region,
        dailyReset,
        showCompleted,
        mode,
    });
    return {
        ...region,
        shouldRender,
        sub_areas: region.sub_areas.map(area =>
            addRenderStatesToArea({
                area,
                showCompleted,
                mode,
                dailyReset,
                region,
            })
        ),
    };
};
const addRenderStatesToEventConfig = ({
    eventConfig,
    showCompleted,
    mode,
    dailyReset,
}) => {
    return eventConfig.map(region =>
        addRenderStatesToRegion({ region, showCompleted, mode, dailyReset })
    );
};
const useEventConfig = ({ eventConfig: _eventConfig, showCompleted, mode }) => {
    const { dailyReset } = useTimer();

    const [eventConfig, setEventConfig] = useState();

    useEffect(() => {
        if (_eventConfig) {
            const clonedEventConfig = structuredClone(_eventConfig);
            let eventConfig = addRenderStatesToEventConfig({
                eventConfig: clonedEventConfig,
                showCompleted,
                mode,
                dailyReset,
            });
            setEventConfig(eventConfig);
        }
    }, [_eventConfig, showCompleted, mode, dailyReset]);

    return eventConfig;
};

export default useEventConfig;
