import { useEffect, useState } from "react";
import { ArrowRight, Plus, TrendingDown, TrendingUp, Calculator, X, Trash2 } from "lucide-react";
import AddExpenseModal from "./AddExpenseModal";
import AddMember from "./AddMemberModal";
import SettleUpModal from "./SettleUpModal";
import DeleteGroupModal from "./DeleteGroupModal";
import { useSelector } from "react-redux";
import useGroup from "../../features/group/useGroup";
import Loader from "../ui/Loader";
const GroupDetailPage = ({ currGroup, onBack }) => {
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showSettleUpModal, setShowSettleUpModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeTab, setActiveTab] = useState("payments"); // New state for tabs

    const { loading, groups } = useSelector((state) => state.group);

    // Get the updated group from Redux store instead of local state
    const group = groups.find((g) => g.id === currGroup.id) || currGroup;

    const [expenseData, setExpenseData] = useState({
        group: group.id,
        title: "",
        amount: "",
        paidBy: "",
        note: "",
        shares: []
    });

    useEffect(() => {}, [group]);

    const { postGroupExpense, deleteGroup } = useGroup();



    // Settlement calculation functions (integrated from template)
    const calculateGroupSettlements = (group) => {
        const totalPaid = {};
        const totalShare = {};
        const netBalance = {};

        // Initialize maps for all members
        group.membersList.forEach(member => {
            const memberName = member.name || member;
            totalPaid[memberName] = 0;
            totalShare[memberName] = 0;
        });

        // Calculate total paid by each member
        const expenses = group.expenses || group.expensesList || [];
        expenses.forEach(expense => {
            const paidBy = expense.paidBy;
            const amount = parseFloat(expense.amount) || 0;
            
            // Add to total paid
            if (totalPaid[paidBy] !== undefined) {
                totalPaid[paidBy] += amount;
            }

            // Calculate per person share for this expense
            const splitMembers = expense.splitBetween || group.membersList.map(m => m.name || m);
            const perPersonShare = amount / splitMembers.length;
            
            // Add share to each member
            splitMembers.forEach(member => {
                if (totalShare[member] !== undefined) {
                    totalShare[member] += perPersonShare;
                }
            });
        });

        // Calculate net balances (positive = gets money, negative = owes money)
        group.membersList.forEach(member => {
            const memberName = member.name || member;
            netBalance[memberName] = (totalPaid[memberName] || 0) - (totalShare[memberName] || 0);
        });

        // Split into creditors (positive balance) and debtors (negative balance)
        const creditors = [];
        const debtors = [];

        Object.entries(netBalance).forEach(([name, balance]) => {
            if (balance > 0.01) { // Avoid tiny amounts
                creditors.push({ name, amount: balance });
            } else if (balance < -0.01) {
                debtors.push({ name, amount: -balance });
            }
        });

        // Sort for optimal matching (largest amounts first)
        creditors.sort((a, b) => b.amount - a.amount);
        debtors.sort((a, b) => b.amount - a.amount);

        // Generate minimal settlements using greedy algorithm
        const settlements = [];
        
        for (let i = 0; i < debtors.length; i++) {
            let debtor = debtors[i];
            for (let j = 0; j < creditors.length && debtor.amount > 0.01; j++) {
                let creditor = creditors[j];
                if (creditor.amount < 0.01) continue;

                const settleAmount = Math.min(debtor.amount, creditor.amount);
                
                if (settleAmount > 0.01) { // Only add meaningful transactions
                    settlements.push({
                        from: debtor.name,
                        to: creditor.name,
                        amount: settleAmount
                    });

                    debtor.amount -= settleAmount;
                    creditor.amount -= settleAmount;
                }
            }
        }

        return {
            totalPaid,
            totalShare,
            netBalances: netBalance,
            settlements,
            summary: {
                totalGroupExpense: group.totalExpense || 0,
                totalMembers: group.membersList.length,
                fairSharePerPerson: (group.totalExpense || 0) / group.membersList.length,
                transactionsNeeded: settlements.length
            }
        };
    };

    // Calculate member payments for display
    const calculateMemberPayments = () => {
        const settlements = calculateGroupSettlements(group);
        
        return group.membersList.map(member => {
            const memberName = member.name || member;
            return {
                id: member.id || memberName,
                name: memberName,
                paid: settlements.totalPaid[memberName] || 0,
                share: settlements.totalShare[memberName] || 0,
                balance: settlements.netBalances[memberName] || 0,
                fairShare: settlements.summary.fairSharePerPerson
            };
        });
    };

    // Calculate settle up data
    const calculateSettleUp = () => {
        return calculateGroupSettlements(group);
    };

    // Generate settlement transactions
    const generateSettleUpTransactions = () => {
        const settlements = calculateGroupSettlements(group);
        return settlements.settlements;
    };

    const handlePostexpense = () => {
        setShowAddExpenseModal(false);

        postGroupExpense(expenseData);
    };

    const handleDeleteGroup = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteGroup = () => {
        deleteGroup(group.id);
        setShowDeleteModal(false);
        onBack(); // Navigate back after deletion
    };

    return (
        <div className="mb-16 min-h-screen bg-gray-50">
            <div className="bg-white p-4 text-black">
                <div className="items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onBack}
                            className="rounded-full bg-emerald-600 p-2 transition-colors hover:bg-emerald-700">
                            <ArrowRight className="h-5 w-5 rotate-180 text-white" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">{group.name}</h1>
                            <p className="text-black">
                                Total: ₹{group.totalExpense.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 sm:flex-nowrap sm:space-x-2">
                        <button
                            onClick={() => setShowAddMemberModal(true)}
                            className="flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-white transition-colors hover:bg-emerald-700 sm:px-4">
                            <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="ml-1 text-sm sm:text-base">Add Member</span>
                        </button>
                        <button
                            onClick={() => setShowAddExpenseModal(true)}
                            className="flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-white transition-colors hover:bg-emerald-700 sm:px-4">
                            <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="ml-1 text-sm sm:text-base">Add Expense</span>
                        </button>
                        <button
                            onClick={() => setShowSettleUpModal(true)}
                            className="flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-white transition-colors hover:bg-emerald-700 sm:px-4">
                            <Calculator className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="ml-1 text-sm sm:text-base">Settle Up</span>
                        </button>
                        <button
                            onClick={handleDeleteGroup}
                            className="flex items-center justify-center rounded-lg bg-red-600 px-3 py-2 text-white transition-colors hover:bg-red-700 sm:px-4">
                            <Trash2 className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="ml-1 text-sm sm:text-base">Delete Group</span>
                        </button>
                    </div>
                </div>
            </div>

            {(loading === "postMember" || loading === "postMember") && <Loader />}

          

            <div className="p-4">
                <div
                    className={`rounded-xl p-4 ${group.userBalance >= 0 ? "border border-green-200 bg-green-50" : "border border-red-200 bg-red-50"}`}>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">Your Balance</span>
                        <div
                            className={`flex items-center space-x-2 ${group.userBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {group.userBalance >= 0 ? (
                                <TrendingUp className="h-4 w-4" />
                            ) : (
                                <TrendingDown className="h-4 w-4" />
                            )}
                            <span className="text-lg font-bold">
                                {group.userBalance >= 0 ? "You are owed ₹ " : "You owe ₹ "}
                                {Math.abs(group.userBalance).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab("payments")}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === "payments"
                                ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                                : "border-transparent text-slate-600 hover:text-slate-800 hover:border-gray-300"
                        }`}
                    >
                        Total Paid
                    </button>
                    <button
                        onClick={() => setActiveTab("members")}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === "members"
                                ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                                : "border-transparent text-slate-600 hover:text-slate-800 hover:border-gray-300"
                        }`}
                    >
                        Members
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === "history"
                                ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                                : "border-transparent text-slate-600 hover:text-slate-800 hover:border-gray-300"
                        }`}
                    >
                        History
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-50 min-h-[400px] pt-4">
                {/* Tab 1: Total Paid per Member */}
                {activeTab === "payments" && (
                    <div className="px-4 pb-4">
                        <h2 className="mb-3 text-lg font-semibold text-slate-800">Total Paid per Member</h2>
                        <div className="space-y-2">
                            {calculateMemberPayments().map((member) => (
                                <div
                                    key={member.name}
                                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                                                <span className="font-medium text-emerald-600">
                                                    {member.name.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="font-medium text-slate-800">
                                                {member.name}
                                            </span>
                                        </div>
                                        <span className="font-bold text-slate-900">
                                            ₹{member.paid.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-center justify-between font-bold">
                                    <span className="text-slate-800">Total Group Expenses</span>
                                    <span className="text-slate-900">
                                        ₹{group.totalExpense.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Personal Spending Summary Component */}
                        <div className="mt-6">
                            <h2 className="mb-3 text-lg font-semibold text-slate-800">🧾 Personal Spending Summary</h2>
                            <p className="text-sm text-slate-600 mb-4">
                                How much each member actually spent based on their share in group expenses
                            </p>
                            <div className="space-y-2">
                                {(() => {
                                    return group.membersSpending.map((member) => (
                                        <div
                                            key={member.name}
                                            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                                                        <span className="font-medium text-emerald-600">
                                                            {member.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-slate-800">
                                                            {member.name}
                                                        </span>
                                                        <div className="text-xs text-slate-600">
                                                            Based on their share in expenses
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-lg font-bold text-slate-900">
                                                    ₹{member.total_spending.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Group Members */}
                {activeTab === "members" && (
                    <div className="px-4 pb-4">
                        <h2 className="mb-3 text-lg font-semibold text-slate-800">Group Members</h2>
                        <div className="space-y-2">
                            {group.membersList.map((member, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                                                <span className="font-medium text-emerald-600">
                                                    {member.name.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="font-medium text-slate-800">
                                                {member.name}
                                            </span>
                                        </div>
                                        <div
                                            className={`text-sm font-medium ${member.balance === 0 ? "text-slate-500" : member.balance > 0 ? "text-green-600" : "text-red-600"}`}>
                                            {member.balance === 0
                                                ? "Settled"
                                                : member.balance > 0
                                                  ? `+₹${member.balance}`
                                                  : `₹${member.balance}`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab 3: Expense History */}
                {activeTab === "history" && (
                    <div className="px-4 pb-4">
                        <h2 className="mb-3 text-lg font-semibold text-slate-800">Expense History</h2>
                        <div className="space-y-3">
                            {group.expenses.map((expense) => (
                                <div
                                    key={expense.id}
                                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                    <div className="mb-2 flex items-start justify-between">
                                        <h3 className="font-medium text-slate-800">{expense.title}</h3>
                                        <span className="text-lg font-bold text-slate-900">
                                            ₹{expense.amount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        <span>Paid by {expense.paidBy}</span>
                                        <span>{expense.date}</span>
                                    </div>
                                    <div className="mt-2 text-sm text-slate-500">
                                        Split between: {expense.splitBetween.join(", ")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showAddExpenseModal && (
                <AddExpenseModal
                    expenseData={expenseData}
                    setExpenseData={setExpenseData}
                    onSubmit={handlePostexpense}
                    onClose={() => setShowAddExpenseModal(false)}
                    group={group}
                />
            )}
            {showAddMemberModal && (
                <AddMember onClose={() => setShowAddMemberModal(false)} group={group} />
            )}
            {showSettleUpModal && (
                <SettleUpModal
                    group={group}
                    onClose={() => setShowSettleUpModal(false)}
                    calculateSettleUp={calculateSettleUp}
                    generateSettleUpTransactions={generateSettleUpTransactions}
                />
            )}
            {showDeleteModal && (
                <DeleteGroupModal
                    group={group}
                    onConfirm={confirmDeleteGroup}
                    onClose={() => setShowDeleteModal(false)}
                    isLoading={loading === "deleteGroup"}
                />
            )}
        </div>
    );
};

export default GroupDetailPage;
