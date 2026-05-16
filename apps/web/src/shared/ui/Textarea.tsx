import type { TextareaHTMLAttributes } from 'react'

export const Textarea = ({
  className = '',
  rows = 3,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea rows={rows} className={`${textareaClass} ${className}`} {...rest} />
)

const textareaClass =
  'border-border bg-surface text-text focus:ring-primary w-full resize-none rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none aria-invalid:border-red-500'
