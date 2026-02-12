import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Card({ children, title, className = '' }: CardProps) {
  return (
    <div className={`bg-[#12121a] rounded-lg border border-[#2a2a3e] shadow-lg ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-[#2a2a3e]">
          <h3 className="text-lg font-semibold text-[#fafafa]">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
