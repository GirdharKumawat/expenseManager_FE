import {
    UtensilsCrossed,
    Car,
    Music,
    Lightbulb,
    ShoppingBag,
    Stethoscope,
    Home,
    Package,
    CreditCard,
    Banknote,
    Smartphone,
    Landmark,
    ShieldAlert,
    Sparkles
} from "lucide-react";

const categories = [
    {
        label: "Food",
        icon: UtensilsCrossed,
        color: "bg-emerald-100",
        textColor: "text-emerald-600",
        gradient: "from-emerald-500 to-teal-500",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
        glow: "shadow-emerald-500/20",
        emoji: "🍔"
    },
    {
        label: "Transport",
        icon: Car,
        color: "bg-sky-100",
        textColor: "text-sky-600",
        gradient: "from-sky-500 to-blue-500",
        badgeBg: "bg-sky-50 text-sky-700 border-sky-200/60",
        glow: "shadow-sky-500/20",
        emoji: "🚗"
    },
    {
        label: "Entertainment",
        icon: Music,
        color: "bg-violet-100",
        textColor: "text-violet-600",
        gradient: "from-violet-500 to-purple-500",
        badgeBg: "bg-violet-50 text-violet-700 border-violet-200/60",
        glow: "shadow-violet-500/20",
        emoji: "🎬"
    },
    {
        label: "Utilities",
        icon: Lightbulb,
        color: "bg-amber-100",
        textColor: "text-amber-600",
        gradient: "from-amber-500 to-yellow-500",
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200/60",
        glow: "shadow-amber-500/20",
        emoji: "💡"
    },
    {
        label: "Shopping",
        icon: ShoppingBag,
        color: "bg-rose-100",
        textColor: "text-rose-600",
        gradient: "from-rose-500 to-pink-500",
        badgeBg: "bg-rose-50 text-rose-700 border-rose-200/60",
        glow: "shadow-rose-500/20",
        emoji: "🛍️"
    },
    {
        label: "Health",
        icon: Stethoscope,
        color: "bg-pink-100",
        textColor: "text-pink-600",
        gradient: "from-pink-500 to-rose-500",
        badgeBg: "bg-pink-50 text-pink-700 border-pink-200/60",
        glow: "shadow-pink-500/20",
        emoji: "🩺"
    },
    {
        label: "Rent",
        icon: Home,
        color: "bg-indigo-100",
        textColor: "text-indigo-600",
        gradient: "from-indigo-500 to-blue-600",
        badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
        glow: "shadow-indigo-500/20",
        emoji: "🏠"
    },
    {
        label: "Salary",
        icon: Sparkles,
        color: "bg-emerald-100",
        textColor: "text-emerald-700",
        gradient: "from-emerald-600 to-green-500",
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
        glow: "shadow-emerald-500/20",
        emoji: "💼"
    },
    {
        label: "Freelance",
        icon: Sparkles,
        color: "bg-teal-100",
        textColor: "text-teal-700",
        gradient: "from-teal-500 to-cyan-600",
        badgeBg: "bg-teal-50 text-teal-800 border-teal-200/80",
        glow: "shadow-teal-500/20",
        emoji: "💻"
    },
    {
        label: "Investment",
        icon: Sparkles,
        color: "bg-blue-100",
        textColor: "text-blue-700",
        gradient: "from-blue-600 to-indigo-600",
        badgeBg: "bg-blue-50 text-blue-800 border-blue-200/80",
        glow: "shadow-blue-500/20",
        emoji: "📈"
    },
    {
        label: "Refund",
        icon: Sparkles,
        color: "bg-emerald-100",
        textColor: "text-emerald-600",
        gradient: "from-emerald-500 to-teal-500",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
        glow: "shadow-emerald-500/20",
        emoji: "🔄"
    },
    {
        label: "Gift",
        icon: Sparkles,
        color: "bg-purple-100",
        textColor: "text-purple-700",
        gradient: "from-purple-500 to-pink-500",
        badgeBg: "bg-purple-50 text-purple-800 border-purple-200/80",
        glow: "shadow-purple-500/20",
        emoji: "🎁"
    },
    {
        label: "Other",
        icon: Package,
        color: "bg-slate-100",
        textColor: "text-slate-600",
        gradient: "from-slate-500 to-slate-700",
        badgeBg: "bg-slate-100 text-slate-700 border-slate-200/60",
        glow: "shadow-slate-500/20",
        emoji: "📦"
    }
];

const paymentModes = [
    { value: "Card", label: "Card", icon: CreditCard, color: "text-indigo-600 bg-indigo-50" },
    { value: "Cash", label: "Cash", icon: Banknote, color: "text-emerald-600 bg-emerald-50" },
    { value: "Mobile", label: "Mobile / UPI", icon: Smartphone, color: "text-purple-600 bg-purple-50" },
    { value: "Bank", label: "Bank Transfer", icon: Landmark, color: "text-blue-600 bg-blue-50" }
];

export { categories, paymentModes };
