"use client";
import { useState } from "react";
import ContinueButton from "./ContinueButton";
import Input from "./Input";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";
import PasswordToggleButton from "./PasswordToggleButton";

export default function SigninForm() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        });
        setLoading(false);
        if (error) setError(error.message);
        else router.push("/home");
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-2">Sign In</h2>
            <p className="text-zinc-400 text-sm mb-6">Enter your credentials below</p>
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
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="pr-12"
                />
                <PasswordToggleButton show={showPassword} onClick={() => setShowPassword((v) => !v)} />
            </div>
            <ContinueButton
                type="submit"
                loading={loading}
                disabled={loading}
                className="mt-4"
            >
                Sign In
            </ContinueButton>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <p className="text-zinc-400 mt-6 text-center">Don&apos;t have an account? <a href="/signup" className="text-white underline">Sign Up</a></p>
        </form>
    );
} 