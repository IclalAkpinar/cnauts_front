import React, { useState, useEffect, useCallback, useMemo } from 'react';

// =========================================================================
// TypeScript Interfaces for Type Safety
// =========================================================================

interface RegionAnalysisItem {
    pre_temp: number;
    post_temp: number;
    temp_increase: number;
    status: 'normal' | 'overworked' | 'low_work';
}

interface RegionAnalysis {
    left_arm: RegionAnalysisItem;
    right_arm: RegionAnalysisItem;
    left_leg: RegionAnalysisItem;
    right_leg: RegionAnalysisItem;
    chest: RegionAnalysisItem;
    back: RegionAnalysisItem;
    core: RegionAnalysisItem;
    [key: string]: RegionAnalysisItem; 
}

interface MuscleStatusItem {
    name: string;
    status: 'critical' | 'warning' | 'normal';
    change: string;
    color: string;
}

interface MuscleStatusMap {
    leftQuad: MuscleStatusItem;
    rightQuad: MuscleStatusItem;
    leftBicep: MuscleStatusItem;
    rightBicep: MuscleStatusItem;
    core: MuscleStatusItem;
    leftShoulder: MuscleStatusItem;
    rightShoulder: MuscleStatusItem;
    [key: string]: MuscleStatusItem; 
}

const API_BASE_URL = 'http://localhost:5617'; 
const API_URL = `${API_BASE_URL}/fatigue-analysis`;
const MOCK_USER_ID = 'astronaut_mars_001';

// Mock API Response - Past Data
const MOCK_API_RESPONSE = {
    overall_fatigue: {
        fatigue_score: 82, 
        category: 'CRITICAL (Immediate Rest Required)',
    },
    emg_analysis: {
        median_frequency_change: -18.5, 
        rms_change: -6.2,
        muscle_groups: {
            quadriceps: { fatigue: 85, status: 'yüksek' },
            hamstrings: { fatigue: 78, status: 'yüksek' }
        }
    },
    thermal_analysis: {
        average_temp_increase: 2.8,
        region_analysis: {
            left_arm: { pre_temp: 32.3, post_temp: 33.1, temp_increase: 0.8, status: 'normal' },
            right_arm: { pre_temp: 32.5, post_temp: 33.4, temp_increase: 0.9, status: 'normal' },
            left_leg: { pre_temp: 31.8, post_temp: 35.2, temp_increase: 3.4, status: 'overworked' },
            right_leg: { pre_temp: 31.9, post_temp: 35.5, temp_increase: 3.6, status: 'overworked' },
            core: { pre_temp: 36.5, post_temp: 37.0, temp_increase: 0.5, status: 'low_work' },
            chest: { pre_temp: 33.1, post_temp: 34.8, temp_increase: 1.7, status: 'normal' },
            back: { pre_temp: 32.9, post_temp: 33.5, temp_increase: 0.6, status: 'low_work' }
        },
    },
    exercise_recommendation: {
        recommendation: '🚨 KRİTİK ALARM! Ana itici kaslarınız (Quadriceps) aşırı yüklenmiştir, bu durum yüksek termal strese ve EMG yorgunluğuna işaret etmektedir. Core bölgesi düşük aktivite göstermiştir. Protokol: 48 saat yerçekimi simülasyonu dinlenmesi ve ardından izometrik Core güçlendirme egzersizlerine geçiş.',
    }
};

// =========================================================================
// Helper Functions - EMG Verilerinden Kas Durumu Oluşturma
// =========================================================================

/**
 * EMG analizinden kas durumunu oluşturur (thermal_analysis null olduğunda)
 */
