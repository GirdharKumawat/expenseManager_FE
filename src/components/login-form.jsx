import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import API_ENDPOINT from "../key";

export function LoginForm({ className, ...props }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const API = `${API_ENDPOINT}api/auth/token/`;

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        let response = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.status === 200) {
            let data = await response.json();
            localStorage.setItem("refreshToken", data.refresh);
            localStorage.setItem("accessToken", data.access);
            navigate("/");
        } else {
            setError("Invalid credentials");
        }
    };

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
                        <p className="text-sm text-green-600">Please wait while we Log in you in</p>
                    </div>
                </div>
            )}

      
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>Log in to your account to continue.</CardDescription>
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
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="#"
                                            className="ml-auto text-sm underline-offset-4 hover:underline">
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <Button onClick={handleSubmit} type="submit" className="hover:bg-emerald-600 w-full bg-emerald-500">
                                    Login
                                </Button>
                            </div>

                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link to="/signup" className="underline underline-offset-4">
                                    Sign up
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
