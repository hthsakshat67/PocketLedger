import React, { useEffect } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';

export function Toast() {
  const { toast, setToast } = useLedger();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast, setToast]);

  if (!toast) return null;

  const Icon = toast.type === 'success' ? CheckCircle2 : Info;

  return (
    <div className="fixed bottom-5 right-5 z-[70] w-[min(360px,calc(100vw-2rem))] rounded-sm border border-border bg-surface shadow-subtle p-4">
      <div className="flex gap-3">
        <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-main">{toast.title}</p>
          <p className="text-sm text-text-muted mt-0.5">{toast.body}</p>
        </div>
        <button
          type="button"
          onClick={() => setToast(null)}
          className="p-1 text-text-muted hover:text-text-main rounded-sm"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
