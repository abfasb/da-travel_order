import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DivisionManager } from './division-manager'
import { ProvinceManager } from './province-manager'
import { StationManager } from './station-manager'

export async function SystemSettings() {
  const divisions = await prisma.user.groupBy({
    by: ['division'],
    where: { division: { not: null } },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Configuration</CardTitle>
        <CardDescription>Manage reference data for the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="divisions">
          <TabsList className="mb-4">
            <TabsTrigger value="divisions">Divisions</TabsTrigger>
            <TabsTrigger value="provinces">Provinces</TabsTrigger>
            <TabsTrigger value="stations">Official Stations</TabsTrigger>
          </TabsList>
          <TabsContent value="divisions">
            <DivisionManager initialDivisions={divisions.map(d => d.division!)} />
          </TabsContent>
          <TabsContent value="provinces">
            <ProvinceManager />
          </TabsContent>
          <TabsContent value="stations">
            <StationManager />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}