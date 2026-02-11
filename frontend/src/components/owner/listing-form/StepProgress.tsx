"use client";

import { CheckCircle } from "@phosphor-icons/react";

interface StepProgressProps {
    currentStep: number;
    steps: string[];
}

export default function StepProgress({ currentStep, steps }: StepProgressProps) {
    return (
        <div className="mb-8">
            {/* Step Indicators */}
            <div className="flex items-center justify-between relative">
                {/* Background Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-stone-200 dark:bg-stone-700" />
                {/* Progress Line */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((label, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={label} className="relative z-10 flex flex-col items-center">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${isCompleted
                                        ? "border-primary bg-primary text-white"
                                        : isCurrent
                                            ? "border-primary bg-white dark:bg-stone-900 text-primary shadow-lg shadow-primary/20"
                                            : "border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-400"
                                    }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle size={20} weight="bold" />
                                ) : (
                                    <span className="text-sm font-bold">{index + 1}</span>
                                )}
                            </div>
                            <span
                                className={`mt-2 text-xs font-semibold whitespace-nowrap ${isCurrent
                                        ? "text-primary"
                                        : isCompleted
                                            ? "text-stone-700 dark:text-stone-300"
                                            : "text-stone-400 dark:text-stone-500"
                                    }`}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
