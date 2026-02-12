"use client";

import { HTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

// ─── Main Card ───────────────────────────────────────────────────────────────

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
    glass?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, hoverEffect = false, glass = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(
                    "rounded-2xl border transition-all duration-300 overflow-hidden",
                    // Base Theme
                    glass
                        ? "bg-white/70 dark:bg-black/50 backdrop-blur-md border-white/20 dark:border-white/10"
                        : "bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800",
                    // Shadows
                    "shadow-xl shadow-stone-200/40 dark:shadow-none",
                    // Hover
                    hoverEffect && "hover:shadow-2xl hover:shadow-stone-200/60 dark:hover:shadow-stone-900/50 hover:-translate-y-1",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Card.displayName = "Card";

// ─── Card Header ─────────────────────────────────────────────────────────────

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={clsx("p-6 pb-3", className)}
            {...props}
        >
            {children}
        </div>
    )
);
CardHeader.displayName = "CardHeader";

// ─── Card Content ────────────────────────────────────────────────────────────

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={clsx("p-6 pt-0", className)}
            {...props}
        >
            {children}
        </div>
    )
);
CardContent.displayName = "CardContent";

// ─── Card Footer ─────────────────────────────────────────────────────────────

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={clsx("p-6 pt-0 flex items-center gap-4", className)}
            {...props}
        >
            {children}
        </div>
    )
);
CardFooter.displayName = "CardFooter";
