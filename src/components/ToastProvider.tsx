import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastInput {
  type?: ToastType;
  title: string;
  description?: string;
  durationMs?: number;
}

interface ToastItem extends Required<Omit<ToastInput, 'durationMs'>> {
  id: string;
  durationMs: number | null;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const defaultDurations: Record<ToastType, number | null> = {
  success: 5000,
  error: 5000,
  warning: 5000,
  info: 5000,
};

const toastStyles: Record<ToastType, { icon: typeof CheckCircle2; accent: string; ring: string }> = {
  success: {
    icon: CheckCircle2,
    accent: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/25',
    ring: 'bg-emerald-400',
  },
  error: {
    icon: ShieldAlert,
    accent: 'text-rose-300 bg-rose-400/10 border-rose-400/25',
    ring: 'bg-rose-400',
  },
  warning: {
    icon: AlertTriangle,
    accent: 'text-amber-300 bg-amber-400/10 border-amber-400/25',
    ring: 'bg-amber-400',
  },
  info: {
    icon: Info,
    accent: 'text-sky-300 bg-sky-400/10 border-sky-400/25',
    ring: 'bg-sky-400',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: ToastInput) => {
    const type = toast.type || 'info';
    const id = crypto.randomUUID ? crypto.randomUUID() : `toast-${Date.now()}-${Math.random()}`;
    const nextToast: ToastItem = {
      id,
      type,
      title: toast.title,
      description: toast.description || '',
      durationMs: toast.durationMs === undefined ? defaultDurations[type] : toast.durationMs,
    };

    setToasts((current) => [nextToast, ...current].slice(0, 5));

    if (nextToast.durationMs !== null) {
      window.setTimeout(() => dismissToast(id), nextToast.durationMs);
    }

    return id;
  }, [dismissToast]);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-relevant="additions removals">
        {toasts.map((toast) => {
          const style = toastStyles[toast.type];
          const Icon = style.icon;

          return (
            <div key={toast.id} className="toast-card" role={toast.type === 'error' ? 'alert' : 'status'}>
              <div className={`toast-icon ${style.accent}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-white leading-5">{toast.title}</p>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="toast-close"
                    aria-label="بستن اعلان"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {toast.description && (
                  <p className="mt-1 text-xs text-neutral-400 leading-5">{toast.description}</p>
                )}
              </div>
              {toast.durationMs !== null && (
                <div className="toast-progress-track">
                  <div
                    className={`toast-progress ${style.ring}`}
                    style={{ animationDuration: `${toast.durationMs}ms` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return context;
}
