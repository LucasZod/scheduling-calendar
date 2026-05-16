import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type IconButtonVariant = 'nav' | 'muted'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  children: ReactNode
}

export const IconButton = ({
  variant = 'muted',
  className = '',
  type = 'button',
  children,
  ...rest
}: IconButtonProps) => (
  <button type={type} className={`${iconButtonClass(variant)} ${className}`} {...rest}>
    {children}
  </button>
)

const iconButtonClass = (variant: IconButtonVariant) => {
  const base =
    'inline-flex items-center justify-center rounded transition-colors disabled:cursor-not-allowed disabled:opacity-60'
  if (variant === 'nav') return `${base} text-white hover:opacity-80`
  return `${base} text-text-muted hover:text-text`
}
