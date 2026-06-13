import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
}

interface ToastProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: { toast: ToastData; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border border-cyan-500/40 bg-[#0d1117] shadow-lg shadow-cyan-900/20 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <CheckCircle size={16} className="text-cyan-400 shrink-0" />
      <span className="text-sm text-gray-200 font-mono">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-1 text-gray-500 hover:text-gray-300 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
