import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="mb-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium text-gray-700 mb-0.5"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
      <div className="min-h-4">
        {error && (
          <p className="text-red-500 text-xs leading-none mt-0.5" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export const inputClass =
  'w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export const errorClass =
  'w-full border border-red-400 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400';
