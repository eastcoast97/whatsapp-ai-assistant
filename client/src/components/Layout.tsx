import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
  {
    'path': '/',
    'label': 'Stores',
    'icon': '📍'
  },
  {
    'path': '/whats-apps',
    'label': 'WhatsApps',
    'icon': '📄'
  }
];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top Navigation - Command Center Style */}
      <header className="bg-[#12121a] border-b border-[#2a2a3e] fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-[#fafafa]">Whatsapp Ai Assistant</h1>
            {/* Horizontal Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path 
                      ? 'bg-[#6366f1] text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                      : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1a1a2e]'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-sm font-medium">
              U
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center space-x-1 px-4 pb-3 overflow-x-auto">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                location.pathname === item.path 
                  ? 'bg-[#6366f1] text-white' 
                  : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1a1a2e]'
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main content - Full width, no sidebar */}
      <main className="pt-16 md:pt-14">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
