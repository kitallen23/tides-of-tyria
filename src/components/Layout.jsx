import styles from "@/styles/modules/layout.module.scss";
import globalStyles from "@/styles/modules/global-styles.module.scss";
import { IconButton } from "@mui/material";
import { SettingsSharp } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

import { useTheme } from "@/utils/theme-provider";
import { HOMEPAGE } from "@/utils/constants";
import Logo from "@/components/Logo";

const Header = () => {
    const { colors } = useTheme();
    const { pathname } = useLocation();

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
                <Link
                    to={pathname === "/settings" ? HOMEPAGE : "/settings"}
                    className={globalStyles.internalLink}
                >
                    <IconButton
                        aria-label="settings"
                        color="secondary"
                        sx={{
                            fontSize: "1.5rem",
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
