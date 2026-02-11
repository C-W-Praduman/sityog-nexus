import React from 'react';

const Logo = ({ className = "h-8 w-auto", isScrolled = false }) => {
  const textColor = isScrolled ? "text-gray-900" : "text-white";
  const subTextColor = isScrolled ? "text-blue-600" : "text-blue-400";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Abstract "S" Shape */}
        <path
          d="M30 25C30 25 45 15 65 25C85 35 70 55 50 50C30 45 15 65 35 75C55 85 70 75 70 75"
          stroke="url(#logo-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#glow)"
        />
        {/* Central Dot representing focus/knowledge */}
        <circle cx="50" cy="50" r="5" fill="#3b82f6" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className={`text-xl font-black tracking-normal ${textColor}`}>
          SITYOG
        </span>
        <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${subTextColor}`}>
          Institutions
        </span>
      </div>
    </div>
  );
};

export default Logo;
