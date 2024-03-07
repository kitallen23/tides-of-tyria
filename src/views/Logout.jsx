import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/auth-provider";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Logs the current user out & redirects to the login screen
 **/
const Logout = () => {
    const queryClient = useQueryClient();
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        queryClient.invalidateQueries();
        navigate("/login");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

export default Logout;

