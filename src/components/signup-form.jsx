import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../features/auth/useAuth";
import { useSelector } from "react-redux";
import GoogleLoginButton from "./GoogleLoginButton";
import TermsCheckbox from "./ui/TermsCheckbox";
import { User, Mail, Lock } from "lucide-react";

export function SignupForm({ className, ...props }) {
    const navigate = useNavigate();
    const { signupUser } = useAuth();

    const { loading, isAuthenticated } = useSelector((state) => state.auth);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!termsAccepted) {
            alert("Please accept the Terms and Conditions and Privacy Policy to continue.");
            return;
        }
        signupUser({ username, email, password });
        setUsername("");
        setEmail("");
        setPassword("");
        setTermsAccepted(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {loading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-xs">
                    <div className="flex flex-col items-center space-y-3 rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                        <p className="text-sm font-bold text-slate-800">Creating your account...</p>
                    </div>
                </div>
            )}
            <Card className="rounded-3xl border border-slate-200/90 bg-white/90 shadow-xl backdrop-blur-md overflow-hidden">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-extrabold text-slate-900">Create Account</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-500">
                        Sign up to start tracking expenses & splitting bills
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
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
                                        placeholder="Choose a username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Password
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <Lock className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            <div className="py-1">
                                <TermsCheckbox 
                                    isChecked={termsAccepted}
                                    onCheck={setTermsAccepted}
                                    required={true}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-600 active:scale-98 transition-all disabled:opacity-50"
                                disabled={!termsAccepted}>
                                Create Account
                            </Button>

                            <div className="flex w-full items-center justify-center my-1">
                                <div className="h-px flex-grow bg-slate-200" />
                                <span className="mx-4 text-xs font-semibold text-slate-400 uppercase">or</span>
                                <div className="h-px flex-grow bg-slate-200" />
                            </div>

                            <GoogleLoginButton />

                            <div className="text-center text-xs font-semibold text-slate-600 mt-1">
                                Already have an account?{" "}
                                <Link to="/login" className="text-emerald-600 hover:underline font-bold">
                                    Log in
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
