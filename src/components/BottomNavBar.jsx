/** Imported modules */
import { Home, User, Users, BarChart2, FileUp } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

function BottomNavBar() {
    const location = useLocation();

    return (
        <div className="fixed inset-x-0 bottom-0 z-20 bg-white shadow-[0_-1px_4px_0_rgba(17,24,39,0.08)]">
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
                    className={`flex flex-col items-center space-y-0.5 ${location.pathname === "/analysis" ? "text-emerald-600" : "text-gray-500"}`}>
                    <BarChart2 size={24} />
                    <span className="text-xs font-medium">Analysis</span>
                </NavLink>

                

                {/* Upload */}
                <NavLink
                    to="/groups"
                    className={`flex flex-col items-center space-y-0.5 ${location.pathname === "/groups" ? "text-emerald-600" : "text-gray-500"}`}>
                    <Users size={24} />
                    <span className="text-xs font-medium">Group</span>
                </NavLink>

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
