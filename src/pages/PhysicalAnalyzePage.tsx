import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components';
import { MOCK_DATA, PHYSICAL_DETAIL_MOCK } from '../data/mockData';

const PhysicalAnalyzePage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

    // Kas grupları ve durumları
    const muscleStatus = {
        leftBicep: { name: 'Sol Biceps', status: 'critical', change: -15, color: '#ef4444' },
        rightBicep: { name: 'Sağ Biceps', status: 'warning', change: -8, color: '#f59e0b' },
        leftQuad: { name: 'Sol Quadriceps', status: 'critical', change: -12, color: '#ef4444' },
        rightQuad: { name: 'Sağ Quadriceps', status: 'normal', change: +5, color: '#22c55e' },
        core: { name: 'Core (Karın)', status: 'warning', change: -6, color: '#f59e0b' },
        leftShoulder: { name: 'Sol Omuz', status: 'normal', change: +2, color: '#22c55e' },
        rightShoulder: { name: 'Sağ Omuz', status: 'critical', change: -10, color: '#ef4444' },
    };

    const AsymmetryVisual3D: React.FC = () => {
        const customStyles = `
            @keyframes rotate3D {
                0% { transform: perspective(1000px) rotateY(0deg); }
                100% { transform: perspective(1000px) rotateY(360deg); }
            }
            @keyframes pulse-critical {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            @keyframes pulse-warning {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 0.4; }
            }
            .model-3d {
                animation: rotate3D 20s linear infinite;
                transform-style: preserve-3d;
            }
            .model-3d:hover {
                animation-play-state: paused;
            }
            .muscle-critical {
                animation: pulse-critical 1.5s ease-in-out infinite;
            }
            .muscle-warning {
                animation: pulse-warning 2s ease-in-out infinite;
            }
        `;

        return (
            <div className="relative p-6 bg-gray-900 rounded-xl border border-red-500/50 h-full flex flex-col">
                <style>{customStyles}</style>
                
                <h4 className="text-xl text-red-400 font-bold mb-4 text-center">
                    ASYMMETRIC MUSCLE LOSS DETECTED
                </h4>
                
                <div className="flex-1 flex items-center justify-center relative">
                    <svg viewBox="0 0 200 400" className="w-full h-full model-3d">
                        {/* Baş */}
                        <ellipse cx="100" cy="40" rx="25" ry="30" fill="#718096" stroke="#4a5568" strokeWidth="2"/>
                        
                        {/* Boyun */}
                        <rect x="90" y="65" width="20" height="20" fill="#718096" stroke="#4a5568" strokeWidth="2"/>
                        
                        {/* Gövde */}
                        <rect x="70" y="85" width="60" height="80" fill="#718096" stroke="#4a5568" strokeWidth="2" rx="5"/>
                        
                        {/* Sol Omuz - CRITICAL */}
                        <circle 
                            cx="60" cy="95" r="15" 
                            fill={muscleStatus.leftShoulder.color} 
                            stroke="#1f2937" 
                            strokeWidth="2"
                            className={muscleStatus.leftShoulder.status === 'critical' ? 'muscle-critical cursor-pointer' : 'cursor-pointer'}
                            onClick={() => setSelectedMuscle('leftShoulder')}
                            style={{ filter: 'drop-shadow(0 0 8px ' + muscleStatus.leftShoulder.color + ')' }}
                        />
                        
                        {/* Sağ Omuz - CRITICAL */}
                        <circle 
                            cx="140" cy="95" r="15" 
                            fill={muscleStatus.rightShoulder.color}
                            stroke="#1f2937" 
                            strokeWidth="2"
                            className={muscleStatus.rightShoulder.status === 'critical' ? 'muscle-critical cursor-pointer' : 'cursor-pointer'}
                            onClick={() => setSelectedMuscle('rightShoulder')}
                            style={{ filter: 'drop-shadow(0 0 8px ' + muscleStatus.rightShoulder.color + ')' }}
                        />
                        
                        {/* Sol Kol - CRITICAL */}
                        <rect 
                            x="35" y="110" width="15" height="60" 
                            fill={muscleStatus.leftBicep.color}
                            stroke="#1f2937" 
                            strokeWidth="2"
                            rx="7"
                            className="muscle-critical cursor-pointer"
                            onClick={() => setSelectedMuscle('leftBicep')}
                            style={{ filter: 'drop-shadow(0 0 8px ' + muscleStatus.leftBicep.color + ')' }}
                        />
                        
                        {/* Sağ Kol - WARNING */}
                        <rect 
                            x="150" y="110" width="15" height="60" 
                            fill={muscleStatus.rightBicep.color}
                            stroke="#1f2937" 
                            strokeWidth="2"
                            rx="7"
                            className="muscle-warning cursor-pointer"
                            onClick={() => setSelectedMuscle('rightBicep')}
                            style={{ filter: 'drop-shadow(0 0 8px ' + muscleStatus.rightBicep.color + ')' }}
                        />
                        
                        {/* Core/Karın - WARNING */}
                        <rect 
                            x="80" y="100" width="40" height="50" 
                            fill={muscleStatus.core.color}
                            stroke="#1f2937" 
                            strokeWidth="2"
                            rx="5"
                            className="muscle-warning cursor-pointer"
                            onClick={() => setSelectedMuscle('core')}
                            style={{ filter: 'drop-shadow(0 0 6px ' + muscleStatus.core.color + ')' }}
                        />
                        
                        {/* Sol Bacak - CRITICAL */}
                        <rect 
                            x="75" y="165" width="20" height="100" 
                            fill={muscleStatus.leftQuad.color}
                            stroke="#1f2937" 
                            strokeWidth="2"
                            rx="10"
                            className="muscle-critical cursor-pointer"
                            onClick={() => setSelectedMuscle('leftQuad')}
                            style={{ filter: 'drop-shadow(0 0 8px ' + muscleStatus.leftQuad.color + ')' }}
                        />
                        
                        {/* Sağ Bacak - NORMAL */}
                        <rect 
                            x="105" y="165" width="20" height="100" 
                            fill={muscleStatus.rightQuad.color}
                            stroke="#1f2937" 
                            strokeWidth="2"
                            rx="10"
                            className="cursor-pointer"
                            onClick={() => setSelectedMuscle('rightQuad')}
                            style={{ filter: 'drop-shadow(0 0 6px ' + muscleStatus.rightQuad.color + ')' }}
                        />
                        
                        {/* Uyarı İkonları */}
                        <text x="55" y="93" fontSize="12" fill="#fff">⚠️</text>
                        <text x="135" y="93" fontSize="12" fill="#fff">⚠️</text>
                        <text x="30" y="138" fontSize="12" fill="#fff">⚠️</text>
                        <text x="70" y="200" fontSize="12" fill="#fff">⚠️</text>
                    </svg>
                </div>

                {/* Bilgi Paneli */}
                <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    {selectedMuscle ? (
                        <div>
                            <h5 className="text-lg font-bold text-white mb-2">
                                {muscleStatus[selectedMuscle as keyof typeof muscleStatus].name}
                            </h5>
                            <p className="text-sm text-gray-300 mb-1">
                                Değişim: <span className={muscleStatus[selectedMuscle as keyof typeof muscleStatus].change < 0 ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
                                    {muscleStatus[selectedMuscle as keyof typeof muscleStatus].change > 0 ? '+' : ''}{muscleStatus[selectedMuscle as keyof typeof muscleStatus].change}%
                                </span>
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                {muscleStatus[selectedMuscle as keyof typeof muscleStatus].status === 'critical' 
                                    ? '🚨 KRİTİK: Bu bölgede yüksek kas kaybı tespit edildi. Egzersiz yoğunluğunu artırın.'
                                    : muscleStatus[selectedMuscle as keyof typeof muscleStatus].status === 'warning'
                                    ? '⚠️ UYARI: Hafif kas kaybı var. Dikkat edin.'
                                    : '✅ NORMAL: Bu bölge sağlıklı gelişiyor.'}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 text-center">
                            Detaylar için bir kas grubuna tıklayın
                        </p>
                    )}
                </div>

                {/* Renk Lejantı */}
                <div className="mt-3 flex justify-around text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-gray-400">Kritik (-10%+)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-gray-400">Uyarı (-5%)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-gray-400">Normal</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-950">
            <Header name={MOCK_DATA.astronautName} day={MOCK_DATA.missionDay} showBack={true} />
            
            <main className="p-4 md:p-8 pb-16">
                <h2 className="text-3xl font-bold text-blue-400 mb-6 border-b border-gray-700 pb-2">
                    PHYSICAL MODULE DETAIL ANALYSIS
                </h2>
                
                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl mb-8">
                    <p className="text-xl font-medium text-gray-300">
                        Status Summary: <span className="text-yellow-400">{PHYSICAL_DETAIL_MOCK.currentStatus}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    
                    <div className="flex flex-col items-center bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-700 min-h-[550px]">
                        <h4 className="text-xl font-semibold text-gray-300 mb-4">Volume Scan Comparison</h4>
                        <div className="flex space-x-4">
                            <div className="text-center">
                                <img src={PHYSICAL_DETAIL_MOCK.preExercisePhotoUrl} onError={(e: React.SyntheticEvent<HTMLImageElement>) => (e.currentTarget.src = 'https://placehold.co/150x250/34D399/1F2937?text=EXERCISE+PRE')} alt="Pre Exercise" className="rounded-lg shadow-md mb-2"/>
                                <p className="text-sm text-green-400">Pre Exercise</p>
                                <p className="text-xs text-gray-400">EMG: {PHYSICAL_DETAIL_MOCK.emgBefore}</p>
                            </div>
                            <div className="text-center">
                                <img src={PHYSICAL_DETAIL_MOCK.postExercisePhotoUrl} onError={(e: React.SyntheticEvent<HTMLImageElement>) => (e.currentTarget.src = 'https://placehold.co/150x250/EF4444/1F2937?text=EXERCISE+POST')} alt="Post Exercise" className="rounded-lg shadow-md mb-2"/>
                                <p className="text-sm text-red-400">Post Exercise</p>
                                <p className="text-xs text-gray-400">EMG: {PHYSICAL_DETAIL_MOCK.emgAfter}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2 min-h-[550px]">
                        <AsymmetryVisual3D />
                    </div>
                </div>

                <div className={`p-6 rounded-xl shadow-2xl ${PHYSICAL_DETAIL_MOCK.recommendationColor} text-white font-semibold`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-start flex-1">
                            <span className="text-4xl mr-4 flex-shrink-0">⚠️</span>
                            <div className="flex-1">
                                <p className="text-xl font-bold mb-2">AI DECISION:</p>
                                <p className="text-base md:text-lg font-light leading-relaxed">
                                    {PHYSICAL_DETAIL_MOCK.recommendation}
                                </p>
                            </div>
                        </div>
                        <button 
                            className="bg-gray-900 hover:bg-gray-700 px-6 py-3 rounded-lg transition duration-200 font-bold text-lg whitespace-nowrap flex-shrink-0"
                            onClick={() => navigate('/dashboard')} 
                        >
                            Start Protocol
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default PhysicalAnalyzePage;