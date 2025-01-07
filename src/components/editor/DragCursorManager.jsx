import globalStyles from "@/styles/modules/global-styles.module.scss";
import { useDndMonitor } from "@dnd-kit/core";

/**
 * DragCursorManager Component
 *
 * Manages global cursor style and disables hover effects during dragging.
 */
const DragCursorManager = () => {
    useDndMonitor({
        onDragStart: () => {
            document.body.classList.add(globalStyles.dragCursor);
        },
        onDragEnd: () => {
            document.body.classList.remove(globalStyles.dragCursor);
        },
        onDragCancel: () => {
            document.body.classList.remove(globalStyles.dragCursor);
        },
    });

    return null;
};

export default DragCursorManager;
