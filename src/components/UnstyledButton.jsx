import classNames from "classnames";

const UnstyledButton = ({ children, className, onClick, ...props }) => (
    <button
        className={classNames("unstyled-button", className)}
        onClick={onClick}
        {...props}
    >
        {children}
    </button>
);

export default UnstyledButton;
