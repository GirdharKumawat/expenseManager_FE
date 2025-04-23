import { useNavigate } from "react-router-dom";
import ExpenseCard from "../components/ExpenseCard";
import { useEffect, useState } from "react";
import API_ENDPOINT from "../key";
const API = `${API_ENDPOINT}api/get/expenses`;
const API_DELETE = `${API_ENDPOINT}api/delete/expense/`;
const REFRESH_API = `${API_ENDPOINT}api/token/refresh/`;

function Home() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [category, setCategory] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate();
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
                    navigate("/login"); // Redirect to login if refresh fails
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
                    navigate("/login");
                }
            }
        } catch (error) {
            console.error("Error deleting expense:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const updateExpencesList = (e) => {
        setCategory(e.target.value)
        console.log("category", e.target.value)
        const category = e.target.value;
        setExpenses(
            category
                ? expenses.filter((expense) => expense.category === category || category === "")
                : expenses
        );
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
        fetchExpenses();
    }, [refreshTrigger,category]); // Fetch expenses when component mounts or refreshToken changes

    return (
        <div className="mb-16 space-y-4 bg-white p-5">
            {/* Add option for category filter */}

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Your Expenses</h1>
                <select
                    className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                    value={category}
                    onChange={(e) => updateExpencesList(e)}>
                    <option value="">All Categories</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Health">Health</option>
                    <option value="Rent">Rent</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            {/* Loading state for deleting expense */}

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
                    {Array.from({ length: 5 }).map((_, index) => (
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
                        className="mb-3 h-10 w-10 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2h2l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2z"
                        />
                    </svg>
                    <p className="text-lg font-semibold text-green-700">No expenses found</p>
                    <p className="mt-1 text-sm text-green-600">Start tracking your spending now!</p>
                </div>
            )}
        </div>
    );
}

export default Home;
