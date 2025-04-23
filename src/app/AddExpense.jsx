import { ArrowLeft, CalendarIcon, FileText, CreditCard, Banknote, ChevronDown } from "lucide-react";
import { useState } from "react";

import { paymentModes, categories } from "../components/categories";
import { useNavigate } from "react-router";
import API_ENDPOINT from "../key";

const API = `${API_ENDPOINT}/api/add/expense/`;

const AddExpense = () => {
    const [newExpense, setNewExpense] = useState({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        paymentType: ""
    });
    const nevigate = useNavigate();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExpense({
            ...newExpense,
            [name]: value
        });
    };
    const accessToken = localStorage.getItem("accessToken");

    const AddExpense = (addMore) => {
        console.log(newExpense);
        fetch(API, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newExpense)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            });

        if (addMore) {
            setNewExpense({
                amount: "",
                category: "",
                description: "",
                date: new Date().toISOString().slice(0, 10),
                paymentType: ""
            });
        } else {
            nevigate("/");
        }
    };
    const handleAddExpense = () => {
        AddExpense(false);
    }
    const handleAddMoreExpense = () => {
        AddExpense(true);
    };
    return (
        <div className="space-y-6">
            <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        className="mr-3 rounded-full p-2 text-slate-700 hover:bg-slate-100"
                        onClick={() => {
                            nevigate("/");
                        }}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800">Add Expense</h2>
                </div>
            </div>

            <div className="m-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
                <div className="space-y-5">
                    <div>
                        <label
                            htmlFor="amount"
                            className="mb-1 block text-sm font-medium text-slate-700">
                            Amount
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="font-medium text-slate-500">₹</span>
                            </div>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={newExpense.amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="block w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="mb-1 block text-sm font-medium text-slate-700">
                            Category
                        </label>
                        <div className="relative">
                            <select
                                id="category"
                                name="category"
                                value={newExpense.category}
                                onChange={handleInputChange}
                                className="block w-full appearance-none rounded-xl border border-slate-300 py-3 pl-3 pr-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500">
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.label} value={category.label}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-1 block text-sm font-medium text-slate-700">
                            Description
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FileText className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={newExpense.description}
                                onChange={handleInputChange}
                                placeholder="What did you spend on?"
                                className="block w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="date"
                            className="mb-1 block text-sm font-medium text-slate-700">
                            Date
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <CalendarIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={newExpense.date}
                                onChange={handleInputChange}
                                className="block w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-3 block text-sm font-medium text-slate-700">
                            Payment Method
                        </label>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {paymentModes.map(({ value, label, icon: Icon }) => (
                                <label
                                    key={value}
                                    className={`flex cursor-pointer items-center justify-center rounded-xl border-2 p-3 transition-all duration-150 ${
                                        newExpense.paymentType === value
                                            ? "border-green-500 bg-green-50"
                                            : "border-slate-200 hover:border-slate-300"
                                    }`}>
                                    <input
                                        type="radio"
                                        name="paymentType"
                                        value={value}
                                        checked={newExpense.paymentType === value}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <Icon
                                        className={`mr-2 h-5 w-5 ${
                                            newExpense.paymentType === value
                                                ? "text-green-600"
                                                : "text-slate-500"
                                        }`}
                                    />
                                    <span
                                        className={`${
                                            newExpense.paymentType === value
                                                ? "font-medium text-green-600"
                                                : "text-slate-700"
                                        }`}>
                                        {label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        <button
                            onClick={handleAddExpense}
                            className="w-full rounded-xl bg-gradient-to-r from-green-600 to-green-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-green-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto">
                            Add Expense
                        </button>
                        <button
                            onClick={handleAddMoreExpense}
                            className="w-full rounded-xl bg-gradient-to-r from-green-600 to-green-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-green-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto">
                            Add & Add More Expense
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddExpense;
