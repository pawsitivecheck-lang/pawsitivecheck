import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LoadingButton } from "@/components/ui/loading-button"
import { TRANSITION_CLASSES } from "@/utils/transitions"
import { cn } from "@/lib/utils"
import { AlertTriangle, Trash2, Check, X } from "lucide-react"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  loading?: boolean
  onConfirm: () => void
  icon?: React.ReactNode
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
  icon
}: ConfirmationDialogProps) {
  const defaultIcon = variant === "destructive" ? 
    <AlertTriangle className="h-5 w-5 text-destructive" /> :
    <Check className="h-5 w-5 text-primary" />

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn("sm:max-w-md", TRANSITION_CLASSES.modal)}>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              variant === "destructive" 
                ? "bg-destructive/10" 
                : "bg-primary/10"
            )}>
              {icon || defaultIcon}
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-left pl-13">
          {description}
        </AlertDialogDescription>
        <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-2">
          <AlertDialogCancel 
            className={cn(
              TRANSITION_CLASSES.buttonSoft,
              "flex-1 sm:flex-none"
            )}
            disabled={loading}
          >
            {cancelText}
          </AlertDialogCancel>
          <LoadingButton
            variant={variant === "destructive" ? "destructive" : "default"}
            className="flex-1 sm:flex-none"
            loading={loading}
            onClick={onConfirm}
            loadingText={variant === "destructive" ? "Deleting..." : "Processing..."}
          >
            {confirmText}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Specific confirmation dialog variations
export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  itemName = "item"
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  loading?: boolean
  itemName?: string
}) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Item"
      description={`Are you sure you want to delete this ${itemName}? This action cannot be undone.`}
      confirmText="Delete"
      variant="destructive"
      loading={loading}
      onConfirm={onConfirm}
      icon={<Trash2 className="h-5 w-5 text-destructive" />}
    />
  )
}