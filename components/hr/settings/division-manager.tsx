'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'

const DEFAULT_DIVISIONS = [
  'regulatory',
  'laboratory',
  'research',
  'field_ops',
  'agri_marketing',
  'engineering',
  'planning',
  'info_section',
  'admin_finance',
  'procurement',
]

export function DivisionManager({ initialDivisions }: { initialDivisions: string[] }) {
  const [divisions, setDivisions] = useState(initialDivisions.length ? initialDivisions : DEFAULT_DIVISIONS)
  const [newDivision, setNewDivision] = useState('')

  const addDivision = () => {
    if (newDivision.trim() && !divisions.includes(newDivision.trim())) {
      setDivisions([...divisions, newDivision.trim()])
      setNewDivision('')
    }
  }

  const removeDivision = (div: string) => {
    setDivisions(divisions.filter(d => d !== div))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="New division name..."
          value={newDivision}
          onChange={(e) => setNewDivision(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addDivision()}
        />
        <Button onClick={addDivision} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {divisions.map(div => (
          <Badge key={div} variant="secondary" className="px-3 py-1 text-sm">
            {div}
            <button onClick={() => removeDivision(div)} className="ml-2 hover:text-red-500">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Button variant="outline" size="sm">Save Changes</Button>
      <p className="text-xs text-slate-500">Changes require admin approval.</p>
    </div>
  )
}