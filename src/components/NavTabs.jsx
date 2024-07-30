import { Tab, Tabs } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";

import globalStyles from "@/styles/modules/global-styles.module.scss";

const ROUTES = {
    "/": 0,
    "/checklist": 1,
};

const LinkTab = ({ className, ...rest }) => (
    <Tab
        component={Link}
        className={classNames(className, globalStyles.internalLink)}
        {...rest}
    />
);

const NavTabs = () => {
    const { pathname } = useLocation();
    const routeId = ROUTES[pathname] ?? -1;

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
            <LinkTab label="Event Timer" to="/" />
            <LinkTab label="Checklist" to="/checklist" />
        </Tabs>
    );
};

export default NavTabs;
