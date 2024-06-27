import { useTheme } from "@/utils/theme-provider";

const InfoIcon = () => {
    const { colors } = useTheme();
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{ minWidth: "24px" }}
        >
            <path
                fill={colors.info}
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM11 10h2v7h-2v-7zm0-4h2v2h-2V6z"
            />
        </svg>
    );
};

export default InfoIcon;
