import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";

import globalStyles from "@/styles/modules/global-styles.module.scss";
import { getTitle } from "@/utils/util";

const Login = () => {
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
                <h2>Log in</h2>
            </div>
        </>
    );
};

export default Login;
