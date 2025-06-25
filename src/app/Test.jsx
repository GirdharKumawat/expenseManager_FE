import { useNavigate } from "react-router-dom";
import ExpenseCard from "../components/ExpenseCard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useExpense from "../features/expenses/useExpense";
import { CalendarIcon, FileText, ChevronDown, Plus, X, DollarSign } from "lucide-react";
import { paymentModes, categories } from "../components/categories";

function Test() {
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [category, setCategory] = useState("all");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const { getExpenses, deleteExpense, postExpense } = useExpense();

    const { isAuthenticated } = useSelector((state) => state.auth);
    const { expenses, loading } = useSelector((state) => state.expense);

    const [newExpense, setNewExpense] = useState({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        paymentType: ""
    });

    // Check if the user is authenticated and has expenses
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else if (expenses.length <= 0) {
            getExpenses();
        }
    }, [isAuthenticated, navigate, getExpenses, expenses.length]);

    // Update filtered expenses when category or expenses change
    useEffect(() => {
        setFilteredExpenses(
            category === "all"
                ? expenses
                : expenses.filter((expense) => expense.category === category)
        );
    }, [category, expenses]);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExpense(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ""
            }));
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

    const openDrawer = () => {
        setIsDrawerOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        document.body.style.overflow = 'unset'; // Restore scroll
        resetForm();
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Your Expenses</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Track and manage your daily expenses
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <select
                                    className="rounded-xl border-0 bg-white px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-600 sm:text-sm"
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
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading === "get" ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="animate-pulse rounded-xl bg-white p-6 shadow-sm">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                                            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredExpenses.length > 0 ? (
                        <div className="space-y-4">
                            {filteredExpenses.map((expense, index) => (
                                <ExpenseCard
                                    key={expense.id || index}
                                    expense={expense}
                                    onDelete={() => deleteExpense(expense.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">No expenses found</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Start tracking your spending by adding your first expense.
                            </p>
                        </div>
                    )}
                </div>

                {/* Floating Action Button */}
                <button
                    onClick={openDrawer}
                    className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2"
                    aria-label="Add new expense">
                    <Plus className="h-7 w-7" />
                </button>
            </div>

            {/* Delete Loading Overlay */}
            {loading === "delete" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="rounded-xl bg-white px-8 py-6 shadow-2xl">
                        <div className="flex items-center space-x-3">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                            <p className="text-lg font-medium text-gray-900">Deleting expense...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Drawer Implementation */}
            {isDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={closeDrawer}
                    />
                    
                    {/* Drawer - Added space above with bottom-8 instead of bottom-0 */}
                    <div className="fixed inset-x-0 bottom-8 z-50 mx-4 overflow-hidden rounded-3xl mt-9 bg-white shadow-2xl transition-transform duration-300 ease-out sm:mx-auto sm:max-w-lg">
                        {/* Drag Handle */}
                        <div className="flex justify-center py-3">
                            <div className="h-1.5 w-12 rounded-full bg-gray-300"></div>
                        </div>

                        {/* Header */}
                        <div className="flex items-center mt-4 justify-between border-b border-gray-100 px-6 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Add Expense</h2>
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Amount *
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <span className="text-lg font-medium text-gray-500">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={newExpense.amount}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            className={`block w-full rounded-xl border-0 py-4 pl-12 pr-4 text-lg ring-1 ring-inset transition-all ${
                                                formErrors.amount 
                                                    ? 'ring-red-300 focus:ring-red-500' 
                                                    : 'ring-gray-300 focus:ring-green-600'
                                            } focus:ring-2`}
                                        />
                                    </div>
                                    {formErrors.amount && (
                                        <p className="mt-2 text-sm text-red-600">{formErrors.amount}</p>
                                    )}
                                </div>

                                {/* Category Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={newExpense.category}
                                            onChange={handleInputChange}
                                            className={`block w-full appearance-none rounded-xl border-0 py-4 pl-4 pr-12 ring-1 ring-inset transition-all ${
                                                formErrors.category 
                                                    ? 'ring-red-300 focus:ring-red-500' 
                                                    : 'ring-gray-300 focus:ring-green-600'
                                            } focus:ring-2`}>
                                            <option value="">Select a category</option>
                                            {categories.map((category) => (
                                                <option key={category.label} value={category.label}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                    {formErrors.category && (
                                        <p className="mt-2 text-sm text-red-600">{formErrors.category}</p>
                                    )}
                                </div>

                                {/* Description Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                                            className={`block w-full rounded-xl border-0 py-4 pl-12 pr-4 ring-1 ring-inset transition-all ${
                                                formErrors.description 
                                                    ? 'ring-red-300 focus:ring-red-500' 
                                                    : 'ring-gray-300 focus:ring-green-600'
                                            } focus:ring-2`}
                                        />
                                    </div>
                                    {formErrors.description && (
                                        <p className="mt-2 text-sm text-red-600">{formErrors.description}</p>
                                    )}
                                </div>

                                {/* Date Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                                            className="block w-full rounded-xl border-0 py-4 pl-12 pr-4 ring-1 ring-inset ring-gray-300 transition-all focus:ring-2 focus:ring-green-600"
                                        />
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Payment Method *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {paymentModes.map(({ value, label, icon: Icon }) => (
                                            <label
                                                key={value}
                                                className={`flex cursor-pointer items-center justify-center rounded-xl border-2 p-4 transition-all ${
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
                                                <span className="text-sm font-medium">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {formErrors.paymentType && (
                                        <p className="mt-2 text-sm text-red-600">{formErrors.paymentType}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-gray-100 px-6 py-6">
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleAddExpense}
                                    disabled={loading === "post"}
                                    className="w-full rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50">
                                    {loading === "post" ? "Adding..." : "Add Expense"}
                                </button>
                                <button
                                    onClick={handleAddMoreExpense}
                                    disabled={loading === "post"}
                                    className="w-full rounded-xl border-2 border-green-600 px-6 py-3 font-semibold text-green-600 transition-all hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50">
                                    Add & Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Test;