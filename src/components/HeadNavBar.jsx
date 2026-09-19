import logo from '../assets/logo2.png';
import { Sparkles } from "lucide-react";

const HeadNavBar = () => {
    return (
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all shadow-xs">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-1.5 shadow-md shadow-emerald-500/20">
                        <img className="h-full w-full object-contain" src={logo} alt="Expense Manager Logo" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                            <span>Expense</span>
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Manager</span>
                        </h1>
                        <p className="text-[10px] sm:text-xs font-medium text-slate-400 hidden sm:block">Smart Financial Tracking</p>
                    </div>
                </div>

                
            </div>
        </header>
    );
};

export default HeadNavBar;
