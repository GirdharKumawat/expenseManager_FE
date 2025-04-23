import { useNavigate } from "react-router-dom";
import ExpenseCard from "../components/ExpenseCard";
import { useEffect, useState } from "react";
import API_ENDPOINT from "../key";
const API_DELETE = `${API_ENDPOINT}api/delete/expense/`;
const API = `${API_ENDPOINT}api/get/expenses`;
const REFRESH_API = `${API_ENDPOINT}api/token/refresh/`;

function Home() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [category, setCategory] = useState("Food");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const nevigate = useNavigate();
    const getAccessToken = () => localStorage.getItem("accessToken");
    const getRefreshToken = () => localStorage.getItem("refreshToken");
    const IsAuthenticated = () => {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();
        if (!accessToken || !refreshToken) return false;
        return true;
    };
    const isAuthenticated = IsAuthenticated();
    const fetchExpenses = async () => {
        let accessToken = getAccessToken();

        try {
            const response = await fetch(API, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 401) {
                // Token expired → Try refreshing
                const refreshed = await refreshAccessToken();
                console.log("function call refreshAccessToken    ");
                if (refreshed) {
                    return fetchExpenses(); // Retry with new token
                } else {
                    nevigate("/login"); // Redirect to login if refresh fails
                    throw new Error("Session expired. Please log in again.");
                }
            }

            const data = await response.json();
            setExpenses(data.data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    const refreshAccessToken = async () => {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await fetch(REFRESH_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refresh: refreshToken })
            });

            if (!response.ok) throw new Error("Failed to refresh token");

            const data = await response.json();
            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh); // Refresh Token Rotation

            return true;
        } catch (error) {
            console.error("Failed to refresh token:", error);
            return false;
        }
    };
    const deleteExpense = async (id) => {
        setDeleteLoading(true);
        const accessToken = getAccessToken();
        try {
            const response = await fetch(`${API_DELETE}${id}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                // Update state to remove the deleted expense
                setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
                setRefreshTrigger((prev) => prev + 1); // Increment to trigger refresh if needed
            } else if (response.status === 401) {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    deleteExpense(id); // Retry with new token
                } else {
                    nevigate("/login");
                }
            }
        } catch (error) {
            console.error("Error deleting expense:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            nevigate("/login");
        }
        fetchExpenses();
    }, [category, refreshTrigger]);

    return (
        <div className="mb-16 space-y-4 bg-white p-5">
            {deleteLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300">
                    <div className="animate-fadeIn scale-100 transform rounded-xl bg-white px-6 py-4 shadow-xl transition-all duration-300">
                        <p className="text-lg font-semibold text-black">Deleting expense...</p>
                    </div>
                </div>
            )}

            {loading ? (
                // Skeleton Loader for Expenses
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex animate-pulse items-center space-x-4 rounded-lg bg-gray-100 p-4">
                            <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                            <div className="flex w-full flex-col space-y-2">
                                <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                                <div className="h-4 w-1/2 rounded bg-gray-300"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : expenses.length > 0 ? (
                expenses.map((expense, index) => (
                    <ExpenseCard key={index} expense={expense} onDelete={deleteExpense} />
                ))
            ) : (
                <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-green-600 bg-green-50 p-6 text-center shadow-sm">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-green-500 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2h2l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2z"
        />
    </svg>
    <p className="text-lg font-semibold text-green-700">No expenses found</p>
    <p className="text-sm text-green-600 mt-1">Start tracking your spending now!</p>
</div>

            )}
        </div>
    );
}

export default Home;
