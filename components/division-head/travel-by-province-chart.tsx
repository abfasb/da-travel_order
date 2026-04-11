'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

async function fetchProvinceData(division: string) {
  const res = await fetch(`/api/division-head/analytics/by-province?division=${division}`);
  return res.json();
}

export function TravelByProvinceChart({ division }: { division: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['province-travel', division],
    queryFn: () => fetchProvinceData(division),
  });

  if (isLoading) return <div className="h-full flex items-center justify-center">Loading...</div>;
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-slate-500">No data</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}