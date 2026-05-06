import React from "react";

export function BuildingsIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Building 1 - Left */}
      <rect x="15" y="50" width="25" height="50" stroke="#E0E0E0" strokeWidth="2" fill="none" />
      <rect x="20" y="60" width="4" height="4" fill="#E0E0E0" />
      <rect x="28" y="60" width="4" height="4" fill="#E0E0E0" />
      <rect x="20" y="70" width="4" height="4" fill="#E0E0E0" />
      <rect x="28" y="70" width="4" height="4" fill="#E0E0E0" />
      <rect x="20" y="80" width="4" height="4" fill="#E0E0E0" />
      <rect x="28" y="80" width="4" height="4" fill="#E0E0E0" />
      <rect x="20" y="90" width="4" height="6" fill="#E0E0E0" />
      
      {/* Building 2 - Center */}
      <rect x="48" y="30" width="32" height="70" stroke="#BDBDBD" strokeWidth="2" fill="none" />
      <rect x="54" y="40" width="5" height="5" fill="#BDBDBD" />
      <rect x="65" y="40" width="5" height="5" fill="#BDBDBD" />
      <rect x="54" y="50" width="5" height="5" fill="#BDBDBD" />
      <rect x="65" y="50" width="5" height="5" fill="#BDBDBD" />
      <rect x="54" y="60" width="5" height="5" fill="#BDBDBD" />
      <rect x="65" y="60" width="5" height="5" fill="#BDBDBD" />
      <rect x="54" y="70" width="5" height="5" fill="#BDBDBD" />
      <rect x="65" y="70" width="5" height="5" fill="#BDBDBD" />
      <rect x="54" y="80" width="5" height="5" fill="#BDBDBD" />
      <rect x="65" y="80" width="5" height="5" fill="#BDBDBD" />
      <rect x="59" y="90" width="8" height="10" fill="#BDBDBD" />
      
      {/* Building 3 - Right */}
      <rect x="88" y="45" width="22" height="55" stroke="#E0E0E0" strokeWidth="2" fill="none" />
      <rect x="93" y="55" width="4" height="4" fill="#E0E0E0" />
      <rect x="100" y="55" width="4" height="4" fill="#E0E0E0" />
      <rect x="93" y="65" width="4" height="4" fill="#E0E0E0" />
      <rect x="100" y="65" width="4" height="4" fill="#E0E0E0" />
      <rect x="93" y="75" width="4" height="4" fill="#E0E0E0" />
      <rect x="100" y="75" width="4" height="4" fill="#E0E0E0" />
      <rect x="93" y="85" width="4" height="4" fill="#E0E0E0" />
      <rect x="100" y="85" width="4" height="4" fill="#E0E0E0" />
      
      {/* Ground line */}
      <line x1="10" y1="100" x2="115" y2="100" stroke="#E0E0E0" strokeWidth="2" />
    </svg>
  );
}

export function ChartFlatLineIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Axes */}
      <line x1="20" y1="20" x2="20" y2="90" stroke="#E0E0E0" strokeWidth="2" />
      <line x1="20" y1="90" x2="100" y2="90" stroke="#E0E0E0" strokeWidth="2" />
      
      {/* Grid lines */}
      <line x1="20" y1="70" x2="100" y2="70" stroke="#F5F5F5" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="20" y1="50" x2="100" y2="50" stroke="#F5F5F5" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="20" y1="30" x2="100" y2="30" stroke="#F5F5F5" strokeWidth="1" strokeDasharray="4 4" />
      
      {/* Flat line */}
      <line x1="20" y1="70" x2="100" y2="70" stroke="#BDBDBD" strokeWidth="2" />
      
      {/* Data points */}
      <circle cx="30" cy="70" r="3" fill="#BDBDBD" />
      <circle cx="45" cy="70" r="3" fill="#BDBDBD" />
      <circle cx="60" cy="70" r="3" fill="#BDBDBD" />
      <circle cx="75" cy="70" r="3" fill="#BDBDBD" />
      <circle cx="90" cy="70" r="3" fill="#BDBDBD" />
      
      {/* Axis labels indicators */}
      <line x1="18" y1="30" x2="20" y2="30" stroke="#9E9E9E" strokeWidth="1" />
      <line x1="18" y1="50" x2="20" y2="50" stroke="#9E9E9E" strokeWidth="1" />
      <line x1="18" y1="70" x2="20" y2="70" stroke="#9E9E9E" strokeWidth="1" />
      <line x1="18" y1="90" x2="20" y2="90" stroke="#9E9E9E" strokeWidth="1" />
      
      <line x1="30" y1="90" x2="30" y2="92" stroke="#9E9E9E" strokeWidth="1" />
      <line x1="60" y1="90" x2="60" y2="92" stroke="#9E9E9E" strokeWidth="1" />
      <line x1="90" y1="90" x2="90" y2="92" stroke="#9E9E9E" strokeWidth="1" />
    </svg>
  );
}

export function BrokenChainIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left chain link */}
      <rect x="20" y="45" width="25" height="30" rx="12" stroke="#E0E0E0" strokeWidth="3" fill="none" />
      <rect x="25" y="50" width="15" height="20" rx="7" fill="#F5F5F5" />
      
      {/* Right chain link */}
      <rect x="75" y="45" width="25" height="30" rx="12" stroke="#E0E0E0" strokeWidth="3" fill="none" />
      <rect x="80" y="50" width="15" height="20" rx="7" fill="#F5F5F5" />
      
      {/* Break marks in center */}
      <line x1="50" y1="55" x2="56" y2="52" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="60" x2="57" y2="60" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="65" x2="56" y2="68" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
      
      <line x1="64" y1="52" x2="70" y2="55" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
      <line x1="63" y1="60" x2="70" y2="60" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
      <line x1="64" y1="68" x2="70" y2="65" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
      
      {/* Warning indicator */}
      <circle cx="60" cy="35" r="12" fill="#FFF3E0" stroke="#FF6F00" strokeWidth="2" />
      <path d="M60 29 L60 35" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="39" r="1.5" fill="#FF6F00" />
    </svg>
  );
}

export function LostCompassIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Compass circle */}
      <circle cx="60" cy="60" r="35" stroke="#E0E0E0" strokeWidth="2" fill="none" />
      <circle cx="60" cy="60" r="30" stroke="#F5F5F5" strokeWidth="1" fill="none" />
      
      {/* Cardinal points */}
      <line x1="60" y1="25" x2="60" y2="32" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="88" x2="60" y2="95" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="60" x2="32" y2="60" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
      <line x1="88" y1="60" x2="95" y2="60" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
      
      {/* Compass needle - pointing random direction to show "lost" */}
      <path d="M60 60 L68 45 L60 50 L52 45 Z" fill="#C62828" opacity="0.6" />
      <path d="M60 60 L68 75 L60 70 L52 75 Z" fill="#BDBDBD" opacity="0.4" />
      
      {/* Center dot */}
      <circle cx="60" cy="60" r="3" fill="#616161" />
      
      {/* Question marks around compass */}
      <text x="45" y="25" fontSize="16" fill="#E0E0E0" fontWeight="bold">?</text>
      <text x="80" y="100" fontSize="16" fill="#E0E0E0" fontWeight="bold">?</text>
      <text x="15" y="70" fontSize="16" fill="#E0E0E0" fontWeight="bold">?</text>
    </svg>
  );
}
