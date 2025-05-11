"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import ContinueButton from "./ContinueButton";
import Input from "./Input";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";
import PasswordToggleButton from "./PasswordToggleButton";

export default function SignupForm() {
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            // Validate input
            if (!form.email || !form.password || !form.firstName || !form.lastName) {
                throw new Error('All fields are required');
            }

            if (form.password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }

            // First, sign up the user with minimal data
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: form.email.toLowerCase().trim(),
                password: form.password,
            });

            if (signUpError) {
                console.error('Auth signup error:', signUpError);
                throw new Error(signUpError.message || 'Failed to create account');
            }

            if (!authData.user?.id) {
                throw new Error('User creation failed - no user ID returned');
            }

            // Wait a moment to ensure the auth user is fully created
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update user metadata
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    first_name: form.firstName.trim(),
                    last_name: form.lastName.trim(),
                }
            });

            if (updateError) {
                console.error('Metadata update error:', updateError);
                // Continue anyway as this is not critical
            }

            // Then, insert into profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    email: form.email.toLowerCase().trim(),
                    user_id: authData.user.id,
                    first_name: form.firstName.trim(),
                    last_name: form.lastName.trim(),
                    account_type: 'free',
                    created_at: new Date().toISOString()
                });

            if (profileError) {
                console.error('Profile creation error:', profileError);
                // If profile creation fails, we should clean up the auth user
                try {
                    await supabase.auth.admin.deleteUser(authData.user.id);
                } catch (deleteError) {
                    console.error('Error cleaning up auth user:', deleteError);
                }
                throw new Error('Failed to create profile. Please try again.');
            }

            setSuccess('Account created successfully! Please check your email to verify your account.');
            router.push("/onboarding1");
        } catch (error: any) {
            console.error('Signup error:', error);
            setError(error.message || 'An error occurred during signup');
        } finally {
            setLoading(false);
        }
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
                <PasswordToggleButton show={showPassword} onClick={() => setShowPassword((v) => !v)} />
            </div>
            <ContinueButton
                type="submit"
                loading={loading}
                disabled={loading}
                className="mt-4"
            >
                Sign Up
            </ContinueButton>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
            <p className="text-zinc-400 mt-6 text-center">Already have an account? <a href="/signin" className="text-white underline">Log in</a></p>
        </form>
    );
} 