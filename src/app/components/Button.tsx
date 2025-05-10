import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, className = "", ...props }, ref) => (
        <button
            ref={ref}
            className={`transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {children}
        </button>
    )
);
Button.displayName = "Button";

export default Button; 