'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';

async function fetchMonthlyData(division: string) {
  const res = await fetch(`/api/division-head/analytics/monthly?division=${division}`);
  return res.json();
}

export function TravelTrendChart({ division }: { division: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['monthly-travel', division],
    queryFn: () => fetchMonthlyData(division),
  });

  if (isLoading) return <div className="h-full flex items-center justify-center">Loading...</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}