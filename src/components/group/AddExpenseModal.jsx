import { useEffect, useState } from "react";
import { X } from "lucide-react";
const AddExpenseModal = ({ expenseData, setExpenseData, onClose, group, onSubmit }) => {
    const [splitMode, setSplitMode] = useState("equal");
    const [manualSplits, setManualSplits] = useState({});

    const validateForm = () => {
        if (!expenseData.title || !expenseData.amount || !expenseData.paidBy) {
            return false;  
        }
        
        // Additional validation for manual split
        if (splitMode === "manual") {
            const totalManualAmount = getTotalManualAmount();
            const expenseAmount = parseFloat(expenseData.amount);
            
            if (Math.abs(totalManualAmount - expenseAmount) > 0.01) {
                alert(`Manual split total (₹${totalManualAmount.toFixed(2)}) must equal the expense amount (₹${expenseAmount.toFixed(2)})`);
                return false;
            }
        }
        
        return true;
    }

    // Calculate total of manual splits
    const getTotalManualAmount = () => {
        return Object.values(manualSplits).reduce((total, amount) => {
            return total + (parseFloat(amount) || 0);
        }, 0);
    };

    // Handle manual split amount change
    const handleManualSplitChange = (memberId, amount) => {
        setManualSplits(prev => ({
            ...prev,
            [memberId]: amount
        }));
    };
    
    const handleSubmit = (e) => {
        e?.preventDefault(); // Prevent default form submission if called from form
        
        // Manual validation
        if (!validateForm()) {
            alert("Please fill in all required fields");
            return;
        }
      
        if (splitMode === "equal") {
            const totalMembers = group.membersList.length;
            const unitAmount = expenseData.amount / totalMembers;

            const shares = group.membersList.map((member) => ({
                participant_id: member.id,
                share_amount: unitAmount
            }));
            setExpenseData((prev) => ({
                ...prev,
                shares: shares
            }));
        } else if (splitMode === "manual") {
            // Create shares from manual splits
            const shares = Object.entries(manualSplits).map(([memberId, amount]) => ({
                participant_id: parseInt(memberId),
                share_amount: parseFloat(amount) || 0
            }));
            setExpenseData((prev) => ({
                ...prev,
                shares: shares
            }));
        }
    
    };
    useEffect(() => {
        if (expenseData.shares.length > 0) {
            onSubmit();
            setExpenseData((prev) => ({
                group: prev.group, // Preserve the group ID
                title: "",
                amount: "",
                paidBy:-1,
                note: "",
                shares: []
            }));
        }
    }, [expenseData]);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md max-h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col">
                <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-slate-800">Add Expense</h2>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <form id="expense-form" onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
                    <div>
                        
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Title *
                        </label>
                        <input
                            required
                            type="text"
                            value={expenseData.title}
                            onChange={(e) =>
                                setExpenseData({ ...expenseData, title: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                            placeholder="Enter expense title"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Note
                        </label>
                        <input
                            type="text"
                            value={expenseData.note}
                            onChange={(e) =>
                                setExpenseData({ ...expenseData, note: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                            placeholder="Enter expense Note"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Amount *
                        </label>
                        <input
                            required
                            type="number"
                            value={expenseData.amount}
                            onChange={(e) =>
                                setExpenseData({ ...expenseData, amount: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                            placeholder="Enter amount"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Paid By *
                        </label>
                        <select required
                            value={expenseData.paidBy}
                            onChange={(e) =>
                                setExpenseData({ ...expenseData, paidBy: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500">
                            
                            <option value="">Select a member</option>
                            
                            {group.membersList.map((member, index) => (
                                <option key={index} value={member.id}>
                                    {member.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Split Mode
                        </label>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => setSplitMode("equal")}
                                className={`rounded-lg px-4 py-2 font-medium ${splitMode === "equal" ? "bg-emerald-600 text-white" : "bg-gray-100 text-slate-700"}`}>
                                Equal Split
                            </button>
                            <button
                                type="button"
                                onClick={() => setSplitMode("manual")}
                                className={`rounded-lg px-4 py-2 font-medium ${splitMode === "manual" ? "bg-emerald-600 text-white" : "bg-gray-100 text-slate-700"}`}>
                                Manual
                            </button>
                        </div>
                    </div>

                    {/* Manual Split Section */}
                    {splitMode === "manual" && (
                        <div className="space-y-3">
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Manual Split Distribution
                            </label>
                            
                            <div className="rounded-lg border border-gray-200 p-3 space-y-3">
                                {group.membersList.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">
                                            {member.name}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-slate-500">₹</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={manualSplits[member.id] || ''}
                                                onChange={(e) => handleManualSplitChange(member.id, e.target.value)}
                                                className="w-20 rounded border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Total Display */}
                                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 mt-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-700">
                                            Total Split Amount:
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-semibold text-slate-700">
                                                ₹{getTotalManualAmount().toFixed(2)}
                                            </span>
                                            {expenseData.amount && (
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    Math.abs(getTotalManualAmount() - parseFloat(expenseData.amount)) <= 0.01
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}>
                                                    {Math.abs(getTotalManualAmount() - parseFloat(expenseData.amount)) <= 0.01
                                                        ? "✓ Balanced"
                                                        : `₹${Math.abs(getTotalManualAmount() - parseFloat(expenseData.amount)).toFixed(2)} ${getTotalManualAmount() > parseFloat(expenseData.amount) ? "over" : "under"}`
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {expenseData.amount && (
                                        <div className="text-xs text-slate-500 mt-1">
                                            Expense Amount: ₹{parseFloat(expenseData.amount).toFixed(2)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    </form>
                </div>

                {/* Fixed Footer with Buttons */}
                <div className="border-t border-gray-200 p-6 pt-4">
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-slate-700 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="expense-form"
                            className="flex-1 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 font-medium text-white hover:from-emerald-700 hover:to-emerald-600">
                            Add Expense
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddExpenseModal;
