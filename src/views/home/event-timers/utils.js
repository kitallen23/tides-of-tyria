import { ON_COMPLETE_TYPES } from "@/utils/meta_events";
import { isBefore } from "date-fns";

export const TIME_BLOCK_MINS = 120;
export const MINS_IN_DAY = 60 * 24;
export const HOVER_DELAY = 500;

export const cleanEventConfig = (eventConfig, reset) => {
    const _eventConfig = structuredClone(eventConfig);
    return _eventConfig.map(region => ({
        ...region,
        sub_areas: region.sub_areas.map(subArea => {
            if (
                subArea.lastCompletion &&
                isBefore(subArea.lastCompletion, reset)
            ) {
                subArea.lastCompletion = undefined;
            }
            subArea.phases = subArea.phases.map(phase => {
                if (
                    phase.lastCompletion &&
                    isBefore(phase.lastCompletion, reset)
                ) {
                    phase.lastCompletion = undefined;
                }
                return phase;
            });
            return subArea;
        }),
    }));
};

export const markEventComplete = (eventConfig, event, completionDate) => {
    const _eventConfig = structuredClone(eventConfig);
    return _eventConfig.map(region => ({
        ...region,
        sub_areas: region.sub_areas.map(subArea => {
            const subAreaContainsPhase = subArea.phases.some(
                phase => phase.key === event.key
            );
            if (subAreaContainsPhase) {
                if (subArea.onComplete === ON_COMPLETE_TYPES.completeArea) {
                    subArea.lastCompletion = completionDate;
                } else if (
                    subArea.onComplete === ON_COMPLETE_TYPES.completeEvent
                ) {
                    subArea.phases = subArea.phases.map(phase => {
                        if (phase.key === event.key) {
                            phase.lastCompletion = completionDate;
                        }
                        return phase;
                    });
                }
                return subArea;
            } else {
                return subArea;
            }
        }),
    }));
};
