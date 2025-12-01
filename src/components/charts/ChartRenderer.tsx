import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { LineChart, Line } from 'recharts';

import ResultTable from '../ResultTable';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderers = {
  bar: (data: any, metadata: any) => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={metadata.category_key} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={metadata.value_key} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  ),
  pie: (data: any, metadata: any) => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey={metadata.value_key} nameKey={metadata.category_key} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
          {data.map((_entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  ),
  line: (data: any, metadata: any) => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={metadata.category_key} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={metadata.value_key} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  ),
  table: (data: Record<string, any>[]) => <ResultTable result={data} />,
};

interface ChartRendererProps {
  data: any[];
  metadata: {
    content_type: 'bar' | 'pie' | 'line' | 'table';
    category_key: string;
    value_key: string;
  };
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ data, metadata }) => {
  const renderer = renderers[metadata.content_type];
  return renderer ? renderer(data, metadata) : <p>Unsupported chart type</p>;
};

export default ChartRenderer;
