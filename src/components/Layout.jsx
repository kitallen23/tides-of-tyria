import styles from "@/styles/modules/layout.module.scss";
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
                <Link to={HOMEPAGE} className={styles.logoLink}>
                    <Logo size={48} color={colors.primary} />
                    <div className={`${styles.title} transition-color`}>
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
                <Link to={pathname === "/settings" ? HOMEPAGE : "/settings"}>
                    <IconButton aria-label="settings" color="secondary">
                        <SettingsSharp />
                    </IconButton>
                </Link>
            </div>
        </div>
    );
};

const PageContent = ({ children }) => {
    return <div className={styles.pageContent}>{children}</div>;
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
