import { X, ArrowRight, TrendingUp, TrendingDown, Info } from "lucide-react";

const SettleUpModal = ({ group, onClose, calculateSettleUp, generateSettleUpTransactions }) => {
    // Get settlement data
    const settlementData = calculateSettleUp();
    const transactions = generateSettleUpTransactions();
    const totalExpenses = group.totalExpense || 0;
    const fairShare = settlementData.summary?.fairSharePerPerson || (totalExpenses / group.membersList.length);
    
    // Convert settlement data to member balances format
    const memberBalances = group.membersList.map(member => {
        const memberName = member.name;
        return {
            name: memberName,
            paid: settlementData.totalPaid?.[memberName] || 0,
            share: settlementData.totalShare?.[memberName] || 0,
            balance: settlementData.netBalances?.[memberName] || 0,
            fairShare: fairShare
        };
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] rounded-xl bg-white shadow-2xl">
                {/* Header - matching existing style */}
                <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Settle Up</h2>
                        <p className="text-sm text-slate-600">
                            {group.name} • Total: ₹{totalExpenses.toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content - matching existing cards style */}
                <div className="max-h-96 overflow-y-auto p-4 sm:p-6">
                    {/* Member Balances - using existing card style */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-lg font-semibold text-slate-800">Member Balances</h3>
                        <div className="space-y-2">
                            {group.membersList.map((member) => (
                                <div
                                    key={member.name}
                                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                                                <span className="font-medium text-emerald-600">
                                                    {member.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{member.name}</p>
                                                <div className="text-xs text-slate-600">
                                                    <div>Paid: ₹{member.balance.toFixed(0)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className={`flex items-center space-x-1 text-sm font-medium ${
                                                    member.balance > 0.01
                                                        ? "text-green-600"
                                                        : member.balance < -0.01
                                                        ? "text-red-600"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                {member.balance > 0.01 ? (
                                                    <TrendingUp className="h-4 w-4" />
                                                ) : member.balance < -0.01 ? (
                                                    <TrendingDown className="h-4 w-4" />
                                                ) : null}
                                                <span>
                                                    {member.balance > 0.01
                                                        ? `+₹${member.balance.toFixed(0)}`
                                                        : member.balance < -0.01
                                                        ? `₹${member.balance.toFixed(0)}`
                                                        : "Settled"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                {member.balance > 0.01
                                                    ? "Gets back"
                                                    : member.balance < -0.01
                                                    ? "Owes"
                                                    : "All good"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Settlement Transactions - using existing style */}
                    {transactions.length > 0 && (
                        <div>
                            <h3 className="mb-3 text-lg font-semibold text-slate-800">Settlement Plan</h3>
                            <div className="space-y-2">
                                {transactions.map((transaction, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                                                    <span className="text-sm font-medium text-emerald-600">
                                                        {transaction.from.charAt(0)}
                                                    </span>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-slate-400" />
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                                                    <span className="text-sm font-medium text-emerald-600">
                                                        {transaction.to.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900">
                                                    ₹{transaction.amount.toFixed(0)}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    {transaction.from} → {transaction.to}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
 
 
                </div>

                {/* Footer - matching existing button style */}
                <div className="border-t border-gray-200 p-4 sm:p-6">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="rounded-lg bg-emerald-600 px-6 py-2 text-white transition-colors hover:bg-emerald-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettleUpModal;