const mapEMGToMuscleStatus = (emgAnalysis: any): MuscleStatusMap => {
    const quadStatus = emgAnalysis?.muscle_groups?.quadriceps?.status || 'normal';
    const hamStatus = emgAnalysis?.muscle_groups?.hamstrings?.status || 'normal';
    const quadFatigue = emgAnalysis?.muscle_groups?.quadriceps?.fatigue || 0;
    const hamFatigue = emgAnalysis?.muscle_groups?.hamstrings?.fatigue || 0;

    const getStatusAndColor = (status: string, fatigue: number) => {
        if (status === 'yüksek' || fatigue > 70) {
            return { status: 'critical' as const, color: '#ef4444' };
        } else if (status === 'orta' || fatigue > 40) {
            return { status: 'warning' as const, color: '#f59e0b' };
        }
        return { status: 'normal' as const, color: '#22c55e' };
    };

    const quadResult = getStatusAndColor(quadStatus, quadFatigue);
    const hamResult = getStatusAndColor(hamStatus, hamFatigue);

    return {
        leftQuad: {
            name: 'Sol Quadriceps',
            status: quadResult.status,
            change: quadFatigue.toFixed(1),
            color: quadResult.color
        },
        rightQuad: {
            name: 'Sağ Quadriceps',
            status: quadResult.status,
            change: quadFatigue.toFixed(1),
            color: quadResult.color
        },
        leftBicep: {
            name: 'Sol Biceps',
            status: 'normal',
            change: '0.0',
            color: '#22c55e'
        },
        rightBicep: {
            name: 'Sağ Biceps',
            status: 'normal',
            change: '0.0',
            color: '#22c55e'
        },
        core: {
            name: 'Core (Karın)',
            status: hamResult.status,
            change: hamFatigue.toFixed(1),
            color: hamResult.color
        },
        leftShoulder: {
            name: 'Sol Omuz',
            status: 'normal',
            change: '0.0',
            color: '#22c55e'
        },
        rightShoulder: {
            name: 'Sağ Omuz',
            status: 'normal',
            change: '0.0',
            color: '#22c55e'
        }
    };
};

/**
 * Termal analiz sonuçlarını UI'daki kas grubuna eşler
 */
const mapApiToMuscleStatus = (analysis: RegionAnalysis): MuscleStatusMap => {
    const uiStatus: MuscleStatusMap = {} as MuscleStatusMap;

    const mapping: { [key: string]: keyof MuscleStatusMap } = {
        left_leg: 'leftQuad',
        right_leg: 'rightQuad',
        left_arm: 'leftBicep',
        right_arm: 'rightBicep',
        core: 'core',
    };

    for (const [apiRegion, uiKey] of Object.entries(mapping)) {
        const data = analysis[apiRegion];
        const tempIncreaseRatio = (data?.temp_increase || 0) * 100 / 30;

        let status: MuscleStatusItem['status'];
        let color;
        
        if (data?.status === 'overworked' || data?.temp_increase >= 3.0) {
            status = 'critical';
            color = '#ef4444';
        } else if (data?.status === 'low_work' || data?.temp_increase <= 1.0) {
            status = 'warning';
            color = '#f59e0b';
        } else {
            status = 'normal';
            color = '#22c55e';
        }

        const friendlyName = (uiKey as string)
            .replace(/([A-Z])/g, ' $1').trim()
            .replace('Quad', 'Quadriceps')
            .replace('Bicep', 'Biceps')
            .replace('core', 'Core (Karın)')
            .replace('left', 'Sol')
            .replace('right', 'Sağ');

        uiStatus[uiKey] = {
            name: friendlyName,
            status: status,
            change: tempIncreaseRatio.toFixed(1), 
            color: color,
        };
    }
    
    uiStatus.leftShoulder = { ...uiStatus.leftBicep, name: 'Sol Omuz' };
    uiStatus.rightShoulder = { ...uiStatus.rightBicep, name: 'Sağ Omuz' };

    return uiStatus;
};

// =========================================================================
// Components
// =========================================================================

const SimpleHeader = ({ name, day }: { name: string, day: number }) => (
    <header className="bg-gray-800 p-4 shadow-lg flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-blue-400">PHYSICAL ANALYSIS SYSTEM</h1>
        <div className="text-right text-sm">
            <p className="text-gray-200 font-semibold">Astronaut ID: {name}</p>
            <p className="text-gray-400">Mission Duration: {day} minutes</p>
        </div>
    </header>
);

const LoadingIndicator = () => (
    <div className="flex items-center justify-center p-12 bg-gray-800 rounded-xl shadow-inner min-h-[550px]">
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-blue-500"></div>
            <p className="mt-4 text-xl text-blue-400 font-semibold">Analyzing Sensor Data... (AI Processing)</p>
            <p className="mt-2 text-sm text-gray-400">Processing EMG and thermal data...</p>
        </div>
    </div>
);

