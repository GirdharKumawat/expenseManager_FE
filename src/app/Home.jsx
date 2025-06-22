import { useNavigate } from "react-router-dom";
import ExpenseCard from "../components/ExpenseCard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useExpense from "../features/expenses/useExpense";

function Home() {
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [category, setCategory] = useState("all");
    const navigate = useNavigate();
    const { getExpenses, deleteExpense } = useExpense();

    const { isAuthenticated } = useSelector((state) => state.auth);
    const { expenses, loading } = useSelector((state) => state.expense);

    // Check if the user is authenticated and has expenses, otherwise redirect to login or fetch expenses
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else if (expenses.length <= 0) {
            getExpenses();
        }
    }, [isAuthenticated]);

    // Update filtered expenses when category or expenses change
    useEffect(() => {
        console.log("--------- Category or expenses changed ---------");
        setFilteredExpenses(
            category === "all"
                ? expenses
                : expenses.filter((expense) => expense.category === category)
        );
    }, [category, expenses]);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    return (
        <div className="mb-16 space-y-4 bg-white p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Your Expenses</h1>

                <select
                    className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                    value={category}
                    onChange={handleCategoryChange}>
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

            {loading === "delete" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="rounded-xl bg-white px-6 py-4 shadow-xl">
                        <p className="text-lg font-semibold text-black">Deleting expense...</p>
                    </div>
                </div>
            )}

            {loading === "get" ? (
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
            ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense, index) => (
                    <ExpenseCard
                        key={index}
                        expense={expense}
                        onDelete={() => deleteExpense(expense.id)}
                    />
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
