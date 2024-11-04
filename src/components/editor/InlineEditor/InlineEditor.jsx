import { forwardRef } from "react";
import { css } from "@emotion/react";

import styles from "./inline-editor.module.scss";
import { useInlineEditor } from "./useInlineEditor";
import { useTheme } from "@/utils/theme-provider";

export const InlineEditor = forwardRef(
    ({ defaultValue, onSelect, onChange, onNewLine, onRemoveLine }, ref) => {
        const { colors } = useTheme();
        const { handleKeyDown, handleInput, handleLinkClick } = useInlineEditor(
            {
                ref,
                defaultValue,
                onChange,
                onNewLine,
                onRemoveLine,
            }
        );

        return (
            <div
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
                // onMouseOver={handleEditorMouseEnter}
                // onMouseOut={handleEditorMouseLeave}
                onInput={handleInput}
            />
        );
    }
);
InlineEditor.displayName = "InlineEditor";

export default InlineEditor;
