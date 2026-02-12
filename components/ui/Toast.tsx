"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      const newToast = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);

      const duration = toast.duration || 5000;
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "success", title, message });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "error", title, message });
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "info", title, message });
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "warning", title, message });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, removeToast, success, error, info, warning }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500",
      textColor: "text-green-400",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-500/20",
      borderColor: "border-red-500",
      textColor: "text-red-400",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500",
      textColor: "text-yellow-400",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500",
      textColor: "text-blue-400",
    },
  };

  const { icon: Icon, bgColor, borderColor, textColor } = config[toast.type];

  return (
    <div
      className={`${bgColor} border ${borderColor} rounded-lg p-4 shadow-2xl backdrop-blur-sm animate-slide-in-right flex items-start gap-3`}
    >
      <Icon className={`w-5 h-5 ${textColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${textColor}`}>{toast.title}</p>
        {toast.message && (
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">{toast.message}</p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className={`mt-2 text-sm font-semibold ${textColor} hover:underline`}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
