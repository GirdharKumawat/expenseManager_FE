import { Banknote, CreditCard, Trash2, Package, AwardIcon } from "lucide-react";
import {categories,paymentModes} from "../components/categories";
import API_ENDPOINT from "../key";



const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month} ${year}`;
};
// Get icon component for a category
const getCategoryIcon = (categoryName) => {
    const category = categories.find((c) => c.label === categoryName);
    if (!category) return Package;
    return category.icon;
};

// Get color for a category
const getCategoryColor = (categoryName) => {
    const category = categories.find((c) => c.label === categoryName);
    if (!category) return "bg-slate-100";
    return category.color;
};

// Get text color for a category
const getCategoryTextColor = (categoryName) => {
    const category = categories.find((c) => c.label === categoryName);
    if (!category) return "text-slate-600";
    return category.textColor;
};
const accessToken = localStorage.getItem("accessToken");


const ExpenseCard = ({ expense ,onDelete}) => {
    const { id, amount, category, description, date, paymentType } = expense
    const IconComponent = getCategoryIcon(category);
    const ModeIconComponent = paymentModes.find((modeObj) => modeObj.value === paymentType)?.icon || CreditCard;

    return (
        <div className="group relative">
            <div className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md">
                {/* Category icon and details */}
                <div className="flex items-center space-x-4">
                    <div
                        className={`rounded-xl p-2.5 ${getCategoryColor(category)} flex items-center justify-center`}>
                        <IconComponent
                            className={`size-5 stroke-[1.5] ${getCategoryTextColor(category)}`}
                        />
                    </div>

                    {/* Details */}
                    <div className="space-y-0.5">
                        <div className="text-base font-semibold text-slate-900">
                            ₹{Number(amount).toFixed(2)}
                        </div>
                        <div className="text-xs font-normal text-slate-500">{description}</div>
                    </div>
                </div>

                {/* Date and payment type */}
                <div className="flex flex-col items-end gap-1.5">
                    <div className="text-xs font-medium text-slate-500">{formatDate(date)}</div>
                    <div>
                        <div className="flex items-center space-x-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                        <ModeIconComponent className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-slate-800">{paymentType}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete button */}
            <button
                onClick={() => onDelete(id)}
                className="absolute -right-2 -top-2 rounded-full border border-slate-200 bg-white p-1.5 text-red-500 opacity-0 shadow-md transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100">
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
};

export default ExpenseCard;
