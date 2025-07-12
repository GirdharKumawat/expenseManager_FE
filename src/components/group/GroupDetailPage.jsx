import { useEffect, useState } from "react";
import { ArrowRight, Plus, TrendingDown, TrendingUp } from "lucide-react";
import AddExpenseModal from "./AddExpenseModal";
import AddMember from "./AddMemberModal";
import { useSelector } from "react-redux";
import useGroup from "../../features/group/useGroup";
import Loader from "../ui/Loader";
const GroupDetailPage = ({ currGroup, onBack }) => {
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);

    const { loading, groups } = useSelector((state) => state.group);
    
    // Get the updated group from Redux store instead of local state
    const group = groups.find(g => g.id === currGroup.id) || currGroup;
 
    const [expenseData, setExpenseData] = useState({
        group: group.id,
        title: "",
        amount: "",
        paidBy: "",
        note: "",
        shares: []
    });
    
    useEffect(() => {
    }, [group]);

    const { postGroupExpense } = useGroup();

    const handlePostexpense = () => {
        setShowAddExpenseModal(false);
     
        postGroupExpense(expenseData);
    };

    

    return (
        <div className="mb-16 min-h-screen bg-gray-50">
            <div className="bg-white p-4 text-black">
                <div className="flex items-center justify-between">
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
                    <div className="flex">
                        <button
                            onClick={() => setShowAddMemberModal(true)}
                            className="mx-2 flex rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700">
                            <Plus className="h-6 w-6" /> <span>Add Member</span>
                        </button>
                        <button
                            onClick={() => setShowAddExpenseModal(true)}
                            className="flex rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700">
                            <Plus className="h-6 w-6" /> <span>Add Expense</span>
                        </button>
                    </div>
                </div>
            </div>


            {(loading==="postMember" ||loading==="postMember") && <Loader/>}

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
        </div>
    );
};

export default GroupDetailPage;
