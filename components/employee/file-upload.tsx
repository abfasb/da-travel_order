'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface UploadedFile {
  file: File
  previewUrl?: string
}

interface FileUploadProps {
  onChange: (files: File[]) => void
  maxFiles?: number
  maxSizeMB?: number
  accept?: string
}

export function FileUpload({
  onChange,
  maxFiles = 5,
  maxSizeMB = 5,
  accept = '*',
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const handleFiles = (newFiles: File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} files`)
      return
    }

    const oversized = newFiles.find(f => f.size > maxSizeBytes)
    if (oversized) {
      toast.error(`File "${oversized.name}" exceeds ${maxSizeMB}MB limit`)
      return
    }

    const updated = [
      ...files,
      ...newFiles.map(file => ({
        file,
        previewUrl: file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : undefined,
      })),
    ]

    setFiles(updated)
    onChange(updated.map(f => f.file))
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onChange(updated.map(f => f.file))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(Array.from(e.target.files))
    }
  }

  return (
    <div className="space-y-3">
      <div
        className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
          dragOver
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
            : 'border-border hover:border-emerald-300 hover:bg-muted/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium">
          Drag & drop files here, or click to select
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Up to {maxFiles} files, max {maxSizeMB}MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2 truncate">
                {f.file.type.startsWith('image/') ? (
                  <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className="truncate">{f.file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(f.file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(i)
                }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}