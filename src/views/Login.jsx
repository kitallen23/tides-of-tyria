import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import { useColorScheme } from "@/utils/color-scheme-provider";
import { getTitle } from "@/utils/util";

const Login = () => {
    const { body: bodyColor } = useColorScheme();

    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (pathname === "/logout") {
            navigate("/login");
        }
    }, [pathname, navigate]);

    const title = useMemo(() => getTitle("Log in"), []);
    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div className={`${globalStyles.pageContent}`}>
                <h1 style={{ color: bodyColor }}>Log in</h1>
            </div>
        </>
    );
};

export default Login;
