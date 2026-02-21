
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.25"/>
        </filter>
      </defs>
      
      {/* Background Shape (White Part - Top/Right) */}
      <path 
        d="M100 20 
           L165 85 
           C175 95 175 110 165 120 
           L135 150 
           L100 115 
           L130 85 
           C135 80 135 75 130 70 
           L100 40 
           L70 70 
           L95 95" 
        fill="#F3F4F6" 
        stroke="#111827" 
        strokeWidth="6" 
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Foreground Shape (Green Part - Bottom/Left) */}
      <path 
        d="M100 180 
           L35 115 
           C25 105 25 90 35 80 
           L65 50 
           L100 85 
           L70 115 
           C65 120 65 125 70 130 
           L100 160 
           L130 130 
           L105 105" 
        fill="#10B981" 
        stroke="#111827" 
        strokeWidth="6" 
        strokeLinejoin="round" 
        strokeLinecap="round"
      />
      
      {/* Center Interlock Fix */}
      <path 
        d="M95 95 L70 70" 
        stroke="#111827" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;
