import toast from "react-hot-toast";
import { saveAs } from "file-saver";

import { resetConfigToDefault } from "@/views/home/event-timers/utils";
import { LOCAL_STORAGE_KEYS } from "@/utils/constants";
import META_EVENTS from "@/utils/meta_events";

const JSON_TYPES = [
    LOCAL_STORAGE_KEYS.dailyChecklist,
    LOCAL_STORAGE_KEYS.weeklyChecklist,
    LOCAL_STORAGE_KEYS.todoChecklist,
    LOCAL_STORAGE_KEYS.eventConfig,
];
const BOOLEAN_TYPES = [
    LOCAL_STORAGE_KEYS.isTimerCollapsed,
    LOCAL_STORAGE_KEYS.denseMode,
    LOCAL_STORAGE_KEYS.groupedMode,
    LOCAL_STORAGE_KEYS.showCompleted,
];

export const useSettingsPersistence = () => {
    const onSaveToFile = () => {
        const data = {};

        Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
            try {
                let value = localStorage.getItem(key);
                if (value === null) {
                    return;
                }

                if (JSON_TYPES.includes(key)) {
                    value = JSON.parse(value);
                } else if (BOOLEAN_TYPES.includes(key)) {
                    value = value === "true";
                }
                data[key] = value;
            } catch {} // eslint-disable-line no-empty
        });
        if (!Object.keys(data).length) {
            toast.error("Error: no local data to save.");
            return;
        }

        const json = JSON.stringify(data, null, 4);
        const blob = new Blob([json], { type: "application/json" });

        saveAs(blob, "tides-of-tyria_config.json");
        toast.success("Configuration downloaded successfully.");
    };

    const onRestoreFromFile = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) {
                toast.error("No file selected.");
                return;
            }

            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const content = event.target.result;
                    const parsedData = JSON.parse(content);

                    if (typeof parsedData !== "object" || parsedData === null) {
                        throw new Error("Invalid JSON format.");
                    }

                    Object.entries(parsedData).forEach(([key, value]) => {
                        let storedValue = value;

                        if (JSON_TYPES.includes(key)) {
                            if (key === LOCAL_STORAGE_KEYS.eventConfig) {
                                let eventConfig = resetConfigToDefault(
                                    value,
                                    META_EVENTS
                                );
                                storedValue = JSON.stringify(eventConfig);
                            } else {
                                storedValue = JSON.stringify(value);
                            }
                        } else if (BOOLEAN_TYPES.includes(key)) {
                            storedValue = value ? "true" : "false";
                        }

                        if (Object.values(LOCAL_STORAGE_KEYS).includes(key)) {
                            localStorage.setItem(key, storedValue);
                        }
                    });

                    const url = new URL(window.location);
                    url.searchParams.append("restored", "true");
                    window.location.href = url.toString();
                } catch (err) {
                    console.error(`Error restoring saved configuration: `, err);
                    toast.error(
                        "Failed to restore configuration. The file may be malformed."
                    );
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    return {
        onSaveToFile,
        onRestoreFromFile,
    };
};
