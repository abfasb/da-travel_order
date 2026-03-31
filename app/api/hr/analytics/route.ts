import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const getLast12Months = () => {
  const months = []
  const today = new Date()
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    months.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }))
  }
  return months
}

export async function GET() {
  try {
    const travelOrders = await prisma.travelOrderRequest.findMany({
      include: {
        user: true,
        approvals: true,
      },
    })

    const total = travelOrders.length
    const approved = travelOrders.filter(to => to.status === 'APPROVED').length
    const rejected = travelOrders.filter(to => to.status === 'REJECTED').length
    const pending = travelOrders.filter(to => to.status === 'PENDING').length
    const totalEmployees = await prisma.user.count()

    const months = getLast12Months()
    const monthlyData = months.map(month => {
      const [monthName, year] = month.split(' ')
      const count = travelOrders.filter(to => {
        const created = new Date(to.createdAt)
        return created.toLocaleString('default', { month: 'short' }) === monthName &&
               created.getFullYear().toString() === year
      }).length
      return { month, count }
    })

    const provinceCounts: Record<string, number> = {}
    travelOrders.forEach(to => {
      const prov = to.destinationProvince || 'Unknown'
      provinceCounts[prov] = (provinceCounts[prov] || 0) + 1
    })
    const provinceData = Object.entries(provinceCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)

    // Division distribution
    const divisionCounts: Record<string, number> = {}
    travelOrders.forEach(to => {
      const div = to.user?.division || 'Unknown'
      divisionCounts[div] = (divisionCounts[div] || 0) + 1
    })
    const divisionData = Object.entries(divisionCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Radar data: approval rate per division
    const divisions = [...new Set(travelOrders.map(to => to.user?.division).filter(Boolean))]
    const radarData = divisions.map(div => {
      const ordersForDiv = travelOrders.filter(to => to.user?.division === div)
      const totalDiv = ordersForDiv.length
      const approvedDiv = ordersForDiv.filter(to => to.status === 'APPROVED').length
      const rate = totalDiv === 0 ? 0 : (approvedDiv / totalDiv) * 100
      return {
        division: div,
        approvalRate: Math.round(rate),
      }
    })

    // Average approval time (in days)
    const approvedOrders = travelOrders.filter(to => to.status === 'APPROVED')
    let avgApprovalDays = 0
    if (approvedOrders.length > 0) {
      const totalDays = approvedOrders.reduce((sum, order) => {
        const lastApproval = order.approvals
          .filter(a => a.status === 'APPROVED')
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0]
        if (lastApproval) {
          const days = (lastApproval.updatedAt.getTime() - order.createdAt.getTime()) / (1000 * 3600 * 24)
          return sum + days
        }
        return sum
      }, 0)
      avgApprovalDays = totalDays / approvedOrders.length
    }

    return NextResponse.json({
      total,
      approved,
      rejected,
      pending,
      totalEmployees,
      avgApprovalDays,
      monthlyData,
      provinceData,
      divisionData,
      radarData,
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}