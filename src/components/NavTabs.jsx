import { Tab, Tabs, useMediaQuery } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import { ChecklistSharp, TimelineSharp } from "@mui/icons-material";

const ROUTES = {
    "/": 0,
    "/checklist": 1,
};

const LinkTab = ({ className, ...rest }) => (
    <Tab
        component={Link}
        className={classNames(className, globalStyles.internalLink)}
        sx={{ minWidth: 0 }}
        {...rest}
    />
);

const NavTabs = () => {
    const { pathname } = useLocation();
    const routeId = ROUTES[pathname] ?? false;
    const isSmallScreen = useMediaQuery("(max-width: 768px)");

    return (
        <Tabs
            value={routeId}
            role="navigation"
            sx={{
                height: "100%",
                "& .MuiTabs-flexContainer": {
                    height: "100%",
                },
            }}
        >
            <LinkTab
                label={
                    isSmallScreen ? (
                        <TimelineSharp sx={{ fontSize: "1.5em" }} />
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gap: "0.5rem",
                                gridTemplateColumns: "auto 1fr",
                                alignItems: "center",
                            }}
                        >
                            <TimelineSharp />
                            Event Timer
                        </div>
                    )
                }
                to="/"
                aria-label="Go to Guild Wars 2 event timer page"
            />
            <LinkTab
                label={
                    isSmallScreen ? (
                        <ChecklistSharp sx={{ fontSize: "1.5em" }} />
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gap: "0.5rem",
                                gridTemplateColumns: "auto 1fr",
                                alignItems: "center",
                            }}
                        >
                            <ChecklistSharp />
                            Checklist
                        </div>
                    )
                }
                to="/checklist"
                aria-label="Go to checklist page"
            />
        </Tabs>
    );
};

export default NavTabs;
