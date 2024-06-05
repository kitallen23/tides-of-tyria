import { Tooltip } from "@mui/material";

const ConditionalTooltip = ({ show, children, ...rest }) => {
    return (
        <>
            {show ? (
                <Tooltip {...rest}>{children}</Tooltip>
            ) : (
                children
            )}
        </>
    );
};

export default ConditionalTooltip;
