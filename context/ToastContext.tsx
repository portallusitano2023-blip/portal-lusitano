"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { X, CheckCircle, AlertCircle, Info, ShoppingBag, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "cart" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
  removing?: boolean;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
  // Convenience methods (title + optional message)
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 4000) => {
      const id = crypto.randomUUID();
      const newToast: Toast = { id, type, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    [hideToast]
  );

  // Convenience: success("Title", "optional message")
  const success = useCallback(
    (title: string, message?: string) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [
        ...prev,
        { id, type: "success", title, message: message ?? title, duration: 4000 },
      ]);
      setTimeout(() => hideToast(id), 4000);
    },
    [hideToast]
  );

  const error = useCallback(
    (title: string, message?: string) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [
        ...prev,
        { id, type: "error", title, message: message ?? title, duration: 5000 },
      ]);
      setTimeout(() => hideToast(id), 5000);
    },
    [hideToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [
        ...prev,
        { id, type: "warning", title, message: message ?? title, duration: 5000 },
      ]);
      setTimeout(() => hideToast(id), 5000);
    },
    [hideToast]
  );

  const info = useCallback(
    (title: string, message?: string) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [
        ...prev,
        { id, type: "info", title, message: message ?? title, duration: 4000 },
      ]);
      setTimeout(() => hideToast(id), 4000);
    },
    [hideToast]
  );

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500 shrink-0" size={20} />;
      case "error":
        return <AlertCircle className="text-red-500 shrink-0" size={20} />;
      case "info":
        return <Info className="text-blue-500 shrink-0" size={20} />;
      case "cart":
        return <ShoppingBag className="text-[var(--gold)] shrink-0" size={20} />;
      case "warning":
        return <AlertTriangle className="text-amber-500 shrink-0" size={20} />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "border-green-500/30";
      case "error":
        return "border-red-500/30";
      case "info":
        return "border-blue-500/30";
      case "cart":
        return "border-[var(--gold)]/30";
      case "warning":
        return "border-amber-500/30";
    }
  };

  const value = useMemo(
    () => ({ showToast, hideToast, success, error, warning, info }),
    [showToast, hideToast, success, error, warning, info]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Container */}
      <div
        className="fixed bottom-[calc(1.5rem+72px)] lg:bottom-6 right-6 z-[9999] flex flex-col gap-3"
        aria-live="polite"
        role="status"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`bg-[var(--background-secondary)] border ${getBorderColor(toast.type)} backdrop-blur-xl shadow-2xl rounded-sm px-5 py-4 flex items-start gap-4 min-w-[300px] max-w-[400px] ${toast.removing ? "animate-[slideOutRight_0.3s_ease-out_forwards]" : "animate-[slideInRight_0.3s_ease-out_forwards]"}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm font-semibold text-[var(--foreground)] mb-0.5">
                  {toast.title}
                </p>
              )}
              <p className="text-sm text-[var(--foreground-secondary)]">{toast.message}</p>
              {toast.action && (
                <button
                  onClick={toast.action.onClick}
                  className="mt-2 text-xs font-semibold text-[var(--gold)] hover:underline"
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => hideToast(toast.id)}
              aria-label="Fechar notificação"
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
