import { ON_COMPLETE_TYPES } from "@/utils/meta_events";
import { isBefore } from "date-fns";

export const TIME_BLOCK_MINS = 120;
export const MINS_IN_DAY = 60 * 24;
export const HOVER_DELAY = 500;
export const HIGHLIGHT_SCHEMES = {
    all: "all",
    future: "future",
    upcoming: "upcoming",
};
export const UPCOMING_MINS = 30;

export const MODES = {
    view: "view",
    edit: "edit",
};

export const cleanEventConfig = (eventConfig, reset) => {
    const _eventConfig = structuredClone(eventConfig);
    return _eventConfig.map(region => ({
        ...region,
        sub_areas: region.sub_areas.map(subArea => {
            if (
                subArea?.lastCompletion &&
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

export const markAllEventsIncomplete = eventConfig => {
    const _eventConfig = structuredClone(eventConfig);
    return _eventConfig.map(region => ({
        ...region,
        sub_areas: region.sub_areas.map(subArea => {
            subArea.lastCompletion = undefined;
            subArea.phases = subArea.phases.map(phase => {
                phase.lastCompletion = undefined;
                return phase;
            });
            return subArea;
        }),
    }));
};

export const toggleAreaVisibility = (eventConfig, area) => {
    const _eventConfig = structuredClone(eventConfig);
    return _eventConfig.map(region => ({
        ...region,
        sub_areas: region.sub_areas.map(subArea => {
            if (subArea.key === area.key) {
                subArea.hideArea = !(subArea.hideArea ?? false);
            }
            return subArea;
        }),
    }));
};
export const togglePhaseVisibility = (eventConfig, area, phaseKey) => {
    const _eventConfig = structuredClone(eventConfig);
    let toggledValue = null;
    return _eventConfig.map(region => ({
        ...region,
        sub_areas: region.sub_areas.map(subArea => {
            if (subArea.key === area.key) {
                subArea.phases = subArea.phases.map(phase => {
                    if (phase.key === phaseKey) {
                        if (toggledValue === null) {
                            toggledValue = !(phase.hidePhase ?? false);
                        }
                        phase.hidePhase = toggledValue;
                    }
                    return phase;
                });
            }
            return subArea;
        }),
    }));
};
export const markAllAreasVisible = eventConfig => {
    const _eventConfig = structuredClone(eventConfig);
    return _eventConfig.map(region => ({
        ...region,
        sub_areas: region.sub_areas.map(subArea => ({
            ...subArea,
            hideArea: undefined,
            phases: subArea.phases.map(phase => ({
                ...phase,
                hidePhase: undefined,
            })),
        })),
    }));
};

export const resetConfigToDefault = (currentConfig, defaultConfig) => {
    const _eventConfig = structuredClone(defaultConfig);
    return _eventConfig.map(region => {
        const currentRegion = currentConfig.find(
            cRegion => cRegion.key === region.key
        );
        return {
            ...region,
            sub_areas: region.sub_areas.map(subArea => {
                const currentSubArea = currentRegion?.sub_areas?.find(
                    cSubArea => cSubArea.key === subArea.key
                );

                subArea.lastCompletion =
                    currentSubArea?.lastCompletion ?? undefined;
                subArea.hideArea = currentSubArea?.hideArea ?? undefined;

                subArea.phases = subArea.phases.map(phase => {
                    const currentPhase = currentSubArea?.phases.find(
                        cPhase => cPhase.key === phase.key
                    );

                    phase.lastCompletion =
                        currentPhase?.lastCompletion ?? undefined;

                    return phase;
                });
                return subArea;
            }),
        };
    });
};
