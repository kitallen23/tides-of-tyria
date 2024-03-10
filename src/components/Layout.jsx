import styles from "@/styles/modules/layout.module.scss";
import { IconButton } from "@mui/material";
import { SettingsSharp } from "@mui/icons-material";
import { Link } from "react-router-dom";

import { useColorScheme } from "@/utils/color-scheme-provider";
import { HOMEPAGE } from "@/utils/constants";
import kanagawaLogo from "@/assets/TyriaTracker_kanagawa.png";
import gruvboxDarkLogo from "@/assets/TyriaTracker_gruvbox_dark.png";

const LOGOS = {
    kanagawa: kanagawaLogo,
    gruvbox_dark: gruvboxDarkLogo,
};

const Header = () => {
    const { colorScheme } = useColorScheme();

    return (
        <div className={styles.header}>
            <div className={styles.content}>
                <Link to={HOMEPAGE} className={styles.logoLink}>
                    <img
                        src={LOGOS?.[colorScheme] || LOGOS.kanagawa}
                        alt="Logo"
                        height={48}
                    />
                    <div>
                        <div>Tyria</div>
                        <div>Tracker</div>
                    </div>
                </Link>
                <Link to="/settings">
                    <IconButton aria-label="settings" color="body">
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
