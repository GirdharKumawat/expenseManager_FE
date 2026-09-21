import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
    Upload,
    FileSpreadsheet,
    FileText,
    X,
    Check,
    AlertCircle,
    ArrowDownRight,
    ArrowUpRight,
    Trash2,
    Edit3,
    Sparkles,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    HelpCircle
} from "lucide-react";
import { categories, paymentModes } from "./categories";
import useExpense from "../features/expenses/useExpense";

const StatementVerificationModal = ({ isOpen, onClose }) => {
    const { parseStatement, postBulkExpenses } = useExpense();

    const [file, setFile] = useState(null);
    const [isParsing, setIsParsing] = useState(false);
    const [extractedData, setExtractedData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState("queue"); // "upload", "queue", "list"
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleUploadAndParse = async () => {
        if (!file) return;
        setIsParsing(true);
        const res = await parseStatement(file);
        setIsParsing(false);

        if (res && res.data && res.data.length > 0) {
            setExtractedData(res.data);
            setCurrentIndex(0);
            setViewMode("queue");
        }
    };

    const handleItemChange = (index, field, value) => {
        setExtractedData((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleRemoveItem = (index) => {
        setExtractedData((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            if (currentIndex >= updated.length && updated.length > 0) {
                setCurrentIndex(updated.length - 1);
            }
            return updated;
        });
    };

    const handleSaveAll = async () => {
        if (extractedData.length === 0) return;
        setIsSubmitting(true);
        const success = await postBulkExpenses(extractedData);
        setIsSubmitting(false);
        if (success) {
            onClose();
        }
    };

    const currentItem = extractedData[currentIndex];

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-md animate-backdropFade">
            <div
                className="relative z-[10000] flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-modalPop"
                onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                AI Statement Parser & Verification
                            </h2>
                            <p className="text-xs font-medium text-slate-400">
                                Upload bank/UPI statements to extract & verify transactions
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
                    {extractedData.length === 0 ? (
                        /* Upload Screen */
                        <div className="space-y-5 text-center">
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className="border-2 border-dashed border-emerald-300/80 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-3xl p-8 transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer">
                                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                                    <Upload className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">
                                        Drop your Bank / UPI Statement file here
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Supports CSV, Excel (.xlsx, .xls), or PDF statements
                                    </p>
                                </div>
                                <label className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-md cursor-pointer">
                                    <FileSpreadsheet className="h-4 w-4" />
                                    <span>Browse File</span>
                                    <input
                                        type="file"
                                        accept=".csv,.xlsx,.xls,.pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {file && (
                                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                                    <div className="flex items-center space-x-3 text-left">
                                        <FileText className="h-6 w-6 text-emerald-600" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 truncate max-w-xs">{file.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleUploadAndParse}
                                        disabled={isParsing}
                                        className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white px-5 py-2 text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer">
                                        {isParsing ? (
                                            <>
                                                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                <span>Parsing AI...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-4 w-4" />
                                                <span>Extract Transactions</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-left space-y-2">
                                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                                    <HelpCircle className="h-4 w-4 text-emerald-600" />
                                    <span>Smart Parsing Features:</span>
                                </div>
                                <ul className="text-[11px] font-medium text-slate-500 space-y-1 pl-6 list-disc">
                                    <li>Automated detection of **Debit** (expenses) vs **Credit** (income) transactions</li>
                                    <li>Pre-populates Date, Amount, Merchant, Payment Mode, and AI category suggestions</li>
                                    <li>Interactive verification prompt to add/select missing reasons or categories</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        /* Verification Queue View */
                        <div className="space-y-5">
                            {/* Summary bar */}
                            <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs font-extrabold text-slate-700">
                                        Review Queue ({extractedData.length} Extracted)
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setViewMode("queue")}
                                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                                            viewMode === "queue"
                                                ? "bg-emerald-600 text-white shadow-xs"
                                                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                        }`}>
                                        1-by-1 Queue
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                                            viewMode === "list"
                                                ? "bg-emerald-600 text-white shadow-xs"
                                                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                        }`}>
                                        Batch List
                                    </button>
                                </div>
                            </div>

                            {viewMode === "queue" && currentItem ? (
                                <div className="space-y-4 rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/30 to-white p-5 shadow-sm">
                                    {/* Queue Header Navigation */}
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                        <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                                            Transaction {currentIndex + 1} of {extractedData.length}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                                                disabled={currentIndex === 0}
                                                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-30 cursor-pointer">
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setCurrentIndex((prev) => Math.min(extractedData.length - 1, prev + 1))}
                                                disabled={currentIndex === extractedData.length - 1}
                                                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-30 cursor-pointer">
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Verification Form */}
                                    <div className="space-y-4">
                                        {/* Transaction Type Toggle (Debit vs Credit) */}
                                        <div>
                                            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                                                Transaction Type *
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleItemChange(currentIndex, "transaction_type", "DEBIT")}
                                                    className={`flex items-center justify-center space-x-2 rounded-2xl py-2.5 px-4 text-xs font-extrabold transition-all cursor-pointer ${
                                                        currentItem.transaction_type === "DEBIT"
                                                            ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                    }`}>
                                                    <ArrowDownRight className="h-4 w-4" />
                                                    <span>Debit (Expense)</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleItemChange(currentIndex, "transaction_type", "CREDIT")}
                                                    className={`flex items-center justify-center space-x-2 rounded-2xl py-2.5 px-4 text-xs font-extrabold transition-all cursor-pointer ${
                                                        currentItem.transaction_type === "CREDIT"
                                                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                    }`}>
                                                    <ArrowUpRight className="h-4 w-4" />
                                                    <span>Credit (Income)</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Amount & Date */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                                                    Amount (₹)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={currentItem.amount}
                                                    onChange={(e) => handleItemChange(currentIndex, "amount", e.target.value)}
                                                    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3.5 text-lg font-black text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                                                    Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={currentItem.date}
                                                    onChange={(e) => handleItemChange(currentIndex, "date", e.target.value)}
                                                    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                                                />
                                            </div>
                                        </div>

                                        {/* Description / Merchant Prompt */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                                    Reason / Description *
                                                </label>
                                                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                                    Prompt: Verify merchant or add note
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                value={currentItem.description}
                                                onChange={(e) => handleItemChange(currentIndex, "description", e.target.value)}
                                                placeholder="Enter reason or payee details"
                                                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                                            />
                                        </div>

                                        {/* Category Visual Picker */}
                                        <div>
                                            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                                                Category *
                                            </label>
                                            <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto custom-scrollbar p-1">
                                                {categories.map((cat) => (
                                                    <button
                                                        key={cat.label}
                                                        type="button"
                                                        onClick={() => handleItemChange(currentIndex, "category", cat.label)}
                                                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                                                            currentItem.category === cat.label
                                                                ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-xs"
                                                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                        }`}>
                                                        <span className="text-base">{cat.emoji}</span>
                                                        <span className="text-[10px] font-semibold truncate max-w-full">{cat.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions for current item */}
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(currentIndex)}
                                                className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 cursor-pointer">
                                                <Trash2 className="h-3.5 w-3.5" />
                                                <span>Discard Item</span>
                                            </button>

                                            {currentIndex < extractedData.length - 1 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                                                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-xl cursor-pointer">
                                                    <span>Verified & Next</span>
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            ) : (
                                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                                    <CheckCircle2 className="h-4 w-4" /> All items reviewed!
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Batch List View */
                                <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
                                    {extractedData.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-2xs">
                                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                                                <span
                                                    className={`inline-flex items-center justify-center h-9 w-9 rounded-xl font-bold text-xs shrink-0 ${
                                                        item.transaction_type === "CREDIT"
                                                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                            : "bg-rose-100 text-rose-700 border border-rose-200"
                                                    }`}>
                                                    {item.transaction_type === "CREDIT" ? "+" : "-"}
                                                </span>
                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                                                        className="w-full text-xs font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none"
                                                    />
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                                                        <span>{item.date}</span>
                                                        <span>•</span>
                                                        <select
                                                            value={item.category}
                                                            onChange={(e) => handleItemChange(idx, "category", e.target.value)}
                                                            className="bg-slate-100 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                                                            {categories.map((c) => (
                                                                <option key={c.label} value={c.label}>
                                                                    {c.emoji} {c.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                                <input
                                                    type="number"
                                                    value={item.amount}
                                                    onChange={(e) => handleItemChange(idx, "amount", e.target.value)}
                                                    className="w-24 text-right text-xs font-black text-slate-900 border border-slate-200 rounded-xl px-2 py-1"
                                                />
                                                <button
                                                    onClick={() => handleRemoveItem(idx)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {extractedData.length > 0 && (
                    <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                        <button
                            type="button"
                            onClick={() => setExtractedData([])}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">
                            Re-upload File
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveAll}
                            disabled={isSubmitting || extractedData.length === 0}
                            className="inline-flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 py-2.5 px-6 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-600 active:scale-98 transition-all disabled:opacity-50 cursor-pointer">
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    <span>Saving Transactions...</span>
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4 stroke-[3]" />
                                    <span>Confirm & Save {extractedData.length} Verified Transactions</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default StatementVerificationModal;
