import React from 'react';
import { ScoreCardProps } from '../types';

export const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, criticalThreshold, warningThreshold, description, unit }) => {
  let colorClass = 'text-green-400 border-green-500'; 
  
  if (score < criticalThreshold) {
    colorClass = 'text-red-400 border-red-500'; 
  } 
  else if (warningThreshold !== undefined && score < warningThreshold) {
     colorClass = 'text-yellow-400 border-yellow-500';
  }

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-2xl flex flex-col justify-between transition-all duration-300 border-l-8 hover:ring-2 ring-blue-500/50" style={{borderColor: colorClass.split('-')[1]}}>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <div className="flex items-end my-3">
        <p className={`text-6xl font-extrabold ${colorClass}`}>
          {score % 1 === 0 ? score : score.toFixed(1)} 
        </p>
        <span className="text-xl text-gray-400 ml-2">{unit}</span>
      </div>
      <p className="text-sm text-gray-400 mt-2 pt-2">{description}</p>
    </div>
  );
};