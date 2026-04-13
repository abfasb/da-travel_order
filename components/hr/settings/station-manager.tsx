'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, Save, MapPin } from 'lucide-react'
import { toast } from 'sonner'

const MIMAROPA_PROVINCES = [
  'Oriental Mindoro',
  'Occidental Mindoro',
  'Marinduque',
  'Palawan',
  'Romblon',
]

const DEFAULT_STATIONS: Record<string, string[]> = {
  'Oriental Mindoro': ['DA Victoria', 'DA Barcenaga', 'DA Calapan'],
  'Occidental Mindoro': ['DA San Jose', 'DA Magsaysay'],
  'Marinduque': ['DA Boac', 'DA Gasan'],
  'Palawan': ['DA Puerto Princesa', 'DA Narra', 'DA Coron'],
  'Romblon': ['DA Romblon', 'DA Odiongan'],
}

export function StationManager() {
  const [stations, setStations] = useState<Record<string, string[]>>(DEFAULT_STATIONS)
  const [selectedProvince, setSelectedProvince] = useState<string>('Oriental Mindoro')
  const [newStation, setNewStation] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const currentStations = stations[selectedProvince] || []

  const addStation = () => {
    if (!newStation.trim()) return
    if (currentStations.includes(newStation.trim())) {
      toast.error('Station already exists for this province')
      return
    }
    setStations({
      ...stations,
      [selectedProvince]: [...currentStations, newStation.trim()],
    })
    setNewStation('')
    toast.success(`Station added to ${selectedProvince}`)
  }

  const removeStation = (station: string) => {
    setStations({
      ...stations,
      [selectedProvince]: currentStations.filter(s => s !== station),
    })
    toast.success(`Station removed from ${selectedProvince}`)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.success('Official stations saved successfully')
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">
        Manage official stations for each province. These are used when employees select their official station during registration or travel order creation.
      </p>

      {/* Province Selector */}
      <div className="flex items-center gap-4">
        <div className="w-64">
          <label className="text-sm font-medium mb-1.5 block">Select Province</label>
          <Select value={selectedProvince} onValueChange={setSelectedProvince}>
            <SelectTrigger>
              <SelectValue placeholder="Select a province" />
            </SelectTrigger>
            <SelectContent>
              {MIMAROPA_PROVINCES.map(province => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1" />
      </div>

      {/* Stations List */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-slate-500" />
            <h3 className="font-medium">
              Stations in {selectedProvince} ({currentStations.length})
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Station Name</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-slate-400 py-6">
                    No stations defined for this province.
                  </TableCell>
                </TableRow>
              ) : (
                currentStations.map(station => (
                  <TableRow key={station}>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {station}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStation(station)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex gap-2 mt-4 pt-2 border-t">
            <Input
              placeholder="Enter new station name..."
              value={newStation}
              onChange={(e) => setNewStation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addStation()}
              className="max-w-sm"
            />
            <Button onClick={addStation} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" /> Add Station
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="pt-2">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save All Stations'}
        </Button>
        <p className="text-xs text-slate-400 mt-2">
          Stations are linked to provinces and used in employee profiles and travel orders.
        </p>
      </div>
    </div>
  )
}