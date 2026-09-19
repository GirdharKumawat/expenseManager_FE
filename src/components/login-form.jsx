import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../features/auth/useAuth";
import GoogleLoginButton from "./GoogleLoginButton";
import Loader from "./ui/Loader";
import { Lock, User } from "lucide-react";

export function LoginForm({ className, ...props }) {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const { loading, isAuthenticated } = useSelector((state) => state.auth);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser({ username, password });
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {loading && <Loader />}

            <Card className="rounded-3xl border border-slate-200/90 bg-white/90 shadow-xl backdrop-blur-md overflow-hidden">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-extrabold text-slate-900">Welcome Back</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-500">
                        Log in to access your personal expenses & groups
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Username
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <User className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Password
                                    </Label>
                                </div>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <Lock className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-600 active:scale-98 transition-all">
                                Log In
                            </Button>

                            <div className="flex w-full items-center justify-center my-1">
                                <div className="h-px flex-grow bg-slate-200" />
                                <span className="mx-4 text-xs font-semibold text-slate-400 uppercase">or</span>
                                <div className="h-px flex-grow bg-slate-200" />
                            </div>

                            <GoogleLoginButton />

                            <div className="text-center text-xs font-semibold text-slate-600 mt-1">
                                Don&apos;t have an account?{" "}
                                <Link to="/signup" className="text-emerald-600 hover:underline font-bold">
                                    Sign up now
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="text-center text-[11px] font-medium text-slate-400">
                By continuing, you agree to our{" "}
                <Link to="/terms" className="underline hover:text-slate-600">Terms of Service</Link> and{" "}
                <Link to="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
            </div>
        </div>
    );
}
