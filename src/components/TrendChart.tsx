import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendChartProps } from '../types';

export const TrendChart: React.FC<TrendChartProps> = ({ data, dataKey, color, xAxisKey, title, linkTo }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className={`bg-gray-800 p-6 rounded-xl shadow-2xl h-full flex flex-col ${linkTo ? 'cursor-pointer hover:ring-2 ring-green-500 transition' : ''}`}
      onClick={linkTo ? () => navigate(linkTo) : undefined}
    > 
      <h3 className={`text-xl font-medium mb-4 ${color.replace('text', 'text')}`}>{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /> 
          <XAxis dataKey={xAxisKey} stroke="#cbd5e0" tick={{ fontSize: 12 }} />
          <YAxis stroke="#cbd5e0" domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4a5568', color: '#fff', borderRadius: '8px' }} 
              labelStyle={{ color: color }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};