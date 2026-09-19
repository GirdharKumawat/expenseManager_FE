import { useEffect, useState } from "react";
import { ArrowLeft, Plus, TrendingDown, TrendingUp, Calculator, Trash2, Users, Receipt, History } from "lucide-react";
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
    const [activeTab, setActiveTab] = useState("payments");

    const { loading, groups } = useSelector((state) => state.group);
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

    const calculateMemberPayments = () => {
        return group.membersList.map(member => {
            const memberName = member.name || member;
            return {
                id: member.id || memberName,
                name: memberName,
                paid: member.totalPaid || 0,
                share: member.totalShare || 0,
                balance: member.balance || 0,
            };
        });
    };

    const calculateSettleUp = () => {
        return {
            settlements: group.settlements || [],
            summary: {
                totalGroupExpense: group.totalExpense || 0,
                totalMembers: group.membersList.length,
            }
        };
    };

    const generateSettleUpTransactions = () => {
        return group.settlements || [];
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
        onBack();
    };

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 pb-28 space-y-6 min-h-screen">
            {/* Top Navigation & Action Header */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-6 shadow-xs backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onBack}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-600 hover:text-white transition-colors"
                            title="Go back to groups">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{group.name}</h1>
                            <p className="text-xs font-semibold text-slate-500">
                                Total Expense: ₹{(group.totalExpense || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                    <button
                        onClick={() => setShowAddMemberModal(true)}
                        className="inline-flex items-center justify-center space-x-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all">
                        <Plus className="h-4 w-4" />
                        <span>Add Member</span>
                    </button>
                    <button
                        onClick={() => setShowAddExpenseModal(true)}
                        className="inline-flex items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-600 transition-all">
                        <Plus className="h-4 w-4" />
                        <span>Add Expense</span>
                    </button>
                    <button
                        onClick={() => setShowSettleUpModal(true)}
                        className="inline-flex items-center justify-center space-x-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-all">
                        <Calculator className="h-4 w-4" />
                        <span>Settle Up</span>
                    </button>
                    <button
                        onClick={handleDeleteGroup}
                        className="inline-flex items-center justify-center space-x-1.5 rounded-xl bg-rose-50 border border-rose-200/80 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all ml-auto">
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>

            {loading === "postMember" && <Loader />}

            {/* Balance Overview Card */}
            <div
                className={`rounded-2xl p-5 shadow-xs transition-all ${
                    group.userBalance >= 0
                        ? "border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50/40 text-emerald-900"
                        : "border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50/40 text-rose-900"
                }`}>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Group Balance</span>
                        <div className="flex items-center space-x-2 mt-1">
                            {group.userBalance >= 0 ? (
                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                            ) : (
                                <TrendingDown className="h-5 w-5 text-rose-600" />
                            )}
                            <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                                {group.userBalance >= 0 ? "You are owed ₹" : "You owe ₹"}
                                {Math.abs(group.userBalance || 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-xs backdrop-blur-md flex">
                <button
                    onClick={() => setActiveTab("payments")}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        activeTab === "payments"
                            ? "bg-slate-900 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}>
                    <Receipt className="h-4 w-4" />
                    <span>Total Paid & Summary</span>
                </button>
                <button
                    onClick={() => setActiveTab("members")}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        activeTab === "members"
                            ? "bg-slate-900 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}>
                    <Users className="h-4 w-4" />
                    <span>Members</span>
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        activeTab === "history"
                            ? "bg-slate-900 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}>
                    <History className="h-4 w-4" />
                    <span>Expense History</span>
                </button>
            </div>

            {/* Tab Contents */}
            <div className="space-y-4">
                {activeTab === "payments" && (
                    <div className="space-y-4">
                        <div className="space-y-2.5">
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider px-1">Total Paid Per Member</h2>
                            {calculateMemberPayments().map((member) => (
                                <div
                                    key={member.name}
                                    className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xs">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-700">
                                            {member.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-slate-800">{member.name}</span>
                                    </div>
                                    <span className="font-extrabold text-slate-900">
                                        ₹{(member.paid || 0).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Personal Spending Summary */}
                        {group.membersSpending && group.membersSpending.length > 0 && (
                            <div className="space-y-2.5 pt-2">
                                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider px-1">
                                    🧾 Personal Spending Share
                                </h2>
                                {group.membersSpending.map((member) => (
                                    <div
                                        key={member.name}
                                        className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xs">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-700">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-800">{member.name}</span>
                                                <p className="text-[11px] text-slate-400">Share of total group spend</p>
                                            </div>
                                        </div>
                                        <span className="font-extrabold text-slate-900">
                                            ₹{(member.total_spending || 0).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "members" && (
                    <div className="space-y-2.5">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider px-1">Group Members</h2>
                        {group.membersList.map((member, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xs">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 font-bold text-teal-700">
                                        {member.name.charAt(0)}
                                    </div>
                                    <span className="font-bold text-slate-800">{member.name}</span>
                                </div>
                                <div>
                                    {member.balance === 0 ? (
                                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                                            Settled
                                        </span>
                                    ) : member.balance > 0 ? (
                                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                                            +₹{member.balance}
                                        </span>
                                    ) : (
                                        <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                                            ₹{member.balance}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "history" && (
                    <div className="space-y-3">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider px-1">Group Transactions</h2>
                        {group.expenses && group.expenses.length > 0 ? (
                            group.expenses.map((expense) => (
                                <div
                                    key={expense.id}
                                    className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xs space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{expense.title}</h3>
                                            <p className="text-xs font-medium text-slate-500">Paid by {expense.paidBy} on {expense.date}</p>
                                        </div>
                                        <span className="text-base font-extrabold text-slate-900">
                                            ₹{(expense.amount || 0).toLocaleString()}
                                        </span>
                                    </div>
                                    {expense.splitBetween && (
                                        <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                                            <span className="font-semibold text-slate-700">Split between:</span> {expense.splitBetween.join(", ")}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                                No group expenses added yet.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
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
