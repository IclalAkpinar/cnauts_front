import React, { useState } from 'react';

export const MentalVisual: React.FC = () => {
    const [scanPosition, setScanPosition] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setScanPosition({ x, y });
    };

    return (
        <div 
            className="flex flex-col items-center justify-center p-6 h-full bg-gray-800 rounded-xl shadow-xl border border-red-500/30 relative" 
            onMouseMove={handleMouseMove}
        >
            <h4 className="text-red-300 font-bold mb-4">🧠 Neural Scan Area (Interactive)</h4>
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M 20 40 Q 50 10 80 40 C 90 60 80 90 50 85 C 20 90 10 60 20 40 Z" fill="rgba(31, 41, 55, 0.8)" stroke="#f87171" strokeWidth="1"/>
                <circle cx={scanPosition.x} cy={scanPosition.y} r="4" fill="#ef4444" opacity="0.8" className="transition-all duration-100 ease-out" style={{ filter: 'blur(1px)' }}/>
                <circle cx="65" cy="45" r="3" fill="#facc15" opacity="0.9" className="animate-pulse" />
            </svg>
            <p className="mt-2 text-xs text-gray-400">High stress concentrated in the right temporal lobe. (Movable)</p>
        </div>
    );
};