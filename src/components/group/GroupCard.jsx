import { Users, ChevronRight, UserCheck } from "lucide-react";

const GroupCard = ({ group, onClick }) => (
    <div
        onClick={() => onClick(group)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-4 sm:p-5 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:shadow-md transform hover:-translate-y-0.5">
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                    <Users className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                    <h3 className="truncate text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {group.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                            <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                            {group.members} {group.members === 1 ? 'member' : 'members'}
                        </span>
                        <span>•</span>
                        <span className="truncate">Created by {group.createdBy}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
                <div className="text-right">
                    <p className="text-xs font-semibold text-slate-400">Total Spend</p>
                    <p className="text-sm sm:text-base font-extrabold text-slate-900">
                        ₹{(group.totalExpense || 0).toLocaleString()}
                    </p>
                    <div className="mt-1">
                        {group.userBalance === 0 ? (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                                All settled!
                            </span>
                        ) : group.userBalance > 0 ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                                Owed ₹{group.userBalance.toLocaleString()}
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-rose-50 border border-rose-200/60 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                                Owe ₹{Math.abs(group.userBalance).toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </div>
        </div>
    </div>
);

export default GroupCard;