import React from 'react';
import { Header, ScoreCard, TrendChart, MentalVisual, PhysicalVisual } from '../components';
import { MOCK_DATA } from '../data/mockData';

const DashboardPage: React.FC = () => {
    return (
        <>
            <Header name={MOCK_DATA.astronautName} day={MOCK_DATA.missionDay} showBack={true} />
            <main className="p-4 md:p-8">
                <h2 className="text-3xl font-bold text-gray-200 mb-6">Astronaut Health Dashboard</h2>
                
                <section className="mb-10">
                    <h3 className="text-2xl font-light text-gray-300 mb-4 border-b border-gray-700 pb-2">
                        EMERGENCY & RISK INDICATORS
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ScoreCard title="Stress Level" score={MOCK_DATA.mentalScore} criticalThreshold={60} description="HRV-based stress level." unit="/ 100" />
                        <ScoreCard title="Muscle Fatigue Score" score={MOCK_DATA.muscleScore} criticalThreshold={70} warningThreshold={85} description="EMG Activity and Immobility Tracking." unit="/ 100" />
                        <ScoreCard title="Cognitive Focus" score={92} criticalThreshold={70} warningThreshold={80} description="Task Error Rate and Reaction Time Analysis." unit="/ 100" />
                        <ScoreCard title="Avg Sleep Quality" score={7.1} criticalThreshold={5.5} warningThreshold={6.5} description="Last 7 Days Average Sleep Duration (hours)." unit="hours" />
                    </div>
                </section>

                <section className="mb-10">
                    <h3 className="text-2xl font-light text-gray-300 mb-4 border-b border-gray-700 pb-2">
                        DATA TRENDS AND NEURO/KINETIC ANALYSIS
                    </h3>
                    
                    {/* İlk Satır - Stress Level */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="h-96">
                            <TrendChart 
                                title="🧠 Stress Level: Last 24 Hours" 
                                data={MOCK_DATA.stressTrend} 
                                dataKey="stressLevel" 
                                color="#f87171" 
                                xAxisKey="time" 
                            />
                        </div>
                        <div className="h-96">
                            <MentalVisual />
                        </div>
                    </div>

                    {/* İkinci Satır - Physical Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-96">
                            <TrendChart 
                                title="💪 Physical Activity: Last 7 Days (Click for Detail)"
                                data={MOCK_DATA.fatigueTrend} 
                                dataKey="activity" 
                                color="#60a5fa" 
                                xAxisKey="day"
                                linkTo="/physicalAnalyze"
                            />
                        </div>
                        <div className="h-96">
                            <PhysicalVisual />
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default DashboardPage;