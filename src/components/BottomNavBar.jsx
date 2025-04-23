/** Imported modules */
import { Home, User, Plus } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

function BottomNavBar() {
    /** Location */
    const location = useLocation();

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-white shadow-[0_-1px_4px_0_rgba(17,24,39,0.08)]">
            <div className="flex h-16 items-center justify-between px-14">
                {/* Home */}
                <NavLink
                    to="/"
                    className={`flex flex-col items-center space-y-0.5 ${location.pathname === "/" ? "text-emerald-600" : "text-gray-500"}`}>
                    <Home size={24} />
                    <span className="text-xs font-medium">Home</span>
                </NavLink>
                    
                    {/* Analysis */}
                <NavLink
                    to="/analysis"
                    className={`flex flex-col items-center space-y-0.5 ${location.pathname === "analysis" ? "text-emerald-600" : "text-gray-500"}`}>
                    <Home size={24} />
                    <span className="text-xs font-medium">Analysis</span>
                </NavLink>
                <NavLink
                    to="/analysis"
                    className={`flex flex-col items-center space-y-0.5 ${location.pathname === "analysis" ? "text-emerald-600" : "text-gray-500"}`}>
                    <Home size={24} />
                    <span className="text-xs font-medium">Analysis</span>
                </NavLink>

                {/* Add */}
                <div className="absolute left-1/2 flex -translate-x-1/2 -translate-y-3 flex-col items-center space-y-1">
                    <NavLink
                        to="/add"
                        className="flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white transition-transform duration-150 active:scale-90">
                        <Plus size={28} />
                    </NavLink>
                    <span
                        className={`text-xs font-medium ${location.pathname === "/add" ? "text-emerald-600" : "text-gray-500"}`}>
                        Add
                    </span>
                </div>

                {/* Account */}
                <NavLink
                    to="/account"
                    className={`flex flex-col items-center space-y-0.5 ${location.pathname === "/account" ? "text-emerald-600" : "text-gray-500"}`}>
                    <User size={24} />
                    <span className="text-xs font-medium">Account</span>
                </NavLink>
            </div>
        </div>
    );
}

export default BottomNavBar;
