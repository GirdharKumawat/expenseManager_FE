import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    expenseData,
    isLoading = false 
}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn"
            onClick={handleOverlayClick}
        >
            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900">Delete Expense</h2>
                            <p className="text-xs text-slate-500">Confirm transaction removal</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        disabled={isLoading}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-xs font-semibold text-slate-600">
                        Are you sure you want to permanently delete this expense? This action cannot be undone.
                    </p>
                    
                    {/* Expense Details Preview Card */}
                    {expenseData && (
                        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-slate-500">Amount:</span>
                                <span className="text-base font-extrabold text-slate-900">
                                    ₹{Number(expenseData.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-slate-500">Description:</span>
                                <span className="font-bold text-slate-800">{expenseData.description}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-slate-500">Category:</span>
                                <span className="font-bold text-slate-800">{expenseData.category}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-slate-500">Payment:</span>
                                <span className="font-bold text-slate-800">{expenseData.paymentType}</span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-98"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 rounded-2xl bg-rose-600 py-3 text-xs font-bold text-white shadow-lg shadow-rose-500/25 hover:bg-rose-700 transition-all active:scale-98 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    <span>Deleting...</span>
                                </div>
                            ) : (
                                'Delete Expense'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
