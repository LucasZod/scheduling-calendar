import type { InputHTMLAttributes } from 'react'

export const Input = ({
  className = '',
  type = 'text',
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input type={type} className={`${inputClass} ${className}`} {...rest} />
)

const inputClass =
  'border-border bg-surface text-text focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none aria-invalid:border-red-500'
