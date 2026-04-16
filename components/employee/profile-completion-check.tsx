'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileCompletionModal } from './profile-completion-modal'

interface ProfileCompletionCheckProps {
  user: {
    id: string
    mobileNumber: string
    division: string | null
    officialStation: string | null
    employmentStatus: string | null
  }
}

export function ProfileCompletionCheck({ user }: ProfileCompletionCheckProps) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const isProfileIncomplete = 
      !user.mobileNumber ||
      !user.division ||
      !user.officialStation ||
      !user.employmentStatus

    if (isProfileIncomplete) {
      setShowModal(true)
    }
  }, [user])

  const handleComplete = () => {
    setShowModal(false)
    window.location.reload()
  }

  return (
    <ProfileCompletionModal
      open={showModal}
      onOpenChange={setShowModal}
      userId={user.id}
      onComplete={handleComplete}
    />
  )
}