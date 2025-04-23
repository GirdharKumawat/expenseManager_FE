import {
    UtensilsCrossed,
    Car,
    Music,
    Lightbulb,
    ShoppingBag,
    Stethoscope,
    Home,
    Package,
    CreditCard, Banknote, Smartphone, Landmark
} from "lucide-react";

const categories = [
    {
        label: "Food",
        icon: UtensilsCrossed,
        color: "bg-emerald-100",
        textColor: "text-emerald-600"
    },
    { label: "Transport", icon: Car, color: "bg-sky-100", textColor: "text-sky-600" },
    { label: "Entertainment", icon: Music, color: "bg-violet-100", textColor: "text-violet-600" },
    { label: "Utilities", icon: Lightbulb, color: "bg-amber-100", textColor: "text-amber-600" },
    { label: "Shopping", icon: ShoppingBag, color: "bg-rose-100", textColor: "text-rose-600" },
    { label: "Health", icon: Stethoscope, color: "bg-pink-100", textColor: "text-pink-600" },
    { label: "Rent", icon: Home, color: "bg-indigo-100", textColor: "text-indigo-600" },
    { label: "Other", icon: Package, color: "bg-slate-100", textColor: "text-slate-600" }
];

const paymentModes = [
  { value: "Card", label: "Card", icon: CreditCard },
  { value: "Cash", label: "Cash", icon: Banknote },
  { value: "Mobile", label: "Mobile", icon: Smartphone },
  { value: "Bank ", label: "Bank", icon: Landmark },
];



export {categories,paymentModes};
