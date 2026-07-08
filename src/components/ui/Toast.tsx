import { useEffect } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

interface ToastProps {
  message: string
  ok: boolean
  onDismiss: () => void
}

export function Toast({ message, ok, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium shadow-2xl ${
        ok
          ? 'bg-green-950 border-green-800 text-green-200'
          : 'bg-red-950 border-red-800 text-red-200'
      }`}
    >
      {ok
        ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
        : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
      }
      {message}
    </div>
  )
}

