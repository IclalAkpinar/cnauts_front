import React from 'react';

export const PhysicalVisual: React.FC = () => {
    const customStyles = `
        @keyframes rotateY { 0% { transform: perspective(800px) rotateY(-5deg) scale(0.9); } 50% { transform: perspective(800px) rotateY(5deg) scale(0.95); } 100% { transform: perspective(800px) rotateY(-5deg) scale(0.9); } }
        @keyframes scanGlow { 0%, 100% { box-shadow: 0 0 10px #06b6d4, 0 0 5px #06b6d4 inset; } 50% { box-shadow: 0 0 20px #22c55e, 0 0 10px #22c55e inset; } }
        .skeleton-container { animation: rotateY 15s ease-in-out infinite alternate; transform-style: preserve-3d; }
        .keypoint { animation: scanGlow 3s ease-in-out infinite; }
    `;

    return (
        <div className="flex flex-col p-4 h-full bg-gray-800 rounded-xl shadow-xl border border-blue-500/30 relative overflow-hidden">
            <style>{customStyles}</style>
            
            <div className="flex justify-between items-center text-xs font-mono text-cyan-400 border-b border-cyan-700/50 pb-1 mb-2">
                <span>[LIVE] Biometric Skeleton Model</span>
                <span>STATUS: Low Activity Alert</span>
            </div>

            <div className="flex-grow flex items-center justify-center relative">
                <div className="w-2/3 h-5/6 relative skeleton-container">
                    <svg viewBox="0 0 100 150" className="w-full h-full">
                        <line x1="50" y1="20" x2="50" y2="60" stroke="#a0aec0" strokeWidth="3" />
                        <line x1="50" y1="60" x2="40" y2="110" stroke="#a0aec0" strokeWidth="3" />
                        <line x1="50" y1="60" x2="60" y2="110" stroke="#a0aec0" strokeWidth="3" />
                        <line x1="50" y1="30" x2="35" y2="50" stroke="#a0aec0" strokeWidth="2" />
                        <line x1="50" y1="30" x2="65" y2="50" stroke="#a0aec0" strokeWidth="2" />
                        <circle cx="50" cy="15" r="10" fill="#a0aec0" />
                        <circle cx="40" cy="110" r="4" fill="#06b6d4" className="keypoint" />
                        <circle cx="60" cy="110" r="4" fill="#22c55e" className="keypoint" />
                        <circle cx="50" cy="60" r="5" fill="#facc15" className="keypoint" />

                        <text x="50" y="145" fill="#facc15" fontSize="5" textAnchor="middle">Kinetic Anomaly Detected</text>
                    </svg>
                </div>
            </div>
            
            <button className="mt-4 bg-cyan-700 hover:bg-cyan-600 px-3 py-1 rounded-md text-sm text-white transition">
                Send Detailed Analysis Request
            </button>
        </div>
    );
};