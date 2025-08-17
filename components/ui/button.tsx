import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 hover:shadow-pink-500/25",
        destructive:
          "bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white hover:from-red-600 hover:via-orange-600 hover:to-red-700 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 hover:shadow-red-500/25",
        outline:
          "border border-gray-200 bg-white hover:bg-gradient-to-r hover:from-pink-50 hover:via-purple-50 hover:to-blue-50 text-gray-700 hover:text-gray-900 hover:border-gradient-to-r hover:border-pink-300 hover:-translate-y-1 hover:shadow-lg hover:scale-102",
        secondary:
          "bg-white border border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 hover:border-blue-300 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-102",
        ghost: "text-gray-500 hover:text-gray-800 hover:bg-gradient-to-r hover:from-pink-100/60 hover:via-purple-100/40 hover:to-blue-100/60 hover:-translate-y-1 hover:scale-105 rounded-lg",
        link: "text-pink-600 underline-offset-4 hover:underline hover:text-pink-700 hover:bg-gradient-to-r hover:from-pink-100/40 hover:via-purple-100/30 hover:to-blue-100/40 hover:-translate-y-1 hover:scale-105 rounded-md px-3 py-2",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
