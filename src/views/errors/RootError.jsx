import { useEffect, useMemo } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import globalStyles from "@/styles/modules/global-styles.module.scss";
import styles from "./errors.module.scss";

import { ThemeProvider } from "@/utils/theme-provider";
import { getTitle } from "@/utils/util";
import useApp from "@/useApp";
import Logo from "@/components/Logo";

const RootError = () => {
    const { themeState, muiTheme } = useApp();

    const error = useRouteError();
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

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <MuiThemeProvider theme={muiTheme}>
                <ThemeProvider
                    value={{
                        ...themeState,
                    }}
                >
                    <div className={styles.errorPage}>
                        <div className={styles.innerWrapper}>
                            <div className={styles.logo}>
                                <Logo
                                    color={themeState.colors.body}
                                    size={100}
                                />
                            </div>
                            <div className={styles.text}>
                                <div>{errorStatus || "Error"}</div>
                                <div>
                                    {errorText || "Something went wrong."}
                                </div>
                            </div>
                            <div className={styles.buttons}>
                                <a
                                    href="/"
                                    className={globalStyles.internalLink}
                                >
                                    <Button color="primary">
                                        Return to homepage
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </ThemeProvider>
            </MuiThemeProvider>
        </>
    );
};

export default RootError;
