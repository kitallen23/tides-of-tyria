import { useState, useEffect, useMemo } from "react";
import {
    isRouteErrorResponse,
    // useLocation,
    // useNavigate,
    useRouteError,
} from "react-router-dom";
import styles from "@/styles/modules/errors.module.scss";
import { getTitle, detectColorScheme } from "@/utils/util";
import { COLORS /*, HOMEPAGE */ } from "@/utils/constants";
import { Helmet } from "react-helmet";

const Error404 = () => {
    const [colorScheme, setColorScheme] = useState();

    useEffect(() => {
        const colorScheme = detectColorScheme();
        setColorScheme(colorScheme);
        document
            .querySelector('meta[name="theme-color"]')
            .setAttribute("content", COLORS.primary);
    }, []);
    const error = useRouteError();

    useEffect(() => {
        // Set document with a `data-theme` attribute
        document.documentElement.setAttribute("data-theme", colorScheme);
    }, [colorScheme]);

    useEffect(() => {
        console.error(`Error: `, error);
    }, [error]);

    const errorText = useMemo(() => {
        if (isRouteErrorResponse(error)) {
            if (error.status === 404) {
                return "This page doesn't exist!";
            }

            if (error.status === 401) {
                return "You aren't authorized to see this.";
            }

            if (error.status === 503) {
                return "Looks like our API is down.";
            }
            return "Something went wrong.";
        }
    }, [error]);
    const errorStatus = useMemo(() => {
        if (error.status === 404) {
            return "404";
        }
        if (error.status === 401) {
            return "401";
        }
        if (error.status === 503) {
            return "503";
        }
        return;
    }, [error]);

    const title = useMemo(
        () => getTitle(errorStatus || "Error"),
        [errorStatus]
    );

    // const navigate = useNavigate();
    // const location = useLocation();
    // const goBack = () => {
    //     if (location?.key !== "default") {
    //         navigate(-1);
    //     }
    // };
    // const goHome = () => {
    //     navigate(`/${HOMEPAGE}`, {
    //         replace: true,
    //     });
    // };

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div className={styles.errorPage}>
                <div className={styles.innerWrapper}>
                    <div className={styles.text}>
                        <div>{errorStatus || "Error"}</div>
                        <div>{errorText || "Something went wrong."}</div>
                    </div>
                    {/*<div className={styles.buttons}>
                        {(location?.key || "") === "default" ? null : (
                            <Button onClick={goBack} color={COLORS.primary}>
                                Go back
                            </Button>
                        )}
                        <Button
                            onClick={goHome}
                            color={
                                colorScheme === "dark"
                                    ? COLORS.bodyLight
                                    : COLORS.body
                            }
                            variant="outline"
                            buttonStyle={{
                                border: "transparent",
                                borderFocus: "transparent",
                            }}
                        >
                            Return to homepage
                        </Button>
                    </div>*/}
                </div>
            </div>
        </>
    );
};

export default Error404;
