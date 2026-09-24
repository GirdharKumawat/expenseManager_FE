import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../features/auth/useAuth";
import { Book, LogOut, ShieldCheck, FileText, User, Mail, Sparkles, ChevronRight } from "lucide-react";

function Account() {
    const navigate = useNavigate();
    const { logoutUser, fetchUser } = useAuth();
    const { username, email } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!username) {
            fetchUser();
        }
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <div className="mx-auto max-w-md px-4 sm:px-6 py-8 pb-28 space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Account Profile</h1>
                <p className="text-sm font-medium text-slate-500 mt-1">Manage your account and preferences</p>
            </div>

            {username ? (
                <div className="space-y-4">
                    {/* Profile Header Card */}
                    <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-xs backdrop-blur-md">
                        <div className="flex items-center space-x-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-2xl font-extrabold text-white shadow-lg shadow-emerald-500/20">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2">
                                    <h2 className="truncate text-xl font-bold text-slate-900">{username}</h2>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                                        <Sparkles className="h-3 w-3" /> Pro User
                                    </span>
                                </div>
                                <p className="truncate text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{email || "No email linked"}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Menu Options */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white/90 overflow-hidden shadow-xs backdrop-blur-md divide-y divide-slate-100">
                        {/* User Guide */}
                        <button
                            onClick={() => navigate("/guide")}
                            className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <Book className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">User Guide</h3>
                                    <p className="text-xs text-slate-400">Learn features & quick shortcuts</p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                        </button>

                        {/* Terms */}
                        <button
                            onClick={() => navigate("/terms")}
                            className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Terms of Service</h3>
                                    <p className="text-xs text-slate-400">View usage terms and agreement</p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </button>

                        {/* Privacy Policy */}
                        <button
                            onClick={() => navigate("/privacy")}
                            className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors">Privacy Policy</h3>
                                    <p className="text-xs text-slate-400">Read how your data is protected</p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                        </button>

                        {/*   current   versions */}
                        <div className="flex w-full items-center justify-between p-4 text-left">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">Current Version</h3>
                                    <p className="text-xs text-slate-400">v1.0.0</p>
                                </div>
                            </div>
                        </div>  
                      
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 border border-rose-200/80 px-4 py-3.5 text-sm font-bold text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-all active:scale-98">
                        <LogOut className="h-4 w-4" />
                        <span>Log Out</span>
                    </button>
                </div>
            ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mb-3" />
                    <p className="text-xs font-semibold text-slate-500">Loading user profile...</p>
                </div>
            )}
        </div>
    );
}

export default Account;
