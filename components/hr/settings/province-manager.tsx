'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Save } from 'lucide-react'
import { toast } from 'sonner'

const MIMAROPA_PROVINCES = [
  'Oriental Mindoro',
  'Occidental Mindoro',
  'Marinduque',
  'Palawan',
  'Romblon',
]

export function ProvinceManager() {
  const [provinces, setProvinces] = useState<string[]>(MIMAROPA_PROVINCES)
  const [newProvince, setNewProvince] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const addProvince = () => {
    if (!newProvince.trim()) return
    if (provinces.includes(newProvince.trim())) {
      toast.error('Province already exists')
      return
    }
    setProvinces([...provinces, newProvince.trim()])
    setNewProvince('')
    toast.success('Province added')
  }

  const removeProvince = (province: string) => {
    setProvinces(provinces.filter(p => p !== province))
    toast.success('Province removed')
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.success('Provinces saved successfully')
    setIsSaving(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Manage the list of provinces available for travel destinations and employee stations.
      </p>

      <div className="flex gap-2">
        <Input
          placeholder="Enter province name..."
          value={newProvince}
          onChange={(e) => setNewProvince(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addProvince()}
          className="max-w-sm"
        />
        <Button onClick={addProvince} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1">
        {provinces.map(province => (
          <Badge key={province} variant="secondary" className="px-3 py-1.5 text-sm">
            {province}
            <button
              onClick={() => removeProvince(province)}
              className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="pt-4 border-t">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Provinces'}
        </Button>
        <p className="text-xs text-slate-400 mt-2">
          These provinces are used for destination selection and employee station assignment.
        </p>
      </div>
    </div>
  )
}