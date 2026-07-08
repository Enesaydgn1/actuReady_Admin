import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmModalProps {
  title?: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  title = 'Emin misiniz?',
  message,
  confirmLabel = 'Evet, Sil',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal title={title} onClose={onCancel} maxWidth="max-w-sm">
      <div className="space-y-4">
        <p className="text-sm text-slate-400">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Vazgeç
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
