import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", ...props }, ref) => (
        <input
            ref={ref}
            className={`p-3 rounded bg-zinc-900 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white ${className}`}
            {...props}
        />
    )
);
Input.displayName = "Input";

export default Input; 