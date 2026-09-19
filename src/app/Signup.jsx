import { SignupForm } from "@/components/signup-form.jsx";
import logo from "@/assets/logo2.png";

export default function Signup() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 selection:bg-emerald-500 selection:text-white">
            {/* Background Glow Accents */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
                {/* Brand Logo Header */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-2 shadow-lg shadow-emerald-500/25">
                        <img className="h-full w-full object-contain" src={logo} alt="Expense Manager" />
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Expense<span className="text-emerald-600">Manager</span>
                    </h1>
                </div>

                <SignupForm />
            </div>
        </div>
    );
}
