import { forwardRef } from "react";
import { css } from "@emotion/react";

import styles from "./inline-editor.module.scss";
import { useInlineEditor } from "./useInlineEditor";
import { useTheme } from "@/utils/theme-provider";

export const InlineEditor = forwardRef(
    (
        {
            id,
            defaultValue,
            onSelect,
            onChange,
            onNewLine,
            onRemoveLine,
            onFocusPreviousEditor,
            onFocusNextEditor,
        },
        ref
    ) => {
        const { colors } = useTheme();
        const { handleKeyDown, handleInput, handleLinkClick } = useInlineEditor(
            {
                ref,
                defaultValue,
                onChange,
                onNewLine,
                onRemoveLine,
                onFocusPreviousEditor,
                onFocusNextEditor,
            }
        );

        return (
            <div
                id={id}
                ref={ref}
                className={styles.inlineEditor}
                css={css({
                    a: {
                        textDecoration: "underline",
                        color: colors?.primary || undefined,
                    },
                })}
                contentEditable
                onMouseUp={onSelect}
                onKeyUp={onSelect}
                onKeyDown={handleKeyDown}
                onClick={handleLinkClick}
                onInput={handleInput}
            />
        );
    }
);
InlineEditor.displayName = "InlineEditor";

export default InlineEditor;
