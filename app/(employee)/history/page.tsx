// app/(employee)/history/page.tsx
import { TravelHistoryTable } from '@/components/employee/travel-history-table'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Travel History</h1>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 sm:grid-cols-4">
          <Input placeholder="Search by destination..." />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jan">January</SelectItem>
              <SelectItem value="feb">February</SelectItem>
              {/* ... */}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regulatory">Regulatory</SelectItem>
              <SelectItem value="laboratory">Laboratory</SelectItem>
              {/* ... */}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <TravelHistoryTable />
    </div>
  )
}