import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

export const Button = ({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) => (
  <button type={type} className={`${buttonClass(variant)} ${className}`} {...rest}>
    {children}
  </button>
)

const buttonClass = (variant: ButtonVariant) => {
  const base =
    'rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60'
  if (variant === 'primary') return `${base} bg-button text-white hover:opacity-90`
  return `${base} border-primary text-primary hover:bg-primary/5 border bg-transparent`
}
