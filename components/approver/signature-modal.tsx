'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { submitApproval } from '@/app/actions/approvals'
import { saveSignature, getSavedSignature } from '@/app/actions/approvals/save-signature'

interface SignatureModalProps {
  orderId: string
  approvalId: string
  userRole: string
}

export function SignatureModal({ orderId, approvalId, userRole }: SignatureModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false)
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [certified, setCertified] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedSignature, setSavedSignature] = useState<string | null>(null)
  const [loadingSaved, setLoadingSaved] = useState(false)

  const sigCanvas = useRef<SignatureCanvas>(null)

  useEffect(() => {
    if (open) {
      const loadSaved = async () => {
        setLoadingSaved(true)
        const saved = await getSavedSignature()
        setSavedSignature(saved)
        setLoadingSaved(false)
      }
      loadSaved()
    }
  }, [open])

  const handleClear = () => {
    sigCanvas.current?.clear()
    setSignatureData(null)
  }

  const handleSaveDraw = () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error('Please provide a signature.')
      return
    }
    const dataURL = sigCanvas.current?.toDataURL('image/png')
    setSignatureData(dataURL!)
    toast.success('Signature saved temporarily.')
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setSignatureData(event.target?.result as string)
      toast.success('Signature uploaded.')
    }
    reader.readAsDataURL(file)
  }

  const handleUseSaved = () => {
    if (savedSignature) {
      setSignatureData(savedSignature)
      toast.success('Using your saved signature')
    }
  }

  const handleSaveToAccount = async () => {
    if (!signatureData) {
      toast.error('No signature to save.')
      return
    }
    const result = await saveSignature(signatureData)
    if (result.success) {
      setSavedSignature(signatureData)
      toast.success('Signature saved to your account.')
    } else {
      toast.error(result.error || 'Failed to save signature')
    }
  }

  const handleApprove = async () => {
    if (!signatureData) {
      toast.error('Please provide your signature.')
      return
    }
    if (!certified) {
      toast.error('You must certify that you have reviewed and approved this travel order.')
      return
    }

    setIsSubmitting(true)
    const result = await submitApproval({
      approvalId,
      action: 'APPROVE',
      signature: signatureData,
      comment: null,
      certificationCheck: certified,
    })

    if (result.success) {
      toast.success('Travel order approved successfully.')
      setOpen(false)
      router.push('/approvers/approvals')
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to approve.')
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection.')
      return
    }

    setIsSubmitting(true)
    const result = await submitApproval({
      approvalId,
      action: 'REJECT',
      signature: null,
      comment: rejectReason,
      certificationCheck: false,
    })

    if (result.success) {
      toast.success('Travel order rejected.')
      setOpen(false)
      router.push('/approvers/approvals');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to reject.')
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3">
          Open Signature Panel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Digital Signature</DialogTitle>
          <DialogDescription>
            Please provide your official signature and confirm your approval.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Tabs defaultValue="draw" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="draw">Draw Signature</TabsTrigger>
              <TabsTrigger value="upload">Upload Signature</TabsTrigger>
            </TabsList>
            <TabsContent value="draw" className="space-y-4">
              <div className="border rounded-lg bg-white p-2">
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{ className: 'w-full h-48 border rounded-md' }}
                  backgroundColor="white"
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClear}>
                  Clear
                </Button>
                <Button type="button" onClick={handleSaveDraw} disabled={isSubmitting}>
                  Save Signature
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="upload" className="space-y-4">
              <div className="flex items-center gap-4">
                <Input type="file" accept="image/*" onChange={handleUpload} disabled={isSubmitting} />
              </div>
              {signatureData && (
                <div className="border rounded-lg p-2 bg-white">
                  <img src={signatureData} alt="Uploaded signature" className="max-h-48 object-contain" />
                </div>
              )}
            </TabsContent>
          </Tabs>

          {signatureData && (
            <div className="border rounded-lg p-4 bg-muted/10">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <img src={signatureData} alt="Signature preview" className="max-h-20 object-contain" />
            </div>
          )}

          {/* Saved signature section */}
          {!loadingSaved && savedSignature && (
            <div className="flex gap-2 items-center justify-between bg-muted/20 p-2 rounded-lg">
              <span className="text-sm">Saved signature exists</span>
              <Button type="button" variant="outline" size="sm" onClick={handleUseSaved}>
                Use Saved
              </Button>
            </div>
          )}

          {/* Save current signature to account */}
          {signatureData && (
            <Button type="button" variant="secondary" size="sm" onClick={handleSaveToAccount} className="w-full">
              Save this signature to my account
            </Button>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="certify"
              checked={certified}
              onCheckedChange={(checked) => setCertified(checked as boolean)}
              disabled={isSubmitting}
            />
            <Label htmlFor="certify" className="text-sm font-medium leading-none">
              I certify that I have reviewed and approved this travel order.
            </Label>
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              onClick={handleApprove}
              disabled={!signatureData || !certified || isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 flex-1"
            >
              Approve
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" disabled={isSubmitting}>
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Travel Order</DialogTitle>
                  <DialogDescription>
                    Please provide a reason for rejection.
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  placeholder="Reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRejectReason('')}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim() || isSubmitting}>
                    Confirm Rejection
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}