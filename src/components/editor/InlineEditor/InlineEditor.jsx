import { forwardRef } from "react";
import { css } from "@emotion/react";
import classNames from "classnames";

import styles from "./inline-editor.module.scss";
import { useInlineEditor } from "./useInlineEditor";
import { useTheme } from "@/utils/theme-provider";

export const InlineEditor = forwardRef(
    (
        {
            id,
            defaultValue,
            disableColor,
            onSelect,
            onChange,
            onNewLine,
            onRemoveLine,
            onFocusPreviousEditor,
            onFocusNextEditor,
            onMouseDown,
        },
        ref
    ) => {
        const { colors } = useTheme();
        const { handleKeyDown, handleInput, handleLinkClick, handlePaste } =
            useInlineEditor({
                ref,
                defaultValue,
                onChange,
                onNewLine,
                onRemoveLine,
                onFocusPreviousEditor,
                onFocusNextEditor,
            });

        return (
            <>
                <div
                    id={id}
                    ref={ref}
                    className={classNames(styles.inlineEditor, "inline-editor")}
                    css={css({
                        a: {
                            textDecoration: "underline",
                            color: disableColor
                                ? undefined
                                : colors?.muted || undefined,
                        },
                        b: {
                            color: disableColor
                                ? undefined
                                : colors?.primary || undefined,
                            a: {
                                color: "inherit",
                            },
                        },
                    })}
                    contentEditable
                    onMouseUp={onSelect}
                    onKeyUp={onSelect}
                    onKeyDown={handleKeyDown}
                    onClick={handleLinkClick}
                    onPointerDown={onMouseDown}
                    onInput={handleInput}
                    onPaste={handlePaste}
                />
            </>
        );
    }
);
InlineEditor.displayName = "InlineEditor";

export default InlineEditor;
