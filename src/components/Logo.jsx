const Logo = ({ color, size = 600, ...rest }) => {
    return (
        <div
            {...rest}
            css={{
                display: "flex",
                "svg :not(g)": {
                    transition: "fill 0.3s ease-in-out",
                },
                "svg *": {
                    fill: color,
                },
            }}
        >
            <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 600 600"
                preserveAspectRatio="xMidYMid meet"
            >
                <g>
                    <path d="M295.10 586 c-0.90 -0.55 -1.90 -1.60 -2.20 -2.40 -0.65 -1.55 -1.30 -29.80 -1.40 -60.85 l-0.05 -20 -9.75 -10.50 c-10.75 -11.55 -17.55 -19.25 -18.95 -21.40 -0.80 -1.25 -0.90 -4.90 -1.30 -54.75 -0.20 -29.35 -0.40 -76.90 -0.40 -105.65 l-0.05 -52.30 -30.85 -0.30 c-16.95 -0.20 -36.05 -0.35 -42.45 -0.35 l-11.60 0 -21.55 -22.10 c-21.40 -21.90 -21.55 -22.10 -21.55 -24.15 l0 -2.10 33.85 -0.30 c43.75 -0.45 227 -0.45 268.80 0 l32.35 0.30 0 1.80 c0 1 -0.20 2.10 -0.45 2.50 -0.25 0.40 -10.20 10.50 -22.10 22.40 l-21.70 21.65 -12 0 c-6.60 0 -25.65 0.15 -42.35 0.35 l-30.40 0.30 0 52.05 c-0.05 28.65 -0.25 76.30 -0.45 105.95 l-0.45 53.85 -2 2.65 c-1.10 1.40 -5.10 5.95 -8.90 10.05 -14 15 -16.20 17.60 -17.50 20.20 -1.25 2.45 -1.35 3.15 -1.75 13.50 -0.20 5.95 -0.45 22.90 -0.45 37.60 -0.05 14.70 -0.20 27.65 -0.40 28.75 -0.30 1.60 -0.70 2.20 -2.35 3.10 -2.65 1.50 -7.30 1.60 -9.65 0.15z" />
                    <path d="M104.75 505.55 c-3.85 -1 -6.60 -3.45 -8.40 -7.50 -0.75 -1.75 -0.90 -2.95 -0.75 -5.55 0.30 -3.80 1.20 -6.05 3.80 -9 2.35 -2.75 5.05 -4 8.90 -4 6.90 0 11.80 3.05 13.40 8.45 1.50 5.15 0.90 9.55 -1.85 13.15 -2.45 3.20 -5.25 4.55 -9.80 4.70 -2.10 0.10 -4.45 0 -5.30 -0.25z" />
                    <path d="M484.75 504.80 c-3.20 -1.45 -5.35 -3.65 -6.15 -6.10 -0.80 -2.50 -1.35 -8.70 -0.90 -10.40 0.45 -1.75 3.95 -5.60 6.75 -7.40 1.95 -1.20 2.75 -1.40 5.80 -1.40 5.05 0 8.25 1.05 10.45 3.50 2.60 2.85 3.30 4.95 3.30 9.70 -0.05 6.10 -2.25 10.15 -6.75 12.25 -3.25 1.50 -9.10 1.45 -12.50 -0.15z" />
                    <path d="M211.25 503.10 c-11.45 -4.65 -24.80 -11.95 -38.40 -20.95 -25.15 -16.60 -47.85 -40.25 -63.75 -66.40 -18.85 -31.05 -26.70 -54.50 -31.85 -95.10 l-0.35 -2.65 -11.05 -0.05 c-20.70 -0.05 -47 -0.85 -48.75 -1.45 -5.20 -1.90 -4.55 -12.85 0.90 -15.15 0.75 -0.30 12.30 -0.75 28.25 -1.10 27.55 -0.65 29.80 -0.80 30.50 -2.65 0.15 -0.45 0.55 -3.55 0.80 -6.85 1.75 -22.70 4.15 -36.75 8.05 -47.10 l0.95 -2.65 2.60 0 c2.55 0 7.30 2.35 34.25 16.85 l4.10 2.25 0 2.05 c0 1.15 -0.65 7.40 -1.45 13.85 -0.85 6.45 -1.65 14.50 -1.85 17.80 l-0.35 6.05 24.45 0.35 c13.45 0.20 25.80 0.55 27.40 0.80 4.55 0.70 6.80 3.35 6.80 8 0 4.65 -2.25 7.30 -6.80 7.95 -1.60 0.25 -12.15 0.60 -23.45 0.75 -28.10 0.45 -27.55 0.35 -27.30 4.60 0.85 17.25 11.90 48.75 23.65 67.45 7.95 12.65 13.30 19.55 22.90 29.45 14.80 15.25 25.20 23.20 45.15 34.50 l6.85 3.90 -0.05 21.85 c0 12 -0.15 22.70 -0.35 23.80 l-0.35 2 -2.75 0.15 c-2.30 0.10 -3.70 -0.30 -8.75 -2.30z" />
                    <path d="M376.70 504.15 c-0.50 -1.95 0.20 -39.85 0.80 -43.40 0.25 -1.60 0.90 -3.35 1.35 -3.80 0.50 -0.50 4.60 -3.10 9.15 -5.85 17.45 -10.40 24.65 -15.85 36.60 -27.50 11.25 -11 20.25 -22.15 26.95 -33.45 9.15 -15.35 16.85 -33.40 20.60 -48.40 1.85 -7.45 3.55 -18.05 3.25 -20.50 -0.30 -2.95 -0.55 -2.95 -27.90 -3.25 -26.95 -0.30 -26.55 -0.25 -28.70 -3.15 -1.45 -1.95 -1.50 -8.95 -0.15 -11.05 2 -3 1.85 -3 36.60 -3.75 19.35 -0.40 20.40 -0.60 20.85 -3.45 0.30 -2.20 -0.45 -10.40 -2.10 -21.90 -0.80 -5.80 -1.50 -11.20 -1.50 -11.95 0 -2.65 2.95 -4.60 19.25 -12.75 14.60 -7.30 15.60 -7.75 18.75 -7.90 l3.40 -0.20 0.80 2.40 c2.05 6.30 5.30 22.95 6.50 33.70 0.65 5.55 1.80 19.20 1.80 21.30 0 0.40 7.10 0.65 24.90 0.95 29.85 0.40 34.20 0.70 35.95 2.35 1.90 1.75 2.65 3.60 2.65 6.40 0 4.75 -2.25 7.35 -7.05 8 -1.75 0.25 -15.20 0.60 -29.80 0.80 -14.65 0.20 -26.65 0.35 -26.65 0.40 0 0.80 -2.25 17.35 -2.80 20.55 -3.50 21.05 -8.95 37.95 -18.65 58.05 -7.80 16.10 -13.70 25.65 -24 38.70 -10.45 13.30 -25.60 28.55 -38.75 38.95 -17.35 13.75 -50.30 31.05 -59.05 31.05 -2.55 0 -2.75 -0.10 -3.05 -1.35z" />
                    <path d="M217.10 323.55 c-5.65 -1.95 -7.60 -5.45 -7.60 -13.45 0 -4.75 1 -7.05 4.20 -10 3 -2.75 4 -3.10 9.05 -3.10 3.55 0 4.50 0.20 6.80 1.40 5.10 2.65 7.40 7.55 6.65 14.20 -0.20 1.75 -0.55 3.65 -0.75 4.25 -0.70 1.85 -4.55 5.75 -6.70 6.70 -2.65 1.25 -8.10 1.20 -11.65 0z" />
                    <path d="M371.60 324 c-2.65 -0.60 -5.35 -2.85 -6.90 -5.65 -1.30 -2.30 -1.45 -3.10 -1.45 -7.10 0 -6.60 2 -10.25 7 -12.90 1.60 -0.85 2.90 -1.10 6.75 -1.10 4.30 0 5 0.15 7.05 1.35 2.90 1.70 5.15 4.25 5.95 6.70 0.40 1.20 0.55 3.45 0.40 6.25 -0.40 7.05 -2.80 10.60 -8.20 12.25 -2.50 0.75 -7.85 0.85 -10.60 0.20z" />
                    <path d="M294.85 180.95 c-7.60 -1.80 -12.15 -8.65 -11.75 -17.60 0.20 -4.80 1.20 -7.15 5 -11.75 3.35 -4.10 3.70 -6.15 3.10 -18.15 -0.55 -11.55 -0.75 -11.95 -5.25 -11.95 -6.70 0 -22.10 3.05 -35.90 7.05 -15.85 4.65 -33.80 13.50 -45.95 22.65 -2.65 2.05 -8.95 7.20 -14 11.50 -14.75 12.60 -14 12.35 -21.10 6.20 -6.80 -5.95 -23.45 -22.40 -24.30 -24 -1.05 -2.05 -0.90 -5 0.40 -6.70 3.40 -4.55 12.05 -12.25 21.40 -18.95 21.20 -15.30 42.95 -26.40 66.50 -33.95 14.20 -4.60 24.95 -6.90 40.95 -8.80 13.40 -1.60 15 -1.95 15.85 -3.25 0.95 -1.45 1.65 -13.10 1.70 -28.50 0.05 -15.40 0.70 -27.80 1.55 -29.50 0.95 -1.95 3.80 -2.85 8.30 -2.65 4.90 0.25 5.60 0.95 6.20 6.20 0.25 2.20 0.65 15 0.95 28.45 0.25 13.50 0.65 25 0.80 25.60 0.35 1.35 2.35 1.80 12.95 2.90 23.85 2.50 44.45 8 66.60 17.80 23.25 10.30 45.65 25.15 61.50 40.75 l5.15 5.05 0 2.90 c0 3.70 -0.25 4.05 -13.35 16.35 -14.30 13.50 -14.85 13.90 -17.65 13.90 -2.80 0 -4.10 -0.80 -9.50 -5.80 -13.65 -12.75 -24.10 -20.25 -37.75 -27.05 -10.80 -5.45 -20.75 -9.45 -31.25 -12.55 -9.10 -2.70 -28.15 -6.10 -34.25 -6.10 -2 0 -2.25 0.15 -2.60 1.40 -0.50 1.70 -0.50 24.40 -0.05 26.10 0.20 0.70 1.25 2.25 2.40 3.50 1.10 1.25 2.60 3.45 3.30 4.90 1.15 2.30 1.35 3.30 1.35 7.50 0.05 4 -0.15 5.30 -1.10 7.50 -1.60 3.60 -6.20 7.80 -9.65 8.85 -2.80 0.80 -7.55 0.90 -10.55 0.20z" />
                    <path d="M484.70 123 c-4.75 -2.40 -7.70 -7.05 -7.70 -12.40 0 -3.60 0.75 -5.70 3.25 -9.10 2.60 -3.50 4.95 -4.50 10.65 -4.50 5.40 0 7.10 0.60 9.70 3.30 2.20 2.35 3.25 4.70 3.70 8.30 0.75 6.25 -1.80 11.50 -6.75 14.05 -3.55 1.75 -9.60 1.95 -12.85 0.35z" />
                    <path d="M102.25 122.75 c-2.15 -1.15 -4.70 -3.70 -5.80 -5.85 -0.70 -1.40 -0.95 -2.90 -0.95 -6.15 0 -5 0.75 -7.15 3.40 -9.90 3.05 -3.20 5.20 -4 10.35 -4.05 5.05 -0.05 6.65 0.55 9.90 3.60 5.60 5.40 3.95 18.40 -2.80 21.95 -2.35 1.25 -12.05 1.50 -14.10 0.40z" />
                </g>
            </svg>
        </div>
    );
};

export default Logo;
