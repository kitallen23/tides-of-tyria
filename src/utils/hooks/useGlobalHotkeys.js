import { useEffect } from "react";

const useGlobalHotkeys = hotkeys => {
    useEffect(() => {
        const handleKeyDown = event => {
            // Check if the event target is an input field
            const targetTagName = event.target.tagName.toLowerCase();
            if (
                targetTagName === "input" ||
                targetTagName === "textarea" ||
                event.target.isContentEditable
            ) {
                // Do nothing if the user is typing in an input field
                return;
            }

            hotkeys?.[event.key.toLowerCase()]?.();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [hotkeys]);
};

export default useGlobalHotkeys;
