'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';

async function fetchStaffFrequency(division: string) {
  const res = await fetch(`/api/division-head/analytics/staff-frequency?division=${division}`);
  return res.json();
}

export function StaffTravelFrequencyChart({ division }: { division: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['staff-frequency', division],
    queryFn: () => fetchStaffFrequency(division),
  });

  if (isLoading) return <div className="h-full flex items-center justify-center">Loading...</div>;
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-slate-500">No data</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={100} />
        <Tooltip />
        <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}