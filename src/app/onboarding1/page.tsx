"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { COUNTRIES } from "../constants";
import CountrySelect from "../components/CountrySelect";
import Stepper from "../components/Stepper";
import ContinueButton from "../components/ContinueButton";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Onboarding1() {
    const [country, setCountry] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleContinue = async () => {
        setLoading(true);
        setError("");
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
        console.log("Supabase user:", user);
        console.log("Supabase userError:", userError);
        if (!user || userError) {
            setError("Could not get user info");
            setLoading(false);
            return;
        }
        const email = user.email;
        console.log("Updating country for email:", email, "to", country);
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ country })
            .eq("email", email);
        console.log("Update error:", updateError);
        setLoading(false);
        if (updateError) {
            setError(updateError.message);
            return;
        }
        router.push("/onboarding2");
    };

    return (
        <div className="min-h-screen flex bg-black">
            {/* Stepper */}
            <div className="w-24 flex flex-col items-center justify-center">
                <Stepper current={1} />
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-2xl min-h-[600px] bg-[#18181b] rounded-2xl p-10 flex flex-col items-center shadow-xl">
                    <h1 className="text-white text-2xl font-bold mb-2 text-center">Where Are You Currently Located?</h1>
                    <p className="text-zinc-400 text-sm mb-8 text-center">Select a country. Don&apos;t worry you&apos;ll be able to change this later</p>
                    <CountrySelect countries={COUNTRIES} value={country} onChange={setCountry} />
                    <ContinueButton
                        onClick={handleContinue}
                        loading={loading}
                        disabled={!country || loading}
                    />
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </div>
            </div>
        </div>
    );
} 