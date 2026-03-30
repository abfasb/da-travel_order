import { prisma } from './prisma'
import { Role } from '@prisma/client'

export async function createApprovalsForTravelOrder(travelOrderId: string, userDivision: string | null, employmentStatus: string) {
  const isFieldOps = userDivision === 'Field Operations Division'

  let roles: Role[] = []
  if (isFieldOps) {
    roles = ['APCO', 'CHIEF_AGRICULTURIST', 'CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE']
  } else {
    roles = ['CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE']
  }

  for (const role of roles) {
    await prisma.approval.create({
      data: {
        travelOrderId,
        approverRole: role,
        status: 'PENDING',
      },
    })
  }
}