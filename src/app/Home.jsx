import { useNavigate } from "react-router-dom";
import ExpenseCard from "../components/ExpenseCard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useExpense from "../features/expenses/useExpense";
import { CalendarIcon, FileText, ChevronDown, Plus, X, DollarSign } from "lucide-react";
import { paymentModes, categories } from "../components/categories";

function Home() {
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [category, setCategory] = useState("all");
    const [paymentType, setPaymentType] = useState("all");
    const navigate = useNavigate();
    const { getExpenses, deleteExpense, postExpense } = useExpense();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});

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

    const { expenses, loading } = useSelector((state) => state.expense);
    useEffect(() => {
        if (expenses.length <= 0) {
            getExpenses();
        }
    }, [ ]);

    // Update filtered expenses when both category and paymentType change
    useEffect(() => {
        setFilteredExpenses(
            expenses.filter((expense) => {
                const matchesCategory = category === "all" || expense.category === category;
                const matchesPaymentType =
                    paymentType === "all" || expense.paymentType === paymentType;
                return matchesCategory && matchesPaymentType;
            })
        );
    }, [category, paymentType, expenses]);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };
    const handlePaymentTypeChange = (e) => {
        setPaymentType(e.target.value);
    };

    const openDrawer = () => {
        setIsDrawerOpen(true);
        document.body.style.overflow = "hidden"; // Prevent background scroll
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        document.body.style.overflow = "unset"; // Restore scroll
        resetForm();
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
            setIsDrawerOpen(false);
            resetForm();
        }
    };

    const handleAddMoreExpense = () => {
        if (validateForm()) {
            postExpense(newExpense);
            resetForm();
        }
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
        const categories = {};
        filteredExpenses.forEach(({ category, amount }) => {
            categories[category] = (categories[category] || 0) + parseFloat(amount);
        });
        return categories;
    };

    const calculateTotalExpenses = () => {
        return filteredExpenses.reduce(
            (total, expense) => total + parseFloat(expense.amount || 0),
            0
        );
    };
    const getMostExpensiveCategory = () => {
        const categoryData = groupByCategory();
        const maxCategory = Object.keys(categoryData).reduce(
            (a, b) => (categoryData[a] > categoryData[b] ? a : b),
            ""
        );
        return { category: maxCategory, amount: categoryData[maxCategory] };
    };

    const topCategory = getMostExpensiveCategory();
    const totalExpenses = calculateTotalExpenses();

    return (
        <div className="mb-16 space-y-4 bg-white p-5">
            <h1 className="text-2xl font-bold text-green-600">Your Expenses</h1>
            <div className="flex items-start space-x-4">
                <select
                    className="block rounded-lg border border-gray-300 bg-white p-2 text-gray-700 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                    value={paymentType}
                    onChange={handlePaymentTypeChange}>
                    <option value="all">All Payment Methods</option>
                    {paymentModes.map((mode) => (
                        <option key={mode.value} value={mode.value}>
                            {mode.value}
                        </option>
                    ))}
                </select>

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

                {/* <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
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
                    </div> */}
            </div>

            {/* Floating Action Button */}
            <button
                onClick={openDrawer}
                className="my-add fixed right-10 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Add new expense">
                <Plus className="h-7 w-7" />
            </button>

            {loading === "delete" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="rounded-xl bg-white px-6 py-4 shadow-xl">
                        <p className="text-lg font-semibold text-black">Deleting expense...</p>
                    </div>
                </div>
            )}
            {/* -------------------------------------------------------------------------- */}
            {/* Drawer container - fixed to be a proper container */}

            <div className="relative mt-14">
                {/* Drawer Implementation */}
                {isDrawerOpen && (
                    <>
                        {/* Backdrop - should be outside the container for full screen coverage */}
                        <div
                            className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                            onClick={closeDrawer}
                        />

                        {/* Drawer - positioned fixed relative to viewport */}
                        <div className="fixed inset-x-0 bottom-6 z-50 mx-4 overflow-hidden rounded-3xl bg-white shadow-2xl transition-transform duration-300 ease-out sm:mx-auto sm:max-w-lg">
                            {/* Drag Handle */}
                            <div className="flex justify-center py-2">
                                <div className="h-1.5 w-12 rounded-full bg-gray-300"></div>
                            </div>

                            {/* Header */}
                            <div className="mt-1 flex items-center justify-between border-b border-gray-100 px-6 pb-2">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Add Expense
                                    </h2>
                                    <p className="text-sm text-gray-500">Track your new spending</p>
                                </div>
                                <button
                                    onClick={closeDrawer}
                                    className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                    aria-label="Close drawer">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Form Content */}
                            <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
                                <div className="space-y-6">
                                    {/* Amount Field */}
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                                            Amount *
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <span className="text-lg font-medium text-gray-500">
                                                    ₹
                                                </span>
                                            </div>
                                            <input
                                                type="number"
                                                name="amount"
                                                value={newExpense.amount}
                                                onChange={handleInputChange}
                                                placeholder="0.00"
                                                className={`block w-full rounded-xl border-0 py-2 pl-8 pr-4 text-lg ring-1 ring-inset transition-all ${
                                                    formErrors.amount
                                                        ? "ring-red-300 focus:ring-red-500"
                                                        : "ring-gray-300 focus:ring-green-600"
                                                } focus:ring-2`}
                                            />
                                        </div>
                                        {formErrors.amount && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {formErrors.amount}
                                            </p>
                                        )}
                                    </div>

                                    {/* Category Field */}
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                                            Category *
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="category"
                                                value={newExpense.category}
                                                onChange={handleInputChange}
                                                className={`block w-full appearance-none rounded-xl border-0 py-2 pl-4 pr-12 ring-1 ring-inset transition-all ${
                                                    formErrors.category
                                                        ? "ring-red-300 focus:ring-red-500"
                                                        : "ring-gray-300 focus:ring-green-600"
                                                } focus:ring-2`}>
                                                <option value="">Select a category</option>
                                                {categories.map((category) => (
                                                    <option
                                                        key={category.label}
                                                        value={category.label}>
                                                        {category.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                                <ChevronDown className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                        {formErrors.category && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {formErrors.category}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description Field */}
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                                            Description *
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <FileText className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="description"
                                                value={newExpense.description}
                                                onChange={handleInputChange}
                                                placeholder="What did you spend on?"
                                                className={`block w-full rounded-xl border-0 py-2 pl-12 pr-4 ring-1 ring-inset transition-all ${
                                                    formErrors.description
                                                        ? "ring-red-300 focus:ring-red-500"
                                                        : "ring-gray-300 focus:ring-green-600"
                                                } focus:ring-2`}
                                            />
                                        </div>
                                        {formErrors.description && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {formErrors.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Date Field */}
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                                            Date
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <CalendarIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                name="date"
                                                value={newExpense.date}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-xl border-0 py-2 pl-12 pr-4 ring-1 ring-inset ring-gray-300 transition-all focus:ring-2 focus:ring-green-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                            Payment Method *
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {paymentModes.map(({ value, label, icon: Icon }) => (
                                                <label
                                                    key={value}
                                                    className={`flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-2 transition-all ${
                                                        newExpense.paymentType === value
                                                            ? "border-green-500 bg-green-50 text-green-700"
                                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name="paymentType"
                                                        value={value}
                                                        checked={newExpense.paymentType === value}
                                                        onChange={handleInputChange}
                                                        className="sr-only"
                                                    />
                                                    <Icon className="mr-2 h-5 w-5" />
                                                    <span className="text-sm font-medium">
                                                        {label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        {formErrors.paymentType && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {formErrors.paymentType}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="border-t border-gray-100 px-6 py-3">
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleAddExpense}
                                        disabled={loading === "post"}
                                        className="w-full rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-2 text-lg font-semibold text-white shadow-lg transition-all hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50">
                                        {loading === "post" ? "Adding..." : "Add Expense"}
                                    </button>
                                    <button
                                        onClick={handleAddMoreExpense}
                                        disabled={loading === "post"}
                                        className="w-full rounded-xl border-2 border-green-600 px-6 py-1.5 font-semibold text-green-600 transition-all hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50">
                                        Add & Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* -------------------------------------------------------------------------- */}

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
