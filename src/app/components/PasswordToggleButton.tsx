import React from "react";

type PasswordToggleButtonProps = {
    show: boolean;
    onClick: () => void;
};

export default function PasswordToggleButton({ show, onClick }: PasswordToggleButtonProps) {
    return (
        <button
            type="button"
            tabIndex={-1}
            onClick={onClick}
            className="absolute right-3 top-0 bottom-0 flex items-center h-full pt-2 text-zinc-400 hover:text-zinc-200 focus:outline-none"
            aria-label={show ? "Hide password" : "Show password"}
        >
            {show ? (
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
    );
} 