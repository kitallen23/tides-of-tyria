import { useState } from "react";
import { IconButton, useMediaQuery } from "@mui/material";
import { SearchSharp, SettingsSharp } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

import styles from "./layout.module.scss";
import globalStyles from "@/styles/modules/global-styles.module.scss";

import useSearchModal from "@/components/Search/useSearchModal";
import { useTheme } from "@/utils/theme-provider";
import { HOMEPAGE } from "@/utils/constants";
import Logo from "@/components/Logo";
import NavTabs from "@/components/NavTabs";
import UnstyledButton from "@/components/UnstyledButton";

const Header = () => {
    const { colors } = useTheme();
    const { pathname } = useLocation();
    const isSmallScreen = useMediaQuery("(max-width: 768px)");

    const [prevPath, setPrevPath] = useState("");

    const { onOpen: onOpenSearchModal } = useSearchModal();

    return (
        <div className={styles.header}>
            <div className={styles.content}>
                <Link
                    to={HOMEPAGE}
                    className={`${styles.logoLink} ${globalStyles.internalLink}`}
                    aria-label="Go to homepage"
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
                <div className={styles.rightOptions}>
                    <UnstyledButton
                        className={styles.searchBar}
                        onClick={onOpenSearchModal}
                        aria-label="Search Guild Wars 2 Wiki"
                    >
                        <div className={styles.searchBarContent}>
                            {isSmallScreen ? null : "/wiki"}
                            <SearchSharp />
                        </div>
                    </UnstyledButton>
                    <Link
                        to={
                            pathname === "/settings"
                                ? prevPath || HOMEPAGE
                                : "/settings"
                        }
                        className={globalStyles.internalLink}
                        onClick={() => setPrevPath(pathname)}
                        aria-label="Go to site settings"
                    >
                        <IconButton
                            color={
                                pathname === "/settings"
                                    ? "primary"
                                    : "secondary"
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