const AsymmetryVisual3D = ({ muscleStatus, selectedMuscle, setSelectedMuscle }: { 
    muscleStatus: MuscleStatusMap | {}, 
    selectedMuscle: string | null, 
    setSelectedMuscle: (key: string) => void 
}) => {
    const hasData = muscleStatus && Object.keys(muscleStatus).length > 0;

    if (!hasData) {
        return (
            <div className="relative p-6 bg-gray-900 rounded-xl border border-red-500/50 h-full flex items-center justify-center">
                <p className="text-xl text-red-400">Muscle Data Not Available</p>
            </div>
        );
    }
    
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

    const getMuscleClass = (status: MuscleStatusItem['status']) => {
        if (status === 'critical') return 'muscle-critical';
        if (status === 'warning') return 'muscle-warning';
        return '';
    };

    const selectedMuscleKey = selectedMuscle as keyof MuscleStatusMap;
    const muscleDetail = selectedMuscleKey ? (muscleStatus as MuscleStatusMap)[selectedMuscleKey] : null;

    return (
        <div className="relative p-6 bg-gray-900 rounded-xl border border-blue-500/50 h-full flex flex-col min-h-[550px]">
            <style>{customStyles}</style>
            
            <h4 className="text-xl text-blue-400 font-bold mb-4 text-center">
                MUSCLE FATIGUE VISUALIZATION (EMG Analysis)
            </h4>
            
            <div className="flex-1 flex items-center justify-center relative">
                <svg viewBox="0 0 200 400" className="w-full h-full max-h-[300px] model-3d">
                    <ellipse cx="100" cy="40" rx="25" ry="30" fill="#718096" stroke="#4a5568" strokeWidth="2"/>
                    <rect x="90" y="65" width="20" height="20" fill="#718096" stroke="#4a5568" strokeWidth="2"/>
                    <rect x="70" y="85" width="60" height="80" fill="#718096" stroke="#4a5568" strokeWidth="2" rx="5"/>
                    
                    {Object.entries(muscleStatus as MuscleStatusMap).map(([key, data]) => {
                        let position = {};
                        let shape = 'rect';
                        let size = { width: 15, height: 60 };

                        switch (key) {
                            case 'leftShoulder': position = { cx: 60, cy: 95, r: 15, type: 'circle' }; shape='circle'; break;
                            case 'rightShoulder': position = { cx: 140, cy: 95, r: 15, type: 'circle' }; shape='circle'; break;
                            case 'leftBicep': position = { x: 35, y: 110, width: 15, height: 60, rx: 7 }; break;
                            case 'rightBicep': position = { x: 150, y: 110, width: 15, height: 60, rx: 7 }; break;
                            case 'core': position = { x: 80, y: 100, width: 40, height: 50, rx: 5 }; size = {width: 40, height: 50}; break;
                            case 'leftQuad': position = { x: 75, y: 165, width: 20, height: 100, rx: 10 }; size = {width: 20, height: 100}; break;
                            case 'rightQuad': position = { x: 105, y: 165, width: 20, height: 100, rx: 10 }; size = {width: 20, height: 100}; break;
                            default: return null;
                        }

                        const elementProps = {
                            key: key,
                            fill: data.color,
                            stroke: '#1f2937',
                            strokeWidth: '2',
                            className: `${getMuscleClass(data.status)} cursor-pointer transition-all duration-300 ${selectedMuscleKey === key ? 'scale-110 shadow-lg ring-4 ring-offset-2 ring-offset-gray-900 ring-white' : ''}`,
                            onClick: () => setSelectedMuscle(key),
                            style: { filter: `drop-shadow(0 0 8px ${data.color})` }
                        };
                        
                        const warningIcon = (data.status === 'critical' || data.status === 'warning') && (
                            <text 
                                key={`icon-${key}`} 
                                x={shape === 'circle' ? (position as any).cx - 5 : (position as any).x + (size.width / 2) - 5} 
                                y={shape === 'circle' ? (position as any).cy + 5 : (position as any).y + (size.height / 2) + 5} 
                                fontSize="12" 
                                fill="#fff" 
                                className="pointer-events-none"
                            >
                                {data.status === 'critical' ? '🚨' : '⚠️'}
                            </text>
                        );

                        return (
                            <React.Fragment key={key}>
                                {shape === 'circle' ? (
                                    <circle {...position as any} {...elementProps} />
                                ) : (
                                    <rect {...position as any} {...elementProps} />
                                )}
                                {warningIcon}
                            </React.Fragment>
                        );
                    })}
                </svg>
            </div>

            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                {muscleDetail ? (
                    <div>
                        <h5 className="text-lg font-bold text-white mb-2">
                            {muscleDetail.name}
                        </h5>
                        <p className="text-sm text-gray-300 mb-1">
                            Yorgunluk Seviyesi: 
                            <span className={parseFloat(muscleDetail.change) > 50 ? 'text-red-400 font-bold' : parseFloat(muscleDetail.change) > 20 ? 'text-yellow-400 font-bold' : 'text-green-400 font-bold'}>
                                {' '}{muscleDetail.change}%
                            </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            {muscleDetail.status === 'critical' 
                                ? '🚨 KRİTİK: Yüksek yorgunluk seviyesi. Derhal dinlenme gerekli.'
                                : muscleDetail.status === 'warning'
                                ? '⚠️ UYARI: Orta düzey yorgunluk. Dikkatli olunmalı.'
                                : '✅ NORMAL: Yorgunluk seviyesi düşük, devam edilebilir.'}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 text-center">
                        Detaylar için bir kas grubuna tıklayın
                    </p>
                )}
            </div>

            <div className="mt-3 flex justify-around text-xs flex-wrap gap-2">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-400">Kritik (Yüksek Yorgunluk)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-gray-400">Uyarı (Orta Yorgunluk)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-400">Normal (Düşük Yorgunluk)</span>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// Main Component
// =========================================================================

const PhysicalAnalyzePage = () => {
    const [muscleStatus, setMuscleStatus] = useState<MuscleStatusMap | {}>({}); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [showPastData, setShowPastData] = useState(true); // Past data kontrolü

    // Component yüklendiğinde mock veriyi göster
    useEffect(() => {
        if (showPastData && !analysisResult) {
            setAnalysisResult(MOCK_API_RESPONSE);
        }
    }, [showPastData]);

    useEffect(() => {
        if (!analysisResult) return;

        // Önce thermal analysis'e bak
        if (analysisResult.thermal_analysis?.region_analysis) {
            const regionAnalysis: RegionAnalysis = analysisResult.thermal_analysis.region_analysis;
            const newMuscleStatus = mapApiToMuscleStatus(regionAnalysis);
            setMuscleStatus(newMuscleStatus);
        } 
        // Thermal yoksa EMG'den oluştur
        else if (analysisResult.emg_analysis) {
            const newMuscleStatus = mapEMGToMuscleStatus(analysisResult.emg_analysis);
            setMuscleStatus(newMuscleStatus);
        } 
        else {
            setMuscleStatus({});
        }

        // İlk kritik veya uyarılı kasıselect
        const criticalKey = Object.keys(muscleStatus).find(
            key => (muscleStatus as MuscleStatusMap)[key]?.status === 'critical'
        );
        const warningKey = Object.keys(muscleStatus).find(
            key => (muscleStatus as MuscleStatusMap)[key]?.status === 'warning'
        );
        setSelectedMuscle(criticalKey || warningKey || Object.keys(muscleStatus)[0] || null);
    }, [analysisResult]);

    const overallStatus = useMemo(() => analysisResult?.overall_fatigue?.category || 'Analyzing...', [analysisResult]);
    const recommendationText = useMemo(() => 
        analysisResult?.overall_fatigue?.recommendation || 
        analysisResult?.exercise_recommendation?.recommendation || 
        'AI recommendation pending...', 
    [analysisResult]);
    const overallFatigueScore = useMemo(() => analysisResult?.overall_fatigue?.fatigue_score || 0, [analysisResult]);
    const emgRMS = useMemo(() => analysisResult?.emg_analysis?.rms_change?.toFixed(2) || 'N/A', [analysisResult]);
    const emgMedianFreq = useMemo(() => analysisResult?.emg_analysis?.median_frequency_change?.toFixed(2) || 'N/A', [analysisResult]);

    const recommendationColor = useMemo(() => {
        if (overallFatigueScore >= 70) return 'bg-red-900/80 border border-red-500';
        if (overallFatigueScore >= 30) return 'bg-yellow-900/80 border border-yellow-500';
        return 'bg-green-900/80 border border-green-500';
    }, [overallFatigueScore]);

    return (
        <div className="min-h-screen bg-gray-950 font-sans">
            <SimpleHeader 
                name={MOCK_USER_ID} 
                day={30} 
            />
            
            <main className="p-4 md:p-8 pb-16 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-blue-400 mb-6 border-b border-gray-700 pb-2">
                    PHYSICAL MODULE DETAIL ANALYSIS
                </h2>

                {loading && <LoadingIndicator />}

                {!loading && !analysisResult && (
                    <div className="bg-blue-900/40 border border-blue-600 p-5 rounded-xl mb-6">
                        <h3 className="text-xl font-bold text-blue-300 mb-3">
                            🔬 Yorgunluk Analizi API Test Client
                        </h3>

                        {(() => {
                            const payload = {
                                emg_data: {
                                    pre_exercise: Array.from({ length: 5000 }, (_, i) => Number((Math.sin(i / 100) * 0.3).toFixed(3))),
                                    post_exercise: Array.from({ length: 5000 }, (_, i) => Number((Math.sin(i / 100) * 0.6).toFixed(3))),
                                },
                                exercise_type: "squat",
                                duration_minutes: 30,
                                user_id: "astronaut_001"
                            };

                            return (
                                <>
                                    <p className="text-gray-300 mb-2">
                                        Backend'e gönderilecek örnek veriler aşağıda gösterilmektedir:
                                    </p>

                                    <div className="bg-black/50 border border-blue-700 rounded-lg p-3 text-sm text-gray-200 font-mono max-h-52 overflow-y-auto mb-4">
                                        <pre>{JSON.stringify(payload, null, 2)}</pre>
                                    </div>

                                    <button
                                        onClick={async () => {
                                            try {
                                                setLoading(true);
                                                setError(null);
                                                setShowPastData(false);

                                                const res = await fetch(`${API_BASE_URL}/fatigue-analysis`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify(payload)
                                                });

                                                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                                                const data = await res.json();

                                                console.log('API Response:', data);
                                                setAnalysisResult(data);

                                            } catch (err) {
                                                console.error("API Error:", err);
                                                setError("Gerçek API isteği başarısız oldu. Backend çalışıyor mu?");
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition duration-200"
                                    >
                                        🚀 Veri Gönder ve Analiz Et
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                )}

                {error && (
                    <div className="bg-red-800/50 p-3 rounded-xl shadow-inner mb-4 text-white border border-red-500">
                        <p className="text-sm font-bold">ERROR: </p>
                        <p className="text-xs">{error}</p>
                    </div>
                )}

                {!loading && analysisResult && (
                    <>
                        {/* Past Data Banner */}
                        {showPastData && (
                            <div className="bg-purple-900/40 border border-purple-500 p-4 rounded-xl mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">📊</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-purple-300">Past Data (Mock Analysis)</h3>
                                        <p className="text-sm text-gray-400">Previous exercise session - Anti-gravity squat (40 min)</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowPastData(false);
                                        setAnalysisResult(null);
                                    }}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition"
                                >
                                    New Analysis
                                </button>
                            </div>
                        )}

                        {/* Current Analysis Banner */}
                        {!showPastData && (
                            <div className="bg-green-900/40 border border-green-500 p-4 rounded-xl mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">✅</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-green-300">Current Analysis (Live Data)</h3>
                                        <p className="text-sm text-gray-400">Real-time data from backend API</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowPastData(true);
                                        setAnalysisResult(MOCK_API_RESPONSE);
                                    }}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold transition"
                                >
                                    View Past Data
                                </button>
                            </div>
                        )}
                        <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 mb-6">
                            <h4 className="text-xl font-bold text-blue-300 mb-3">EMG Analiz Sonuçları</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Median Frekans Değişimi:</p>
                                    <p className="text-2xl font-bold text-yellow-400">{emgMedianFreq}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">RMS Değişimi:</p>
                                    <p className="text-2xl font-bold text-yellow-400">{emgRMS}%</p>
                                </div>
                                {analysisResult.emg_analysis?.muscle_groups && (
                                    <>
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">Quadriceps:</p>
                                            <p className="text-lg font-semibold text-green-400">
                                                {analysisResult.emg_analysis.muscle_groups.quadriceps?.status || 'N/A'} 
                                                {' '}({analysisResult.emg_analysis.muscle_groups.quadriceps?.fatigue?.toFixed(1) || 0}% yorgunluk)
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">Hamstrings:</p>
                                            <p className="text-lg font-semibold text-green-400">
                                                {analysisResult.emg_analysis.muscle_groups.hamstrings?.status || 'N/A'}
                                                {' '}({analysisResult.emg_analysis.muscle_groups.hamstrings?.fatigue?.toFixed(1) || 0}% yorgunluk)
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl mb-8 border border-gray-700">
                            <p className="text-xl font-medium text-gray-300">
                                Overall Status: <span className="text-yellow-400 font-bold">{overallStatus}</span>
                            </p>
                            <p className="text-3xl font-bold text-white mt-2">
                                Yorgunluk Skoru: {overallFatigueScore.toFixed(1)}/100
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <div className="flex flex-col items-center bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-700 min-h-[550px]">
                                <h4 className="text-xl font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2 w-full text-center">
                                    EMG & Volume Metrics
                                </h4>
                                <div className="flex space-x-4 mb-6">
                                    <div className="text-center">
                                        <img src={`https://placehold.co/150x250/34D399/1F2937?text=PRE+EXERCISE%0A+EMG+SIGNAL`} 
                                            alt="Pre Exercise" className="rounded-lg shadow-md mb-2 object-cover w-full h-full"/>
                                        <p className="text-sm text-green-400">Pre Exercise (Low Fatigue)</p>
                                    </div>
                                    <div className="text-center">
                                        <img src={`https://placehold.co/150x250/EF4444/1F2937?text=POST+EXERCISE%0A+EMG+SIGNAL`} 
                                            alt="Post Exercise" className="rounded-lg shadow-md mb-2 object-cover w-full h-full"/>
                                        <p className="text-sm text-red-400">Post Exercise (High Fatigue)</p>
                                    </div>
                                </div>
                                <div className="w-full mt-auto p-3 bg-gray-700 rounded-lg">
                                    <h5 className="text-lg font-bold text-white mb-2">EMG Analysis</h5>
                                    <p className="text-sm text-gray-300">
                                        Median Freq. Change: <span className={parseFloat(emgMedianFreq) < 0 ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{emgMedianFreq}%</span>
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        RMS Change: <span className={parseFloat(emgRMS) < 0 ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{emgRMS}%</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Yüksek RMS değişimi kas yorgunluğunu gösterir.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-2">
                                <AsymmetryVisual3D 
                                    muscleStatus={muscleStatus} 
                                    selectedMuscle={selectedMuscle} 
                                    setSelectedMuscle={setSelectedMuscle}
                                />
                            </div>
                        </div>

                        <div className={`p-6 rounded-xl shadow-2xl ${recommendationColor} text-white font-semibold transition-all duration-300`}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-start flex-1">
                                    <span className="text-4xl mr-4 flex-shrink-0">
                                        {overallFatigueScore >= 70 ? '🚨' : overallFatigueScore >= 30 ? '⚠️' : '✅'}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-xl font-bold mb-2">AI DECISION:</p>
                                        <p className="text-base md:text-lg font-light leading-relaxed">
                                            {recommendationText}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    className="bg-gray-900 hover:bg-gray-700 px-6 py-3 rounded-lg transition duration-200 font-bold text-lg whitespace-nowrap flex-shrink-0"
                                    onClick={() => console.log('Starting recommended protocol...')}
                                >
                                    Start Protocol
                                </button>
                            </div>
                        </div>

                        {/* Raw JSON Response for Debugging */}
                        <div className="mt-6 bg-gray-800 p-4 rounded-xl border border-gray-600">
                            <details>
                                <summary className="text-gray-400 cursor-pointer hover:text-white font-semibold mb-2">
                                    🔍 Raw API Response (Debug)
                                </summary>
                                <div className="bg-black/50 border border-gray-700 rounded-lg p-3 text-xs text-gray-300 font-mono max-h-96 overflow-y-auto mt-2">
                                    <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
                                </div>
                            </details>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default PhysicalAnalyzePage;