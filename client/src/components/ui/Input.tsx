import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#e2e8f0] mb-1">
          {label}
          {props.required && <span className="text-[#ef4444] ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-lg bg-[#12121a] text-[#e2e8f0] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1] ${error ? 'border-[#ef4444]' : 'border-[#2a2a3e]'} ${props.disabled ? 'bg-[#0a0a0f] cursor-not-allowed opacity-50' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-[#ef4444]">{error}</p>}
    </div>
  );
}
