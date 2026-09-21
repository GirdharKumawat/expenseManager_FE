import { CreditCard, Trash2, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { categories, paymentModes } from "../components/categories";

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month} '${year}`;
};

const getCategoryMeta = (categoryName) => {
    const category = categories.find((c) => c.label === categoryName);
    if (!category) {
        return {
            icon: Package,
            gradient: "from-slate-500 to-slate-700",
            badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
            glow: "shadow-slate-500/20",
            emoji: "📦"
        };
    }
    return category;
};

const ExpenseCard = ({ expense, onDelete }) => {
    const { amount, category, description, date, paymentType, transaction_type = "DEBIT" } = expense;
    const meta = getCategoryMeta(category);
    const IconComponent = meta.icon;
    const modeObj = paymentModes.find((m) => m.value === paymentType);
    const ModeIconComponent = modeObj?.icon || CreditCard;
    const isCredit = transaction_type === "CREDIT";

    return (
        <div className="group relative transition-all duration-300 transform hover:-translate-y-0.5">
            <div className={`flex w-full items-center justify-between rounded-2xl border p-4 shadow-xs backdrop-blur-md transition-all ${
                isCredit 
                    ? "border-emerald-200/90 bg-emerald-50/20 hover:border-emerald-500/50 hover:shadow-card-hover" 
                    : "border-slate-200/80 bg-white/95 hover:border-emerald-500/40 hover:shadow-card-hover"
            }`}>
                {/* Left section: Icon + Details */}
                <div className="flex items-center space-x-3.5 min-w-0 flex-1 pr-2">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr ${meta.gradient} text-white shadow-md ${meta.glow} transition-transform group-hover:scale-105`}>
                        <IconComponent className="h-5.5 w-5.5 stroke-[2]" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className={`text-base sm:text-lg font-black tracking-tight ${isCredit ? "text-emerald-700" : "text-slate-900"}`}>
                                {isCredit ? "+" : "-"}₹{Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${meta.badgeBg}`}>
                                <span>{meta.emoji}</span>
                                <span>{category}</span>
                            </span>
                            <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                                isCredit ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}>
                                {isCredit ? <ArrowUpRight className="h-3 w-3 stroke-[3]" /> : <ArrowDownRight className="h-3 w-3 stroke-[3]" />}
                                <span>{isCredit ? "Credit" : "Debit"}</span>
                            </span>
                        </div>
                        <p className="truncate text-xs font-semibold text-slate-500 mt-0.5">
                            {description || "No description provided"}
                        </p>
                    </div>
                </div>

                {/* Right section: Date, Payment mode & Delete button */}
                <div className="flex items-center space-x-3 shrink-0">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[11px] font-bold text-slate-400">
                            {formatDate(date)}
                        </span>
                        <div className="inline-flex items-center space-x-1.5 rounded-full bg-slate-100/90 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/60">
                            <ModeIconComponent className={`h-3.5 w-3.5 ${modeObj?.color ? modeObj.color.split(' ')[0] : 'text-emerald-600'}`} />
                            <span className="text-xs">{paymentType}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onDelete(expense)}
                        className="rounded-xl border border-slate-200/80 bg-slate-50 p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 active:scale-95 cursor-pointer"
                        title="Delete transaction"
                        aria-label="Delete expense">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseCard;