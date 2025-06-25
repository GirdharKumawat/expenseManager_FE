 
import { Pie, Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useExpense from "../features/expenses/useExpense";
import { useSelector } from "react-redux";

ChartJS.register(
    ArcElement,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

export default function ExpenseAnalysisPage() {
    const { expenses, loading } = useSelector((state) => state.expense);
    const { getExpenses } = useExpense();

    const [viewMode, setViewMode] = useState("monthly");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!expenses || expenses.length === 0) {
            getExpenses()
        }
    }, [expenses]);

    const groupByCategory = () => {
        const categories = {};
        expenses.forEach(({ category, amount }) => {
            categories[category] = (categories[category] || 0) + parseFloat(amount);
        });
        return categories;
    };

    const groupByTime = () => {
        const timeMap = new Map();
        
        expenses.forEach(({ date, amount }) => {
            const dateObj = new Date(date);
            let key, sortKey;

            if (viewMode === "monthly") {
                // Create a sortable key (YYYY-MM format) and display key
                sortKey = dateObj.toISOString().slice(0, 7); // "2024-01" format
                key = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric"
                });
            } else {
                // For daily view, sort by full date
                sortKey = dateObj.toISOString().slice(0, 10); // "2024-01-15" format
                key = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                });
            }

            if (!timeMap.has(sortKey)) {
                timeMap.set(sortKey, { displayKey: key, amount: 0 });
            }
            timeMap.get(sortKey).amount += parseFloat(amount);
        });

        // Sort by the sortKey (chronological order)
        const sortedEntries = Array.from(timeMap.entries()).sort((a, b) => 
            a[0].localeCompare(b[0])
        );

        // Return sorted object with display keys
        const result = {};
        sortedEntries.forEach(([sortKey, { displayKey, amount }]) => {
            result[displayKey] = amount;
        });

        return result;
    };

    const calculateTotalExpenses = () => {
        return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
    };

    const getMostExpensiveCategory = () => {
        const categoryData = groupByCategory();
        const maxCategory = Object.keys(categoryData).reduce(
            (a, b) => (categoryData[a] > categoryData[b] ? a : b),
            ""
        );
        return { category: maxCategory, amount: categoryData[maxCategory] };
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="space-y-4 text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="font-medium text-slate-600">Loading your expense analysis...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <svg
                            className="h-8 w-8 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-slate-800">
                        Something went wrong
                    </h3>
                    <p className="mb-6 text-slate-600">{error}</p>
                    <button
                        onClick={getExpenses}
                        className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // No data state
    if (expenses.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <svg
                            className="h-8 w-8 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-slate-800">No expenses found</h3>
                    <p className="text-slate-600">
                        Start adding expenses to see your analysis here.
                    </p>
                </div>
            </div>
        );
    }

    const categoryData = groupByCategory();
    const timeData = groupByTime();
    const totalExpenses = calculateTotalExpenses();
    const topCategory = getMostExpensiveCategory();

    // Enhanced chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    }
                }
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                cornerRadius: 8,
                bodyFont: {
                    size: 13
                },
                titleFont: {
                    size: 14,
                    weight: "bold"
                },
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ₹${context.parsed.toFixed(2)}`;
                    }
                }
            }
        }
    };

    const pieChartData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                data: Object.values(categoryData),
                backgroundColor: [
                    "#6366F1",
                    "#8B5CF6",
                    "#EC4899",
                    "#EF4444",
                    "#F59E0B",
                    "#10B981",
                    "#06B6D4",
                    "#84CC16",
                    "#F97316"
                ],
                borderWidth: 0,
                hoverOffset: 8
            }
        ]
    };

    const barChartData = {
        labels: Object.keys(timeData),
        datasets: [
            {
                label: `${viewMode === "daily" ? "Daily" : "Monthly"} Expenses`,
                data: Object.values(timeData),
                backgroundColor: "rgba(99, 102, 241, 0.8)",
                borderColor: "#6366F1",
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
            }
        ]
    };

    const lineChartData = {
        labels: Object.keys(timeData),
        datasets: [
            {
                label: "Expense Trend",
                data: Object.values(timeData),
                borderColor: "#6366F1",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: "#6366F1",
                pointBorderColor: "#fff",
                pointBorderWidth: 2
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header Section */}
            <div className="border-b border-slate-200 bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Expense Analysis</h1>
                            <p className="mt-2 text-slate-600">
                                Track and analyze your spending patterns
                            </p>
                        </div>

                        {/* View Mode Selector */}
                        <div className="flex items-center gap-3 rounded-lg bg-slate-100 p-1">
                            <button
                                onClick={() => setViewMode("monthly")}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                                    viewMode === "monthly"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}>
                                Monthly
                            </button>
                            <button
                                onClick={() => setViewMode("daily")}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                                    viewMode === "daily"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}>
                                Daily
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl  space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                   
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total Expenses</p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    &#8377;{totalExpenses.toFixed(2)}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <span className="text-lg font-bold text-blue-600">₹</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Top Category</p>
                                <p className="mt-1 text-lg font-bold text-slate-900">
                                    {topCategory.category}
                                </p>
                                <p className="text-sm text-slate-500">
                                    &#8377;{topCategory.amount?.toFixed(2)}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                <svg
                                    className="h-6 w-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Categories</p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {Object.keys(categoryData).length}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <svg
                                    className="h-6 w-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Category Distribution */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Spending by Category
                        </h2>
                        <div className="h-80">
                            <Pie data={pieChartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Time-based Breakdown */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            {viewMode === "daily" ? "Daily" : "Monthly"} Breakdown
                        </h2>
                        <div className="h-80">
                            <Bar data={barChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Trend Chart - Full Width */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">Expense Trend</h2>
                    <div className="h-80">
                        <Line data={lineChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Bottom spacing for mobile navigation */}
            <div className="h-32 lg:h-8"></div>
        </div>
    );
}