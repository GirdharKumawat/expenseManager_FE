import { useNavigate } from "react-router-dom";
import ExpenseCard from "../components/ExpenseCard";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import useExpense from "../features/expenses/useExpense";
import {
    CalendarIcon,
    FileText,
    ChevronDown,
    Plus,
    X,
    Wallet,
    TrendingUp,
    Layers,
    Search,
    Sparkles,
    Check,
    CreditCard,
    ArrowUpRight,
    SlidersHorizontal,
    RotateCcw,
    ArrowUpDown,
    Filter,
    Tag
} from "lucide-react";
import { paymentModes, categories } from "../components/categories";
import useGroup from "../features/group/useGroup";
import { useAuth } from "../features/auth/useAuth";

function Home() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const { groups } = useSelector((state) => state.group);
    const { expenses, loading } = useSelector((state) => state.expense);
    const { username, firstName, lastName } = useSelector((state) => state.auth);

    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [category, setCategory] = useState("all");
    const [paymentType, setPaymentType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [monthFilter, setMonthFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest", "amount-high", "amount-low"

    // Delete confirmation modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { fetchUser } = useAuth();
    const { fetchGroups } = useGroup();
    const { getExpenses, deleteExpense, postExpense } = useExpense();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Compute distinct months from expenses
    const expensesMonths = useMemo(() => {
        return Array.from(
            new Set(
                expenses.map((expense) => {
                    const date = new Date(expense.date);
                    return `${months[date.getMonth()]} ${date.getFullYear()}`;
                })
            )
        );
    }, [expenses]);

    const [newExpense, setNewExpense] = useState({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        paymentType: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExpense((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Fetch expenses and groups when component mounts
    useEffect(() => {
        if (firstName === "" || lastName === "") {
            fetchUser();
        }
        if (expenses.length <= 0) {
            getExpenses();
        }
        if (groups.length < 1) fetchGroups();
    }, []);

    // Listen for custom event from BottomNavBar
    useEffect(() => {
        const handleOpenAddExpense = () => {
            setIsDrawerOpen(true);
            document.body.style.overflow = "hidden";
            window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: true } }));
        };
        window.addEventListener("open-add-expense", handleOpenAddExpense);
        return () => {
            window.removeEventListener("open-add-expense", handleOpenAddExpense);
        };
    }, []);

    // Filter logic including category, paymentType, monthFilter and search query
    useEffect(() => {
        setFilteredExpenses(
            expenses.filter((expense) => {
                const matchesCategory = category === "all" || expense.category === category;
                const matchesPaymentType = paymentType === "all" || expense.paymentType === paymentType;
                const expenseDate = new Date(expense.date);
                const matchesMonth =
                    monthFilter === "all" ||
                    monthFilter === `${months[expenseDate.getMonth()]} ${expenseDate.getFullYear()}`;

                const matchesSearch =
                    !searchQuery.trim() ||
                    expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    expense.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    expense.paymentType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    String(expense.amount).includes(searchQuery);

                return matchesCategory && matchesPaymentType && matchesMonth && matchesSearch;
            })
        );
    }, [category, paymentType, expenses, monthFilter, searchQuery]);

    // Active filter counter & reset helper
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (category !== "all") count++;
        if (paymentType !== "all") count++;
        if (monthFilter !== "all") count++;
        if (searchQuery.trim() !== "") count++;
        return count;
    }, [category, paymentType, monthFilter, searchQuery]);

    const resetAllFilters = () => {
        setCategory("all");
        setPaymentType("all");
        setMonthFilter("all");
        setSearchQuery("");
    };

    // Sort expenses
    const sortedExpenses = useMemo(() => {
        let result = [...filteredExpenses];
        if (sortBy === "newest") {
            result.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === "oldest") {
            result.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortBy === "amount-high") {
            result.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        } else if (sortBy === "amount-low") {
            result.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
        }
        return result;
    }, [filteredExpenses, sortBy]);

    const handleCategoryChange = (val) => setCategory(val);
    const handlePaymentTypeChange = (e) => setPaymentType(e.target.value);
    const handleMonthFilterChange = (e) => setMonthFilter(e.target.value);

    const openDrawer = () => {
        setIsDrawerOpen(true);
        document.body.style.overflow = "hidden";
        window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: true } }));
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        document.body.style.overflow = "unset";
        resetForm();
        window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: false } }));
    };

    const resetForm = () => {
        setNewExpense({
            amount: "",
            category: "",
            description: "",
            date: new Date().toISOString().slice(0, 10),
            paymentType: ""
        });
        setFormErrors({});
    };

    const handleAddExpense = () => {
        if (validateForm()) {
            postExpense(newExpense);
            closeDrawer();
        }
    };

    const handleAddMoreExpense = () => {
        if (validateForm()) {
            postExpense(newExpense);
            resetForm();
        }
    };

    const handleDeleteClick = (expense) => {
        setExpenseToDelete(expense);
        setShowDeleteModal(true);
        window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: true } }));
    };

    const handleDeleteConfirm = async () => {
        if (!expenseToDelete) return;
        setIsDeleting(true);
        try {
            await deleteExpense(expenseToDelete.id);
            setShowDeleteModal(false);
            setExpenseToDelete(null);
            window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: false } }));
        } catch (error) {
            console.error("Failed to delete expense:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setExpenseToDelete(null);
        setIsDeleting(false);
        window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: false } }));
    };

    const validateForm = () => {
        const errors = {};
        if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
            errors.amount = "Please enter a valid amount";
        }
        if (!newExpense.category) {
            errors.category = "Please select a category";
        }
        if (!newExpense.description.trim()) {
            errors.description = "Please enter a description";
        }
        if (!newExpense.paymentType) {
            errors.paymentType = "Please select a payment method";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const groupByCategory = () => {
        const catMap = {};
        filteredExpenses.forEach(({ category, amount }) => {
            catMap[category] = (catMap[category] || 0) + parseFloat(amount);
        });
        return catMap;
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

    const topCategory = getMostExpensiveCategory();
    const totalExpenses = calculateTotalExpenses();

    // Percentage of total spent by top category
    const topCategoryPercentage = useMemo(() => {
        if (!totalExpenses || totalExpenses === 0 || !topCategory.amount) return 0;
        return Math.round((topCategory.amount / totalExpenses) * 100);
    }, [totalExpenses, topCategory]);

    // Time-based greeting helper
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    // Form Quick Amount Preset Handler
    const handleQuickAmount = (preset) => {
        setNewExpense((prev) => ({
            ...prev,
            amount: prev.amount ? String(Number(prev.amount) + preset) : String(preset)
        }));
    };

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 pb-28 space-y-6 animate-fadeIn">
            {/* Greeting Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
                {/* Decorative Background Glow Circles */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/10 text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "short"
                                })}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                            {getGreeting()},{" "}
                            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                                {firstName} {lastName || "User"}
                            </span>{" "}
                            👋
                        </h1>
                        <p className="text-xs sm:text-sm font-medium text-slate-300 max-w-lg">
                            Track, filter, and analyze your transactions effortlessly with real-time financial insights.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={openDrawer}
                            className="inline-flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:from-emerald-400 hover:to-teal-300 hover:shadow-emerald-500/50 hover:scale-102 active:scale-98">
                            <Plus className="h-4 w-4 stroke-[3]" />
                            <span>Add Expense</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Stat Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Card 1: Total Spent */}
                <div className="group relative overflow-hidden rounded-3xl border border-emerald-100/80 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-300/80 hover:-translate-y-0.5">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center space-x-1.5">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                                    Total Spent
                                </p>
                            </div>
                            <h3 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                ₹{totalExpenses.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                            <p className="text-[11px] font-bold text-slate-500 mt-2 flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                                <span>
                                    {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? "s" : ""} match
                                </span>
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-110">
                            <Wallet className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Card 2: Top Category */}
                <div className="group relative overflow-hidden rounded-3xl border border-purple-100/80 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-purple-300/80 hover:-translate-y-0.5">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center space-x-1.5">
                                <span className="h-2 w-2 rounded-full bg-purple-500" />
                                <p className="text-xs font-extrabold uppercase tracking-wider text-purple-800">
                                    Top Category
                                </p>
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate max-w-[170px]">
                                {topCategory.category}
                            </h3>
                            <p className="text-xs font-extrabold text-purple-600 mt-1">
                                ₹{topCategory.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                {topCategoryPercentage > 0 && (
                                    <span className="ml-1 text-[10px] font-bold text-purple-400">
                                        ({topCategoryPercentage}%)
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-500/25 transition-transform duration-300 group-hover:scale-110">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Card 3: Period / Active Filter */}
                <div className="group relative overflow-hidden rounded-3xl border border-blue-100/80 bg-gradient-to-br from-blue-500/10 via-sky-500/5 to-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-300/80 hover:-translate-y-0.5">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center space-x-1.5">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                <p className="text-xs font-extrabold uppercase tracking-wider text-blue-800">
                                    Active View
                                </p>
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                {monthFilter === "all" ? "All Time" : monthFilter}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 mt-1">
                                Category: <span className="font-bold text-slate-800">{category === "all" ? "All Categories" : category}</span>
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/25 transition-transform duration-300 group-hover:scale-110">
                            <Layers className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Prominent Elevated Filter & Search Control Panel Hub */}
            <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-5 sm:p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all hover:border-slate-300/90 space-y-5">
                {/* Panel Title Header with Filter Counter & Reset Button */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center space-x-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-xs">
                            <SlidersHorizontal className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                                    Filter & Search Center
                                </h2>
                                {activeFilterCount > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-black text-emerald-800 animate-fadeIn">
                                        <Sparkles className="h-3 w-3 text-emerald-600" />
                                        {activeFilterCount} Active Filter{activeFilterCount > 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs font-medium text-slate-400">
                                Narrow down your expenses by query, category, period, or payment mode
                            </p>
                        </div>
                    </div>

                    {activeFilterCount > 0 && (
                        <button
                            onClick={resetAllFilters}
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200/60 transition-all duration-200 active:scale-95">
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Reset All</span>
                        </button>
                    )}
                </div>

                {/* Instant Search Bar */}
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Search className="h-4.5 w-4.5 text-emerald-600" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search expenses by description, category name, amount..."
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-24 text-sm font-semibold text-slate-900 placeholder-slate-400 shadow-inner transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
                    />
                    {searchQuery ? (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-3 my-auto flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-rose-100 hover:text-rose-600 transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    ) : (
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                            <span className="hidden sm:inline-block rounded-lg bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                Quick Search
                            </span>
                        </div>
                    )}
                </div>

                {/* Category Card Selector Pills */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-600">
                        <div className="flex items-center space-x-1.5">
                            <Tag className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Categories</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 capitalize">
                            {category === "all" ? "Showing all categories" : `Selected: ${category}`}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
                        <button
                            onClick={() => handleCategoryChange("all")}
                            className={`inline-flex shrink-0 items-center space-x-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition-all duration-200 ${
                                category === "all"
                                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-102"
                                    : "bg-slate-100/90 text-slate-700 border border-slate-200/80 hover:bg-slate-200/80 hover:text-slate-900"
                            }`}>
                            <span className="text-sm">✨</span>
                            <span>All Categories</span>
                        </button>

                        {categories.map((cat) => {
                            const isSelected = category === cat.label;
                            return (
                                <button
                                    key={cat.label}
                                    onClick={() => handleCategoryChange(cat.label)}
                                    className={`inline-flex shrink-0 items-center space-x-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition-all duration-200 ${
                                        isSelected
                                            ? `bg-gradient-to-r ${cat.gradient} text-white shadow-md ${cat.glow} scale-102`
                                            : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300"
                                    }`}>
                                    <span className="text-sm">{cat.emoji}</span>
                                    <span>{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Dropdown Select Controls (Month & Payment Mode & Sorting) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* Filter by Month */}
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-600">
                            <CalendarIcon className="h-4 w-4" />
                        </div>
                        <select
                            value={monthFilter}
                            onChange={handleMonthFilterChange}
                            className="block w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-10 text-xs font-bold text-slate-800 transition-all hover:bg-white focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15">
                            <option value="all">📅 Filter Month: All Time</option>
                            {expensesMonths.map((m) => (
                                <option key={m} value={m}>
                                    📅 {m}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>

                    {/* Filter by Payment Method */}
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-purple-600">
                            <CreditCard className="h-4 w-4" />
                        </div>
                        <select
                            value={paymentType}
                            onChange={handlePaymentTypeChange}
                            className="block w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-10 text-xs font-bold text-slate-800 transition-all hover:bg-white focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15">
                            <option value="all">💳 Payment Mode: All Modes</option>
                            {paymentModes.map((mode) => (
                                <option key={mode.value} value={mode.value}>
                                    {mode.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>

                    {/* Sort Order */}
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-600">
                            <ArrowUpDown className="h-4 w-4" />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="block w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-10 text-xs font-bold text-slate-800 transition-all hover:bg-white focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15">
                            <option value="newest">⚡ Sort: Newest First</option>
                            <option value="oldest">⌛ Sort: Oldest First</option>
                            <option value="amount-high">💰 Sort: Amount (High to Low)</option>
                            <option value="amount-low">🏷️ Sort: Amount (Low to High)</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>

                {/* Active Filter Badges Bar (Dismissible Tags) */}
                {activeFilterCount > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 animate-fadeIn">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                            Active Tags:
                        </span>

                        {searchQuery && (
                            <span className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-xs font-bold text-emerald-800">
                                <span>🔍 &quot;{searchQuery}&quot;</span>
                                <button onClick={() => setSearchQuery("")} className="text-emerald-600 hover:text-emerald-900">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        )}

                        {category !== "all" && (
                            <span className="inline-flex items-center space-x-1.5 rounded-xl bg-purple-50 border border-purple-200/80 px-2.5 py-1 text-xs font-bold text-purple-800">
                                <span>🏷️ {category}</span>
                                <button onClick={() => setCategory("all")} className="text-purple-600 hover:text-purple-900">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        )}

                        {monthFilter !== "all" && (
                            <span className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-50 border border-blue-200/80 px-2.5 py-1 text-xs font-bold text-blue-800">
                                <span>📅 {monthFilter}</span>
                                <button onClick={() => setMonthFilter("all")} className="text-blue-600 hover:text-blue-900">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        )}

                        {paymentType !== "all" && (
                            <span className="inline-flex items-center space-x-1.5 rounded-xl bg-amber-50 border border-amber-200/80 px-2.5 py-1 text-xs font-bold text-amber-800">
                                <span>💳 {paymentType}</span>
                                <button onClick={() => setPaymentType("all")} className="text-amber-600 hover:text-amber-900">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Expenses List Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                            Transactions History
                        </h2>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 border border-slate-200/60">
                            {sortedExpenses.length} {sortedExpenses.length === 1 ? "record" : "records"}
                        </span>
                    </div>

                    {sortedExpenses.length > 0 && (
                        <span className="text-xs font-semibold text-slate-400 hidden sm:block">
                            Showing sorted results
                        </span>
                    )}
                </div>

                {loading === "get" ? (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex animate-pulse items-center justify-between rounded-2xl bg-white p-4 border border-slate-200/60 shadow-xs">
                                <div className="flex items-center space-x-3 w-1/2">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-200"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-1/2 rounded bg-slate-200"></div>
                                        <div className="h-3 w-3/4 rounded bg-slate-200"></div>
                                    </div>
                                </div>
                                <div className="h-6 w-20 rounded bg-slate-200"></div>
                            </div>
                        ))}
                    </div>
                ) : sortedExpenses.length > 0 ? (
                    <div className="space-y-3">
                        {sortedExpenses.map((expense, index) => (
                            <ExpenseCard
                                key={expense.id || index}
                                expense={expense}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-xs">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-3 border border-emerald-100">
                            <Wallet className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900">No matching expenses</h3>
                        <p className="mt-1 text-xs text-slate-500 max-w-sm font-medium">
                            {activeFilterCount > 0
                                ? "No transactions found matching your current filter criteria."
                                : "No transaction records available yet."}
                        </p>

                        {activeFilterCount > 0 ? (
                            <button
                                onClick={resetAllFilters}
                                className="mt-4 inline-flex items-center space-x-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all">
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span>Reset Active Filters</span>
                            </button>
                        ) : (
                            <button
                                onClick={openDrawer}
                                className="mt-4 flex items-center space-x-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all">
                                <Plus className="h-4 w-4" />
                                <span>Add New Expense</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Floating Action Button - Only rendered when drawer is closed to prevent overlap */}
            {!isDrawerOpen && (
                <button
                    onClick={openDrawer}
                    className="fixed right-6 bottom-24 sm:bottom-22 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/50 focus:outline-none active:scale-95"
                    aria-label="Add new expense">
                    <Plus className="h-7 w-7" />
                </button>
            )}

            {loading === "delete" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
                    <div className="rounded-2xl bg-white px-6 py-4 shadow-2xl flex items-center space-x-3 border border-slate-100">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                        <p className="text-sm font-bold text-slate-800">Deleting transaction...</p>
                    </div>
                </div>
            )}

            {/* Interactive Add Expense Sheet Modal */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={closeDrawer}
                    />

                    {/* Sheet Container */}
                    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-xl rounded-t-3xl bg-white p-6 pb-8 shadow-2xl transition-all duration-300 animate-slideUp">
                        {/* Drag handle */}
                        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />

                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900">Add New Transaction</h2>
                                <p className="text-xs font-medium text-slate-500">Record a new expense to track your budget</p>
                            </div>
                            <button
                                onClick={closeDrawer}
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
                            {/* Amount Input with Quick Presets */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Amount (₹) *
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <span className="text-xl font-black text-emerald-600">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={newExpense.amount}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        className={`block w-full rounded-2xl border py-3 pl-9 pr-4 text-xl font-extrabold transition-all ${
                                            formErrors.amount
                                                ? "border-rose-300 bg-rose-50/50 text-rose-900 focus:ring-rose-500"
                                                : "border-slate-200 bg-slate-50/50 text-slate-900 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                                        }`}
                                    />
                                </div>
                                {formErrors.amount && <p className="mt-1 text-xs font-semibold text-rose-600">{formErrors.amount}</p>}

                                {/* Quick Amount Add Pills */}
                                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Add:</span>
                                    {[100, 500, 1000, 2000].map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => handleQuickAmount(preset)}
                                            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors">
                                            +₹{preset}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Visual Grid Selector */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Category *
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.label}
                                            type="button"
                                            onClick={() => setNewExpense((prev) => ({ ...prev, category: cat.label }))}
                                            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                                                newExpense.category === cat.label
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-xs scale-102"
                                                    : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                                            }`}>
                                            <span className="text-lg">{cat.emoji}</span>
                                            <span className="text-[11px] font-semibold mt-1 truncate max-w-full">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                                {formErrors.category && <p className="mt-1 text-xs font-semibold text-rose-600">{formErrors.category}</p>}
                            </div>

                            {/* Description Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Description *
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <FileText className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="description"
                                        value={newExpense.description}
                                        onChange={handleInputChange}
                                        placeholder="What did you spend on?"
                                        className={`block w-full rounded-2xl border py-2.5 pl-10 pr-4 text-sm font-medium transition-all ${
                                            formErrors.description
                                                ? "border-rose-300 bg-rose-50/50 text-rose-900 focus:ring-rose-500"
                                                : "border-slate-200 bg-slate-50/50 text-slate-800 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                                        }`}
                                    />
                                </div>
                                {formErrors.description && <p className="mt-1 text-xs font-semibold text-rose-600">{formErrors.description}</p>}
                            </div>

                            {/* Date Selector */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Date
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <CalendarIcon className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="date"
                                        name="date"
                                        value={newExpense.date}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            {/* Payment Method Selector */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Payment Method *
                                </label>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {paymentModes.map(({ value, label, icon: Icon }) => (
                                        <label
                                            key={value}
                                            className={`flex cursor-pointer items-center justify-start rounded-2xl border-2 px-3.5 py-2.5 transition-all ${
                                                newExpense.paymentType === value
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-xs"
                                                    : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentType"
                                                value={value}
                                                checked={newExpense.paymentType === value}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <Icon className={`mr-2 h-4 w-4 ${newExpense.paymentType === value ? "text-emerald-600" : "text-slate-400"}`} />
                                            <span className="text-xs font-semibold">{label}</span>
                                        </label>
                                    ))}
                                </div>
                                {formErrors.paymentType && <p className="mt-1 text-xs font-semibold text-rose-600">{formErrors.paymentType}</p>}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 border-t border-slate-100 pt-4 flex gap-3">
                            <button
                                onClick={handleAddExpense}
                                disabled={loading === "post"}
                                className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-600 active:scale-98 transition-all disabled:opacity-50">
                                {loading === "post" ? "Adding..." : "Add Expense"}
                            </button>

                            <button
                                onClick={handleAddMoreExpense}
                                disabled={loading === "post"}
                                className="rounded-2xl border border-emerald-600 px-4 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-50">
                                Save & Add More
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                expenseData={expenseToDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}

export default Home;
