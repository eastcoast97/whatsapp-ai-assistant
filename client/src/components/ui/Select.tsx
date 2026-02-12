import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#e2e8f0] mb-1">
          {label}
          {props.required && <span className="text-[#ef4444] ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full px-3 py-2 border rounded-lg bg-[#12121a] text-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#6366f1] ${error ? 'border-[#ef4444]' : 'border-[#2a2a3e]'} ${props.disabled ? 'bg-[#0a0a0f] cursor-not-allowed opacity-50' : ''} ${className}`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-[#ef4444]">{error}</p>}
    </div>
  );
}
