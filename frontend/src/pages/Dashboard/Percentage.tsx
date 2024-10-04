import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import axiosInstance from "../../authentication/axiosInstance.tsx";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const PercentagePieChart: React.FC = () => {
  const [percentage, setPercentage] = useState<number | null>(null);

  useEffect(() => {
    const fetchPercentage = async () => {
      try {
        const response = await axiosInstance.get<{ percentageValidEmployees: string }>('http://localhost:3000/api/dashboard/percentage');
        setPercentage(parseFloat(response.data.percentageValidEmployees));
      } catch (error) {
        console.error('Error fetching percentage:', error);
      }
    };

    fetchPercentage();
  }, []);

  const data = percentage !== null ? [
    { name: 'Fully Certified', value: percentage },
    { name: 'Not Fully Certified', value: 100 - percentage }
  ] : [];

  const COLORS = ['#008000', '#FF0000'];

  return (
    <div className='piechart-container'>
      <h2 className='piechart-title'><b>Percentage Of Employees Who Are Fully Certified</b></h2>
      {percentage !== null ? (
        <div className="piechart-pie">
            <PieChart width={600} height={400}>
                <Pie
                    data={data}
                    cx={300}
                    cy={200}
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(2)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>  
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PercentagePieChart;
