import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative",
  {
    variants: {
      variant: {
        default: "bg-cryptic-accent text-black hover:bg-cryptic-accent/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-white/20 bg-cryptic-card hover:bg-cryptic-block hover:text-accent-foreground",
        secondary: "bg-cryptic-block text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-cryptic-accent underline-offset-4 hover:underline",
        github: "bg-white text-black hover:bg-[#2a2a2d] hover:text-white",
        google: "bg-white text-black hover:bg-[#2a2a2d] hover:text-white",
        auth: "border border-white/20 bg-cryptic-card hover:bg-[#2a2a2d]",
        dropdownTrigger: "hover:bg-transparent",
      },
      size: {
        default: "h-[52px] px-6",
        sm: "h-10 rounded-lg px-3",
        lg: "h-[52px] px-8",
        icon: "h-10 w-10",
        header: "h-[48px] px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
