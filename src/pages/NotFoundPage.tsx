import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components';
import { MOCK_DATA } from '../data/mockData';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();
    
    return (
        <div className="p-12">
            <Header name={MOCK_DATA.astronautName} day={MOCK_DATA.missionDay} showBack={true} />
            <div className="text-center mt-20">
                <h1 className="text-5xl font-bold text-red-500">404</h1>
                <p className="text-xl text-gray-400 mt-4">Aradığınız sayfa bulunamadı.</p>
                <button onClick={() => navigate('/')} className="mt-8 bg-green-600 hover:bg-green-500 text-white py-2 px-6 rounded-lg transition">Ana Sayfaya Dön</button>
            </div>
        </div>
    );
};

export default NotFoundPage;