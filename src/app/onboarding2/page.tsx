"use client";
import { useState } from "react";
import Stepper from "../components/Stepper";
import ContinueButton from "../components/ContinueButton";
import { FaRegGem, FaRocket, FaCrown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";

const TIERS = [
    {
        key: "free",
        label: "Free",
        icon: <FaRocket size={40} color="#67e8f9" />,
        description: "tier description inserted here",
        border: "border-cyan-300",
    },
    {
        key: "basic",
        label: "Basic",
        icon: <FaRegGem size={40} color="#6ee7b7" />,
        description: "tier description inserted here",
        border: "border-green-300",
    },
    {
        key: "pro",
        label: "Pro",
        icon: <FaCrown size={40} color="#fde68a" />,
        description: "tier description inserted here",
        border: "border-yellow-300",
    },
];

export default function Onboarding2() {
    const [selected, setSelected] = useState<string>("");
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
        if (!user || userError) {
            setError("Could not get user info");
            setLoading(false);
            return;
        }
        const email = user.email;
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ account_type: selected })
            .eq("email", email);
        setLoading(false);
        if (updateError) {
            setError(updateError.message);
            return;
        }
        router.push("/home"); // or next step
    };

    return (
        <div className="min-h-screen flex bg-black">
            {/* Stepper */}
            <div className="w-24 flex flex-col items-center justify-center">
                <Stepper current={2} />
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-2xl min-h-[600px] bg-[#18181b] rounded-2xl p-10 flex flex-col items-center shadow-xl">
                    <h1 className="text-white text-2xl font-bold mb-2 text-center">Select Account Type</h1>
                    <p className="text-zinc-400 text-sm mb-8 text-center">We have different pricings and tiers depending on your project requirements</p>
                    <div className="flex flex-row gap-8 w-full justify-center mb-8">
                        {TIERS.map((tier) => (
                            <button
                                key={tier.key}
                                type="button"
                                onClick={() => setSelected(tier.key)}
                                className={`flex flex-col items-center gap-4 p-8 rounded-xl border-2 transition-all w-64 h-64 shadow text-center focus:outline-none focus:ring-2 focus:ring-white bg-zinc-900
                                    ${selected === tier.key ? `${tier.border} bg-opacity-80` : "border-zinc-700 hover:border-white"}`}
                            >
                                {tier.icon}
                                <span className="text-white text-xl font-semibold">{tier.label}</span>
                                <span className="text-zinc-400 text-base mt-2">{tier.description}</span>
                            </button>
                        ))}
                    </div>
                    <ContinueButton
                        onClick={handleContinue}
                        loading={loading}
                        disabled={!selected || loading}
                    />
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </div>
            </div>
        </div>
    );
} 