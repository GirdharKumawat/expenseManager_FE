import API_ENDPOINT from "../../key";

import { useDispatch } from "react-redux";
import { setLoading, setIsAuthenticated, setTokens, setUser,incrementRefreshAttempts } from "./authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router";

/**
 * Custom hook for authentication operations
 * Use this hook in components that need authentication functionality
 */
export function useAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /**
     * Function to login a user
     * @param {Object} credentials - The user's login credentials
     * @returns {Promise<Object>} The login response data
     */
    const loginUser = async (credentials) => {
        try {
            dispatch(setLoading(true));
            const res = await fetch(`${API_ENDPOINT}api/auth/token/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials)
            });

            if (!res.ok) throw new Error("Invalid credentials");

            const data = await res.json();

            // Store tokens in localStorage
            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);

            // Dispatch actions to update state
            dispatch(setLoading(false));
            dispatch(setIsAuthenticated(true));
            dispatch(setTokens({ access: data.access, refresh: data.refresh }));

            // toast notification for successful login
            toast.success("Login successful", {
                description: "You have successfully logged in.",
                duration: 3000
            });
        } catch (err) {
            dispatch(setLoading(false));
            dispatch(setIsAuthenticated(false));
            dispatch(setTokens({ access: "", refresh: "" }));

            // toast notification for login failure
            toast.error("Login failed ", {
                description: err.message,
                duration: 3000
            });
        }
    };

    /**
     * Function to register a new user
     * @param {Object} userData - The user's registration data
     * @returns {Promise<Object>} The signup response data
     */
    const signupUser = async (userData) => {
        try {
            dispatch(setLoading(true));
            let response = await fetch(`${API_ENDPOINT}api/auth/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            if (!response.ok) throw new Error("Signup failed");

            const data = await response.json();

            // Store tokens in localStorage
            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);

            // Dispatch actions to update state
            dispatch(setLoading(false));
            dispatch(setIsAuthenticated(true));
            dispatch(setTokens({ access: data.access, refresh: data.refresh }));
            dispatch(
                setUser({
                    id: data.id || 0,
                    username: data.username || "",
                    email: data.email || ""
                })
            );

            // toast notification for successful signup
            toast.success("Sign up successful", {
                description: "Your account has been created successfully.",
                duration: 3000
            });
        } catch (err) {
            dispatch(setLoading(false));
            dispatch(setIsAuthenticated(false));
            dispatch(setTokens({ access: "", refresh: "" }));

            // toast notification for signup failure
            toast.error("Sign up failed", {
                description: err.message,
                duration: 3000
            });
        }
    };

    // Refresh token logic can be added here

    const refreshUser = async () => {
        try {
            console.log("refresh user at ")
            const refreshToken = localStorage.getItem("refreshToken");
            console.log(refreshToken)
            if (!refreshToken) throw new Error("No refresh token found");

            const response = await fetch(`${API_ENDPOINT}api/auth/token/refresh/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refreshToken })
            });

            if (!response.ok) throw new Error("Failed to refresh token");

            if (response.status === 401) throw new Error("Unauthorized - refresh token expired");
            const data = await response.json();

            localStorage.setItem("accessToken", data.access);

            dispatch(setIsAuthenticated(true));
            dispatch(setTokens({ access: data.access, refresh: data.refresh }));

            return true;
        } catch (err) {
            dispatch(setIsAuthenticated(false));
            dispatch(setTokens({ access: "", refresh: "" }));

            // toast notification for refresh failure
            toast.error("Failed to refresh user", {
                description: err.message,
                duration: 3000
            });

            return false;
        }
    };

    // logout function can be added here if needed
    const logoutUser = () => {
        localStorage.clear();
        dispatch(setLoading(false));
        dispatch(setIsAuthenticated(false));

        dispatch(setTokens({ access: "", refresh: "" }));
        dispatch(setUser({ username: "", email: "" }));

        // toast notification for successful logout
        toast.success("Logout successful", {
            description: "You have successfully logged out.",
            duration: 3000
        });
        navigate('/login')
    };

    const fetchUser = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        try {
            dispatch(setLoading(true));

            const response = await fetch(`${API_ENDPOINT}api/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (!response.ok) throw new Error("Failed to fetch user data");

            if (response.status === 200) {
                const data = await response.json();
               

                dispatch(setLoading(false));
                dispatch(setUser(data.data));    
                dispatch(setIsAuthenticated(true));
            } else if (response.status === 401) {
                const refreshed = await refreshUser();

                if (refreshed) fetchUser();
                else logoutUser();
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    return { loginUser, signupUser, refreshUser, logoutUser, fetchUser};
}
