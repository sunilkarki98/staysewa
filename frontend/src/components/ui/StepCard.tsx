"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type StepCardProps = {
  step: number;
  title: string;
  description: string;
  icon: ReactNode;
  isLast?: boolean;
  gradient?: string;
  cardBg?: string;
  iconBg?: string;
  iconContainerClass?: string;
  customIcon?: boolean;
};

export default function StepCard({
  step,
  title,
  description,
  icon,
  isLast = false,
  gradient = "from-violet-500 to-purple-600",
  cardBg = "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
  iconBg = "from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50",
  iconContainerClass = "h-12 w-12",
  customIcon = false,
}: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut", delay: step * 0.1 }}
      className="group relative flex flex-col items-center text-center w-full"
    >
      {/* Horizontal connector line - positioned outside the card, properly centered */}
      {!isLast && (
        <div className="absolute top-1/2 left-[calc(50%+55px)] hidden w-[calc(100%-70px)] h-[2px] md:flex items-center -translate-y-1/2 z-0">
          {/* Dashed line background */}
          <div className="h-full w-full rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
            style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 6px, #d1d5db 6px, #d1d5db 12px)' }} />
          {/* Animated overlay */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 + step * 0.3 }}
            className={`absolute top-0 left-0 h-full w-full origin-left rounded-full bg-gradient-to-r ${gradient} opacity-80`}
          />
          {/* Animated dot at end */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 1.2 + step * 0.3 }}
            className={`absolute -right-1.5 w-3 h-3 rounded-full bg-gradient-to-br ${gradient} shadow-md`}
          />
        </div>
      )}

      {/* Card container with colored background */}
      <div className={`relative z-10 flex flex-col items-center rounded-2xl bg-gradient-to-br ${cardBg} border border-white/60 dark:border-gray-700/40 px-4 py-5 shadow-lg hover:shadow-xl transition-all duration-400 hover:-translate-y-1 backdrop-blur-sm min-h-[160px] w-full max-w-[240px]`}>

        {/* Step number badge - top center */}
        <motion.div
          whileHover={{ scale: 1.15 }}
          className={`absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-[10px] font-bold text-white shadow-md shadow-purple-500/30 ring-2 ring-white dark:ring-gray-900`}
        >
          {step}
        </motion.div>

        {/* Icon container with layered backgrounds */}
        <div className="relative mt-1">
          {!customIcon && (
            <>
              {/* Outer glow ring */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-20 blur-lg scale-110`} />

              {/* Soft background layer */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${iconBg}`} />
            </>
          )}

          {/* Icon wrapper */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`relative flex items-center justify-center ${!customIcon
              ? `rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md shadow-purple-500/25`
              : ''
              } ${iconContainerClass}`}
          >
            {icon}
          </motion.div>
        </div>

        {/* Content */}
        <h3 className="mt-3 text-base font-bold text-gray-800 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-300 leading-tight">
          {title}
        </h3>

        <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-snug">
          {description}
        </p>

        {/* Decorative bottom accent */}
        <div className={`mt-auto pt-3 h-1 w-8 rounded-full bg-gradient-to-r ${gradient} opacity-50 group-hover:opacity-100 group-hover:w-12 transition-all duration-400`} />
      </div>
    </motion.div>
  );
}
