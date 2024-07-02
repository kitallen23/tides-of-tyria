import { useEffect } from "react";

const getSvg =
    color => `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" fill="${color}"><g transform="scale(1.5, 1.5) translate(-100, -200)"><path d="M295.10 586 c-0.90 -0.55 -1.90 -1.60 -2.20 -2.40 -0.65 -1.55 -1.30 -29.80 -1.40 -60.85 l-0.05 -20 -9.75 -10.50 c-10.75 -11.55 -17.55 -19.25 -18.95 -21.40 -0.80 -1.25 -0.90 -4.90 -1.30 -54.75 -0.20 -29.35 -0.40 -76.90 -0.40 -105.65 l-0.05 -52.30 -30.85 -0.30 c-16.95 -0.20 -36.05 -0.35 -42.45 -0.35 l-11.60 0 -21.55 -22.10 c-21.40 -21.90 -21.55 -22.10 -21.55 -24.15 l0 -2.10 33.85 -0.30 c43.75 -0.45 227 -0.45 268.80 0 l32.35 0.30 0 1.80 c0 1 -0.20 2.10 -0.45 2.50 -0.25 0.40 -10.20 10.50 -22.10 22.40 l-21.70 21.65 -12 0 c-6.60 0 -25.65 0.15 -42.35 0.35 l-30.40 0.30 0 52.05 c-0.05 28.65 -0.25 76.30 -0.45 105.95 l-0.45 53.85 -2 2.65 c-1.10 1.40 -5.10 5.95 -8.90 10.05 -14 15 -16.20 17.60 -17.50 20.20 -1.25 2.45 -1.35 3.15 -1.75 13.50 -0.20 5.95 -0.45 22.90 -0.45 37.60 -0.05 14.70 -0.20 27.65 -0.40 28.75 -0.30 1.60 -0.70 2.20 -2.35 3.10 -2.65 1.50 -7.30 1.60 -9.65 0.15z"/></g><circle cx="150" cy="190" r="45"/><circle cx="450" cy="190" r="45"/></svg>
`;

const useFavicon = color => {
    useEffect(() => {
        const svg = getSvg(color);
        const svgBlob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = url;
        document.head.appendChild(link);

        // Clean up by removing the old favicon
        return () => {
            document.head.removeChild(link);
            URL.revokeObjectURL(url);
        };
    }, [color]);
};

export default useFavicon;
