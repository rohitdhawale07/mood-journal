"use client"

import type React from "react"

/**
 * Action Button Component
 *
 * A reusable button component with animations and styling
 * for primary actions throughout the application.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

import { motion } from "framer-motion"
import type { ButtonHTMLAttributes } from "react"

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline"
}

/**
 * Enhanced button component with animations and styling
 */
const ActionButton: React.FC<ActionButtonProps> = ({ children, className = "", variant = "primary", ...props }) => {
  // Base styles for all buttons
  const baseStyles =
    "py-3 px-4 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"

  // Variant-specific styles
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-orange-400 to-rose-400 text-white hover:from-orange-500 hover:to-rose-500 focus:ring-orange-400",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700",
  }

  // Combine styles
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${className}`

  return (
    <motion.button className={buttonStyles} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} {...props}>
      {children}
    </motion.button>
  )
}

export default ActionButton
