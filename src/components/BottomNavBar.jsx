import { Home, User, Users, PieChart, Plus } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function BottomNavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const checkModalState = () => {
            const isOverflowHidden = document.body.style.overflow === "hidden";
            setIsModalOpen(isOverflowHidden);
        };

        // Check initially
        checkModalState();

        // Observe body style mutations for modal open/close
        const observer = new MutationObserver(checkModalState);
        observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

        const handleModalEvent = (e) => {
            setIsModalOpen(e.detail?.isOpen ?? true);
        };

        window.addEventListener("open-add-expense", () => setIsModalOpen(true));
        window.addEventListener("modal-state-change", handleModalEvent);

        return () => {
            observer.disconnect();
            window.removeEventListener("open-add-expense", () => setIsModalOpen(true));
            window.removeEventListener("modal-state-change", handleModalEvent);
        };
    }, []);

 

    // Completely hide bottom bar when any modal/drawer is open
    if (isModalOpen) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 bottom-3 z-40 px-3 pointer-events-none transition-all duration-300 animate-slideUp">
            <nav aria-label="Bottom Navigation" className="mx-auto max-w-md pointer-events-auto rounded-full bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 shadow-2xl p-1.5 flex items-center justify-between px-3 sm:px-5">
                {/* Home */}
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-full transition-all duration-200 ${
                            isActive
                                ? "text-emerald-400 bg-white/10 font-semibold"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        }`
                    }>
                    <Home className="h-5 w-5" />
                    <span className="text-[10px] font-semibold mt-0.5">Home</span>
                </NavLink>

                {/* Analysis */}
                <NavLink
                    to="/analysis"
                    className={({ isActive }) =>
                        `relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-full transition-all duration-200 ${
                            isActive
                                ? "text-emerald-400 bg-white/10 font-semibold"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        }`
                    }>
                    <PieChart className="h-5 w-5" />
                    <span className="text-[10px] font-semibold mt-0.5">Analysis</span>
                </NavLink>

            
                {/* Groups */}
                <NavLink
                    to="/groups"
                    className={({ isActive }) =>
                        `relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-full transition-all duration-200 ${
                            isActive
                                ? "text-emerald-400 bg-white/10 font-semibold"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        }`
                    }>
                    <Users className="h-5 w-5" />
                    <span className="text-[10px] font-semibold mt-0.5">Groups</span>
                </NavLink>

                {/* Account */}
                <NavLink
                    to="/account"
                    className={({ isActive }) =>
                        `relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-full transition-all duration-200 ${
                            isActive
                                ? "text-emerald-400 bg-white/10 font-semibold"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        }`
                    }>
                    <User className="h-5 w-5" />
                    <span className="text-[10px] font-semibold mt-0.5">Account</span>
                </NavLink>
            </nav>
        </div>
    );
}

export default BottomNavBar;
