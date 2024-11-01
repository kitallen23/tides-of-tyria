import { forwardRef } from "react";
import { css } from "@emotion/react";

import styles from "./inline-editor.module.scss";
import { useInlineEditor } from "./useInlineEditor";
import { useTheme } from "@/utils/theme-provider";

export const InlineEditor = forwardRef(
    ({ defaultValue, onChange, onNewline, onRemoveLine }, ref) => {
        const { colors } = useTheme();
        const { handleKeyDown, handleInput } = useInlineEditor({
            ref,
            defaultValue,
            onChange,
            onNewline,
            onRemoveLine,
        });

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
                // onMouseUp={handleSelect}
                // onKeyUp={handleSelect}
                onKeyDown={handleKeyDown}
                // onClick={handleLinkClick}
                // onMouseOver={handleEditorMouseEnter}
                // onMouseOut={handleEditorMouseLeave}
                onInput={handleInput}
            />
        );
    }
);
InlineEditor.displayName = "InlineEditor";

export default InlineEditor;
