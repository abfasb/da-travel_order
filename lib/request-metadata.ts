import { headers } from 'next/headers'

export async function getRequestMetadata() {
  const headersList = await headers()
  
  const forwardedFor = headersList.get('x-forwarded-for')
  const ipAddress = forwardedFor?.split(',')[0]?.trim() || 
                    headersList.get('x-real-ip') || 
                    'unknown'
  
  const userAgent = headersList.get('user-agent') || undefined
  
  return { ipAddress, userAgent }
}