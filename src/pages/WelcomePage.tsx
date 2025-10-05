import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components';
import { MOCK_DATA } from '../data/mockData';

const WelcomePage: React.FC = () => {
    const navigate = useNavigate();
    
    return (
        <>
            <Header name={MOCK_DATA.astronautName} day={MOCK_DATA.missionDay} showBack={false} />
            <div className="p-4 md:p-12 text-center flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
                <div className="max-w-4xl bg-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl border-t-8 border-green-500">
                    <p className="text-xl text-gray-400 font-light mb-4">
                        Welcome!
                    </p>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight">
                        NAUTS CORE <span className="text-green-500">HEALTH</span>
                    </h1>
                    
                    <div className="flex justify-center space-x-6">
                        <div className="bg-gray-700 p-4 rounded-xl shadow-inner w-48">
                            <p className="text-4xl font-bold text-yellow-400">{MOCK_DATA.missionDay}</p>
                            <p className="text-sm text-gray-400">GÖREV GÜNÜ</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-xl shadow-inner w-48">
                            <p className="text-2xl font-semibold text-white">{MOCK_DATA.astronautName}</p>
                            <p className="text-sm text-gray-400">TAKİP EDİLEN ASTRONOT</p>
                        </div>
                    </div>

                    <p className="text-gray-300 mt-8 mb-10 text-lg">
                        Lütfen analiz ve acil durum müdahalesi için ana gösterge tablosuna geçin.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center justify-center bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h15v3H3v-3zm0 7.5h15v3H3v-3zm0 7.5h15v3H3v-3z" />
                            </svg>
                            ANA GÖSTERGE TABLOSU
                        </button>
                        
                        <button
                            onClick={() => navigate('/physicalAnalyze')}
                            className="flex items-center justify-center bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            FİZİKSEL DETAYLAR
                        </button>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-6">Version 4.1.2 - Orbital Path Stabilization Active</p>
            </div>
        </>
    );
};

export default WelcomePage;