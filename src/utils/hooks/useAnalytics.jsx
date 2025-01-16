import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

const useAnalytics = () => {
    useEffect(() => {
        if (import.meta.env.MODE === "development") {
            return;
        }
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://a.chuggs.net/x.js";
        script.setAttribute(
            "data-website-id",
            "4d7a4b14-cc7f-4e41-8af1-e33d6ee6c515"
        );
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // const { pathname } = useLocation();
    // useEffect(() => {
    //     if (import.meta.env.MODE === "development") {
    //         return;
    //     }
    //     if (window.umami) {
    //         window.umami.track("page_view", {
    //             pathname,
    //         });
    //     }
    // }, [pathname]);

    return null;
};

export default useAnalytics;
