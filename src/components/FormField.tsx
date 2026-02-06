import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}

export default function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="form-group">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}
