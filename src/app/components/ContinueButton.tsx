import React from "react";

type ContinueButtonProps = {
    children?: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit";
};

export default function ContinueButton({
    children = "Continue",
    loading = false,
    disabled = false,
    onClick,
    className = "",
    type = "button",
}: ContinueButtonProps) {
    return (
        <button
            type={type}
            className={`w-full py-3 rounded bg-white text-black font-semibold hover:bg-zinc-200 mt-8 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading ? "Saving..." : children}
        </button>
    );
} 