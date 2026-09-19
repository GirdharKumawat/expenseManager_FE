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
    Legend,
    Filler
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useExpense from "../features/expenses/useExpense";
import { useSelector } from "react-redux";
import { paymentModes, categories } from "../components/categories";
import { PieChart, BarChart2, TrendingUp, Wallet, Layers, ChevronDown, RefreshCw } from "lucide-react";

ChartJS.register(
    ArcElement,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler
);

export default function ExpenseAnalysisPage() {
    const { expenses, loading } = useSelector((state) => state.expense);

    const [paymentType, setPaymentType] = useState("all");
    const [category, setCategory] = useState("all");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const expensesMonths = Array.from(
        new Set(
            expenses.map((expense) => {
                const date = new Date(expense.date);
                return `${months[date.getMonth()]} ${date.getFullYear()}`;
            })
        )
    );
    const defaultMonth = `${months[new Date().getMonth()]} ${new Date().getFullYear()}`;
    const [monthFilter, setMonthFilter] = useState(
        expensesMonths.includes(defaultMonth) ? defaultMonth : "all"
    );

    const handlePaymentTypeChange = (e) => setPaymentType(e.target.value);
    const handleCategoryChange = (e) => setCategory(e.target.value);
    const handleMonthFilterChange = (e) => setMonthFilter(e.target.value);

    const filteredExpenses = expenses.filter((expense) => {
        const matchesCategory = category === "all" || expense.category === category;
        const matchesPaymentType = paymentType === "all" || expense.paymentType === paymentType;
        const expenseDate = new Date(expense.date);
        const matchesMonth =
            monthFilter === "all" ||
            monthFilter === `${months[expenseDate.getMonth()]} ${expenseDate.getFullYear()}`;
        return matchesCategory && matchesPaymentType && matchesMonth;
    });

    const { getExpenses } = useExpense();
    const [viewMode, setViewMode] = useState("monthly");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!expenses || expenses.length === 0) {
            getExpenses();
        }
    }, [expenses]);

    const groupByCategory = () => {
        const catMap = {};
        filteredExpenses.forEach(({ category, amount }) => {
            catMap[category] = (catMap[category] || 0) + parseFloat(amount);
        });
        return catMap;
    };

    const groupByTime = () => {
        const timeMap = new Map();
        filteredExpenses.forEach(({ date, amount }) => {
            const dateObj = new Date(date);
            let key, sortKey;
            if (viewMode === "monthly") {
                sortKey = dateObj.toISOString().slice(0, 7);
                key = dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });
            } else {
                sortKey = dateObj.toISOString().slice(0, 10);
                key = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }
            if (!timeMap.has(sortKey)) {
                timeMap.set(sortKey, { displayKey: key, amount: 0 });
            }
            timeMap.get(sortKey).amount += parseFloat(amount);
        });
        const sortedEntries = Array.from(timeMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
        const result = {};
        sortedEntries.forEach(([sortKey, { displayKey, amount }]) => {
            result[displayKey] = amount;
        });
        return result;
    };

    const calculateTotalExpenses = () => {
        return filteredExpenses.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
    };

    const getMostExpensiveCategory = () => {
        const categoryData = groupByCategory();
        const maxCategory = Object.keys(categoryData).reduce(
            (a, b) => (categoryData[a] > categoryData[b] ? a : b),
            ""
        );
        return { category: maxCategory || "None", amount: categoryData[maxCategory] || 0 };
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="space-y-3 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                    <p className="text-sm font-semibold text-slate-600">Analyzing your expenses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl border border-slate-200">
                    <h3 className="mb-2 text-xl font-bold text-slate-800">Something went wrong</h3>
                    <p className="mb-6 text-sm text-slate-600">{error}</p>
                    <button
                        onClick={getExpenses}
                        className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-700">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (expenses.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl border border-slate-200/80">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <PieChart className="h-8 w-8" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-900">No expenses to analyze</h3>
                    <p className="text-sm text-slate-500">
                        Add some expenses first to unlock powerful visual insights and spending trends.
                    </p>
                </div>
            </div>
        );
    }

    const categoryData = groupByCategory();
    const timeData = groupByTime();
    const totalExpenses = calculateTotalExpenses();
    const topCategory = getMostExpensiveCategory();

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    padding: 16,
                    usePointStyle: true,
                    font: {
                        size: 11,
                        family: "'Plus Jakarta Sans', sans-serif",
                        weight: '600'
                    }
                }
            },
            tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                titleColor: "#f8fafc",
                bodyColor: "#f8fafc",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                cornerRadius: 12,
                padding: 12,
                bodyFont: {
                    size: 13,
                    family: "'Plus Jakarta Sans', sans-serif"
                },
                titleFont: {
                    size: 13,
                    weight: "bold",
                    family: "'Plus Jakarta Sans', sans-serif"
                },
                callbacks: {
                    label: function (context) {
                        return ` ${context.label}: ₹${Number(context.parsed || context.raw).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
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
                    "#10B981",
                    "#06B6D4",
                    "#6366F1",
                    "#8B5CF6",
                    "#EC4899",
                    "#F59E0B",
                    "#EF4444",
                    "#84CC16",
                    "#F97316"
                ],
                borderWidth: 2,
                borderColor: "#ffffff",
                hoverOffset: 6
            }
        ]
    };

    const barChartData = {
        labels: Object.keys(timeData),
        datasets: [
            {
                label: `${viewMode === "daily" ? "Daily" : "Monthly"} Spend`,
                data: Object.values(timeData),
                backgroundColor: "rgba(16, 185, 129, 0.85)",
                borderColor: "#10B981",
                borderWidth: 1,
                borderRadius: 8,
                borderSkipped: false
            }
        ]
    };

    const lineChartData = {
        labels: Object.keys(timeData),
        datasets: [
            {
                label: "Spending Trend",
                data: Object.values(timeData),
                borderColor: "#059669",
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: "#059669",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2
            }
        ]
    };

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 pb-28 space-y-6">
            {/* Header & View Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Expense Analytics</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Visual breakdown of your category distribution and spending trajectory
                    </p>
                </div>

                <div className="inline-flex items-center rounded-xl bg-slate-200/80 p-1 border border-slate-300/50 self-start sm:self-auto">
                    <button
                        onClick={() => setViewMode("monthly")}
                        className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                            viewMode === "monthly"
                                ? "bg-white text-slate-900 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}>
                        Monthly View
                    </button>
                    <button
                        onClick={() => setViewMode("daily")}
                        className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                            viewMode === "daily"
                                ? "bg-white text-slate-900 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}>
                        Daily View
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-xs backdrop-blur-md">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="relative">
                        <select
                            value={monthFilter}
                            onChange={handleMonthFilterChange}
                            className="block w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-3.5 pr-10 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                            <option value="all">📅 All Months</option>
                            {expensesMonths.map((m) => (
                                <option key={m} value={m}>
                                    📅 {m}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>

                    <div className="relative">
                        <select
                            value={category}
                            onChange={handleCategoryChange}
                            className="block w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-3.5 pr-10 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                            <option value="all">🏷️ All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.label} value={cat.label}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>

                    <div className="relative">
                        <select
                            value={paymentType}
                            onChange={handlePaymentTypeChange}
                            className="block w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-3.5 pr-10 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                            <option value="all">💳 All Payment Methods</option>
                            {paymentModes.map((mode) => (
                                <option key={mode.value} value={mode.value}>
                                    {mode.value}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-500/10 to-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Total Analyzed</p>
                            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                                ₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
                            <Wallet className="h-5.5 w-5.5" />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-500/10 to-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Highest Category</p>
                            <h3 className="mt-1 text-xl font-extrabold text-slate-900 truncate max-w-[150px]">
                                {topCategory.category}
                            </h3>
                            <p className="text-xs font-bold text-purple-600 mt-0.5">
                                ₹{topCategory.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
                            <TrendingUp className="h-5.5 w-5.5" />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-500/10 to-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Active Categories</p>
                            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                                {Object.keys(categoryData).length}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">Out of {categories.length} total</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                            <Layers className="h-5.5 w-5.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-xs backdrop-blur-md">
                    <h2 className="mb-4 text-base font-bold text-slate-900 flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-emerald-600" />
                        <span>Category Breakdown</span>
                    </h2>
                    <div className="h-72">
                        <Pie data={pieChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-xs backdrop-blur-md">
                    <h2 className="mb-4 text-base font-bold text-slate-900 flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-emerald-600" />
                        <span>{viewMode === "daily" ? "Daily" : "Monthly"} Expenditure</span>
                    </h2>
                    <div className="h-72">
                        <Bar data={barChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Full Width Line Chart */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-xs backdrop-blur-md">
                <h2 className="mb-4 text-base font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span>Spending Trajectory</span>
                </h2>
                <div className="h-72">
                    <Line data={lineChartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
}