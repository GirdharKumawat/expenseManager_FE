import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export function SignupForm({ className, ...props }) {
    const navigate = useNavigate();
    const { signupUser } = useAuth();

    const { loading, isAuthenticated } = useSelector((state) => state.auth);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        signupUser({ username, email, password });
        setUsername("");
        setEmail("");
        setPassword("");
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/"); // Redirect to home after successful login
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {loading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="animate-fadeIn flex flex-col items-center space-y-4 rounded-xl bg-white p-6 shadow-md">
                        <svg
                            className="h-12 w-12 animate-spin text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <p className="text-lg font-semibold text-green-700">Loading...</p>
                        <p className="text-sm text-green-600">Please wait while we sign you in</p>
                    </div>
                </div>
            )}
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Sign up</CardTitle>
                    <CardDescription>Create an account to get started.</CardDescription>
                </CardHeader>

                <CardContent>
                    <form>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="**********"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                                    onClick={handleSubmit}>
                                    Sign up
                                </Button>
                            </div>

                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link to="/login" className="underline underline-offset-4">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="text-balance text-center text-xs leading-relaxed text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
