import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

function ProtectedComponents({ children }) {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { logoutUser, refreshUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            const fun = async () => {
                let x = await refreshUser();
                console.log(x);
            };
            fun();
            console.log(isAuthenticated);
            if (!isAuthenticated) {
                console.log("calling logout user");
                // logoutUser();
                navigate("/login");
            }
        }
    }, [isAuthenticated]);

    return isAuthenticated ? children : null;
}

export default ProtectedComponents;
