import React from "react";

type StepperProps = {
    current: number;
};

export default function Stepper({ current }: StepperProps) {
    return (
        <div className="flex flex-col items-center gap-4 py-8">
            {[1, 2].map((step) => (
                <div key={step} className="flex flex-col items-center">
                    <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg font-bold
              ${current === step ? "border-white bg-white text-black" : "border-zinc-700 bg-zinc-900 text-zinc-400"}`}
                    >
                        {step}
                    </div>
                    {step !== 2 && <div className="h-8 w-1 bg-zinc-700" />}
                </div>
            ))}
        </div>
    );
} 