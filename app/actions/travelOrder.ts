'use server'

import { prisma } from '@/lib/prisma'
import { supabaseStorage } from '@/lib/supabase-storage'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getRequestMetadata } from '@/lib/request-metadata'
import { v4 as uuid } from 'uuid'

export async function submitTravelOrder(formData: FormData) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  if (!userId) return { success: false, error: 'Unauthorized' }

  const dataStr = formData.get('data') as string
  const files = formData.getAll('files') as File[]
  const data = JSON.parse(dataStr)

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        officialStation: true,
        employmentStatus: true,
        division: true,
        firstName: true,
        lastName: true,
      },
    })
    if (!user) return { success: false, error: 'User not found' }

    const { ipAddress, userAgent } = await getRequestMetadata()

    const newOrder = await prisma.travelOrderRequest.create({
      data: {
        userId,
        requestorName: data.fullName,
        requestorPosition: data.position,
        requestorSalary: data.salaryPerMonth,
        requestorStation: user.officialStation || 'N/A',
        employmentStatus: user.employmentStatus || 'PERMANENT',
        departureDate: new Date(data.departureDate),
        returnDate: new Date(data.returnDate),
        destinationProvince: data.destinationProvince,
        specificLocation: data.specificLocation,
        destinationSummary: data.destinationSummary,
        purpose: data.specificPurpose,
        objectives: data.objectives,
        travelDetails: data.travelDetails,
        meansOfTransport: data.meansOfTransport,
        estimatedExpenses: data.estimatedExpenses,
        sourceOfFunds: data.sourceOfFunds,
        accompanyingPersonnel: data.accompanyingPersonnel || null,
        requestorSignature: data.requestorSignature || null,
        status: 'PENDING',
        itineraryItems: user.employmentStatus !== 'PERMANENT'
          ? {
              create: data.itineraryItems.map((item: any) => ({
                date: new Date(item.date),
                location: item.location,
                activity: item.activity,
                responsiblePerson: item.responsiblePerson,
              })),
            }
          : undefined,
      },
    })

    const attachmentPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const filePath = `attachments/${newOrder.id}/${uuid()}-${file.name}`

      const { error: uploadError } = await supabaseStorage.storage
        .from('attachments')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        console.error('Upload failed for', file.name, uploadError)
        throw new Error('File upload failed')
      }

      const { data: { publicUrl } } = supabaseStorage.storage
        .from('attachments')
        .getPublicUrl(filePath)

      return {
        travelOrderId: newOrder.id,
        fileName: file.name,
        fileUrl: publicUrl,
        fileSize: file.size,
        mimeType: file.type,
        uploadedById: userId,
      }
    })

    const attachmentData = await Promise.all(attachmentPromises)

    // ---------- Step 3: Create attachments, approvals, audit log ----------
    await prisma.$transaction(async (tx) => {
      // Create attachments
      for (const att of attachmentData) {
        await tx.attachment.create({ data: att })
      }

      // Create approvals
      const isFieldOps = user.division?.toLowerCase().includes('field') ?? false
      const roles = isFieldOps
        ? ['APCO', 'CHIEF_AGRICULTURIST', 'CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE']
        : ['CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE']

      for (const role of roles) {
        await tx.approval.create({
          data: {
            travelOrderId: newOrder.id,
            approverRole: role as any,
            status: 'PENDING',
          },
        })
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId,
          action: 'CREATE',
          details: `Travel order created by ${user.firstName} ${user.lastName} for ${data.destinationProvince}`,
          ipAddress,
          userAgent,
          travelOrderId: newOrder.id,
        },
      })
    })

    revalidatePath('/approvals')
    revalidatePath('/employee/history')
    return { success: true }
  } catch (error) {
    console.error('Travel Order with files error:', error)
    return { success: false, error: 'Failed to submit travel order' }
  }
}