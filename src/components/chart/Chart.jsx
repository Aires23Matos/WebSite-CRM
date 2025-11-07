import React from 'react';
import "./chart.css"
import { AreaChart, Area, XAxis,YAxis,CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Legend, Line } from 'recharts';

const data = [
  {
    name: 'Janeiro',
    Total: 1200
  },
  {
   name: 'Fevereiro',
    Total_b: 2100
  },
  {
   name: 'Março',
    Total: 800
  },
  {
   name: 'Abril',
    Total_b: 1600
  },
  {
   name: 'Maio',
    Total: 900
  },
  {
  name: 'Junho',
    Total_b: 1700
  },
  {
   name: 'Julho',
    Total: 1400
  },
];

const Chart = () => {
    return (
      <div className='chart'>
        <div className='title'>Last 7 Months (Revenue)</div>
         <LineChart
            style={{ width: '100%', maxWidth: '700px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={data}
            margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
            }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="Total" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="Total_b" stroke="#82ca9d" />
    </LineChart>
  

      </div>
    );
};

export default Chart;