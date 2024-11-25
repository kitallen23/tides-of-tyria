import styles from "./layout.module.scss";
import globalStyles from "@/styles/modules/global-styles.module.scss";
import { IconButton } from "@mui/material";
import { SettingsSharp } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

import { useTheme } from "@/utils/theme-provider";
import { HOMEPAGE } from "@/utils/constants";
import Logo from "@/components/Logo";
import NavTabs from "@/components/NavTabs";

const Header = () => {
    const { colors } = useTheme();
    const { pathname } = useLocation();

    const [prevPath, setPrevPath] = useState("");

    return (
        <div className={styles.header}>
            <div className={styles.content}>
                <Link
                    to={HOMEPAGE}
                    className={`${styles.logoLink} ${globalStyles.internalLink}`}
                >
                    <Logo size={48} color={colors.primary} />
                    <div
                        className={`${styles.title} transition-color`}
                        style={{
                            color: colors.primary,
                        }}
                    >
                        <div>TIDES</div>
                        <div
                            css={{
                                "&:before,&:after": {
                                    backgroundColor: colors.primary,
                                },
                            }}
                        >
                            OF
                        </div>
                        <div>TYRIA</div>
                    </div>
                </Link>
                <NavTabs />
                <Link
                    to={
                        pathname === "/settings"
                            ? prevPath || HOMEPAGE
                            : "/settings"
                    }
                    className={globalStyles.internalLink}
                    onClick={() => setPrevPath(pathname)}
                >
                    <IconButton
                        aria-label="settings"
                        color={
                            pathname === "/settings" ? "primary" : "secondary"
                        }
                        sx={{
                            fontSize: "1.5em",
                        }}
                    >
                        <SettingsSharp />
                    </IconButton>
                </Link>
            </div>
        </div>
    );
};

const PageContent = ({ children }) => {
    return (
        <div className={styles.pageContent} id="page-content">
            {children}
        </div>
    );
};

const Layout = ({ children }) => {
    return (
        <div className={styles.layoutWrapper}>
            <Header />
            <PageContent>{children}</PageContent>
        </div>
    );
};

export default Layout;
