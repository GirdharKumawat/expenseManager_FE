import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../features/auth/useAuth";

function Account() {
    const navigate = useNavigate();
    const { logoutUser, fetchUser } = useAuth();

    const { username, email } = useSelector((state) => state.auth);
    console.log("Account component rendered with username:", username, "and email:", email);

    useEffect(() => {
        if (!username) {
            console.log("No user data found, fetching user data...");
            fetchUser();
        }
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-6 shadow-md">
            <h1 className="mb-4 text-2xl font-bold text-green-600">Account</h1>

            {username ? (
                <div className="space-y-3">
                    <div className="rounded-lg border border-green-100 bg-green-50 p-4 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800">{username}</h2>
                        <p className="text-sm text-gray-600">Email: {email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700">
                        Logout
                    </button>
                </div>
            ) : (
                <div className="animate-pulse text-sm text-gray-500">Loading user data...</div>
            )}
        </div>
    );
}

export default Account;
