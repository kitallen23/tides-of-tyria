// import classNames from "classnames";
import styles from "@/styles/modules/layout.module.scss";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// import { HOMEPAGE } from "@/utils/constants";
// import { useColorScheme } from "@/utils/color-scheme-provider";
// import { Tooltip } from "@mui/material";

// const ROUTES = [
//     {
//         name: "Activity",
//         path: "/",
//         key: "activity",
//         icon: faChartMixed,
//         exact: true,
//     },
//     { name: "Users", path: "/users", key: "users", icon: faUsers },
//     { name: "Admins", path: "/admins", key: "admins", icon: faUserLock },
//     { name: "API Keys", path: "/api-keys", key: "api-keys", icon: faCode },
// ];

const Header = () => {
    // const { colorScheme, setColorScheme, body: bodyColor } = useColorScheme();
    // const navigate = useNavigate();

    // const onClick = () => {
    //     navigate(`/${HOMEPAGE}`);
    // };

    return (
        <div className={styles.header}>
            {/*<img
                src={LOGOS.themeNoText}
                alt="Logo"
                height={32}
                width={64}
                onClick={onClick}
            />*/}
            {/*<Button
                className={styles.themeButton}
                onClick={() =>
                    setColorScheme(colorScheme === "light" ? "dark" : "light")
                }
                variant="outline"
                buttonStyle={{
                    padding: "sm",
                    border: "transparent",
                }}
                style={{
                    paddingLeft: "0.25em",
                    paddingRight: "0.25em",
                }}
                color={bodyColor}
            >
                <FontAwesomeIcon
                    icon={colorScheme === "dark" ? faSunBright : faMoon}
                    fixedWidth
                />
            </Button>*/}
            Temp
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

