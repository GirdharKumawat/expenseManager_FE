import { useNavigate } from "react-router-dom";
import ExpenseCard from "../components/ExpenseCard";
import { useEffect, useState } from "react";
import API_ENDPOINT from "../key";

const API = `${API_ENDPOINT}api/get/expenses`;
const API_DELETE = `${API_ENDPOINT}api/delete/expense/`;
const REFRESH_API = `${API_ENDPOINT}api/token/refresh/`;

function Home() {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [category, setCategory] = useState("all");

    const navigate = useNavigate();

    const getAccessToken = () => localStorage.getItem("accessToken");
    const getRefreshToken = () => localStorage.getItem("refreshToken");

    const IsAuthenticated = () => {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();
        return accessToken && refreshToken;
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
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    return fetchExpenses();
                } else {
                    navigate("/login");
                    throw new Error("Session expired. Please log in again.");
                }
            }

            const data = await response.json();
            setExpenses(data.data);
            setFilteredExpenses(data.data); // initialize filtered list

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
            localStorage.setItem("refreshToken", data.refresh);

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
                const updated = expenses.filter((expense) => expense.id !== id);
                setExpenses(updated);
                setFilteredExpenses(updated.filter(e => category === "all" || e.category === category));
            } else if (response.status === 401) {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    deleteExpense(id);
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

    const updateExpensesList = (cat) => {
        setCategory(cat);
        setFilteredExpenses(
            cat === "all"
                ? expenses
                : expenses.filter((expense) => expense.category === cat)
        );
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
        fetchExpenses();
    }, []);

    useEffect(() => {
        updateExpensesList(category);
    }, [category, expenses]);

    return (
        <div className="mb-16 space-y-4 bg-white p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Your Expenses</h1>
                <select
                    className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                    value={category}
                    onChange={(e) => updateExpensesList(e.target.value)}
                >
                    <option value="all">All Categories</option>
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

            {deleteLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="rounded-xl bg-white px-6 py-4 shadow-xl">
                        <p className="text-lg font-semibold text-black">Deleting expense...</p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex animate-pulse items-center space-x-4 rounded-lg bg-gray-100 p-4"
                        >
                            <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                            <div className="flex w-full flex-col space-y-2">
                                <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                                <div className="h-4 w-1/2 rounded bg-gray-300"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense, index) => (
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
                        strokeWidth={2}
                    >
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
