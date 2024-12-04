import { useEffect } from "react";

const useGlobalHotkeys = hotkeys => {
    useEffect(() => {
        const handleKeyDown = event => {
            // Check if the event target is an input field
            const targetTagName = event.target.tagName.toLowerCase();
            if (
                ((targetTagName === "input" || targetTagName === "textarea") &&
                    event.target.type !== "checkbox") ||
                event.target.isContentEditable
            ) {
                // Do nothing if the user is typing in an input field
                return;
            }

            hotkeys?.[event.key.toLowerCase()]?.(event);
        };

        window.addEventListener("keydown", handleKeyDown, true);
        return () => {
            window.removeEventListener("keydown", handleKeyDown, true);
        };
    }, [hotkeys]);
};

export default useGlobalHotkeys;
