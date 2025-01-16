import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useAnalytics = () => {
    const { pathname } = useLocation();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (import.meta.env.MODE === "development") {
            return;
        }
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://a.chuggs.net/x";
        script.setAttribute(
            "data-website-id",
            "4d7a4b14-cc7f-4e41-8af1-e33d6ee6c515"
        );
        script.setAttribute("data-auto-track", false);
        script.onload = () => setIsReady(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (import.meta.env.MODE === "development") {
            return;
        }
        if (isReady && window.umami) {
            window.umami.track(props => ({ ...props, url: pathname }));
        }
    }, [pathname, isReady]);

    return null;
};

export default useAnalytics;
