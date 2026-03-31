'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'

interface AnalyticsData {
  total: number
  approved: number
  rejected: number
  pending: number
  totalEmployees: number
  avgApprovalDays: number
  monthlyData: { month: string; count: number }[]
  provinceData: { name: string; value: number }[]
  divisionData: { name: string; value: number }[]
  radarData: { division: string; approvalRate: number }[]
}

export default function HRAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/hr/analytics')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Loading analytics...</div>
  }

  if (!data) {
    return <div className="p-8 text-center">Failed to load data.</div>
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HR Analytics</h1>
        <p className="text-muted-foreground">Overall travel statistics and insights.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Travel Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total}</div>
            <p className="text-xs text-muted-foreground">All time requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.approved}</div>
            <p className="text-xs text-muted-foreground">{((data.approved / data.total) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.rejected}</div>
            <p className="text-xs text-muted-foreground">{((data.rejected / data.total) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{data.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Registered personnel</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Approval Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avgApprovalDays.toFixed(1)} days</div>
            <p className="text-xs text-muted-foreground">From submission to final approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
          <TabsTrigger value="province">By Province</TabsTrigger>
          <TabsTrigger value="division">By Division</TabsTrigger>
          <TabsTrigger value="radar">Approval Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Travel Requests Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} name="Requests" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="province" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Destinations (by Province)</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.provinceData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" name="Travel Orders" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="division" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Requests by Division</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.divisionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Travel Orders" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Rate by Division</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="division" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Approval Rate (%)" dataKey="approvalRate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}