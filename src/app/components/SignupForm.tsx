"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Button from "./Button";
import Input from "./Input";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignupForm() {
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    first_name: form.firstName,
                    last_name: form.lastName,
                },
            },
        });
        setLoading(false);
        if (error) setError(error.message);
        else setSuccess("Account created! You can now log in.");
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-2">Account Sign Up</h2>
            <p className="text-zinc-400 text-sm mb-6">Enter your information below</p>
            <div className="flex flex-col gap-4">
                <label className="text-zinc-300 text-sm font-medium" htmlFor="firstName">First Name</label>
                <Input id="firstName" name="firstName" placeholder="e.g. John" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="flex flex-col gap-4">
                <label className="text-zinc-300 text-sm font-medium" htmlFor="lastName">Last Name</label>
                <Input id="lastName" name="lastName" placeholder="e.g. Doe" value={form.lastName} onChange={handleChange} required />
            </div>
            <div className="flex flex-col gap-4">
                <label className="text-zinc-300 text-sm font-medium" htmlFor="email">Email</label>
                <Input id="email" name="email" type="email" placeholder="e.g. jdoe@gmail.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="flex flex-col gap-4 relative">
                <label className="text-zinc-300 text-sm font-medium" htmlFor="password">Password</label>
                <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password (must be at least 8 characters)"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="pr-12"
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-0 bottom-0 flex items-center h-full pt-2 text-zinc-400 hover:text-zinc-200 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? (
                        // Eye-off SVG
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0012 15a3 3 0 002.121-5.121M9.88 9.88A3 3 0 0115 12c0 1.657-1.343 3-3 3a3 3 0 01-2.121-5.121" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c1.61 0 3.117.385 4.418 1.06M19.542 12c-1.274 4.057-5.065 7-9.542 7-1.61 0-3.117-.385-4.418-1.06" />
                        </svg>
                    ) : (
                        // Eye SVG
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>
            <Button type="submit" className="w-full py-3 rounded bg-white text-black font-semibold hover:bg-zinc-200 mt-4" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
            <p className="text-zinc-400 mt-6 text-center">Already have an account? <a href="/login" className="text-white underline">Log in</a></p>
        </form>
    );
} 