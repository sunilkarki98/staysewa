"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import { CircleNotch } from "@phosphor-icons/react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: string;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            href,
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            children,
            disabled,
            type = "button",
            ...props
        },
        ref
    ) => {
        const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]";

        const variants = {
            primary: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25 border border-transparent focus:ring-primary",
            secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700 border border-transparent focus:ring-stone-500",
            outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5 dark:hover:bg-primary/10",
            ghost: "bg-transparent text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800",
            link: "bg-transparent text-primary hover:underline p-0 h-auto shadow-none",
            danger: "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20 focus:ring-red-500",
        };

        const sizes = {
            sm: "text-sm px-3 py-1.5 rounded-lg gap-1.5",
            md: "text-base px-5 py-2.5 rounded-xl gap-2",
            lg: "text-lg px-8 py-3.5 rounded-2xl gap-2.5",
        };

        const classes = clsx(
            baseStyles,
            variants[variant],
            variant !== 'link' && sizes[size],
            fullWidth && "w-full",
            (isLoading) && "opacity-80 cursor-wait",
            className
        );

        const content = (
            <>
                {isLoading && <CircleNotch size={20} className="animate-spin" />}
                {!isLoading && leftIcon}
                <span>{children}</span>
                {!isLoading && rightIcon}
            </>
        );

        if (href) {
            return (
                <Link
                    href={href}
                    className={classes}
                    aria-disabled={disabled || isLoading}
                >
                    {content}
                </Link>
            );
        }

        return (
            <button
                ref={ref}
                type={type}
                className={classes}
                disabled={disabled || isLoading}
                {...props}
            >
                {content}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
