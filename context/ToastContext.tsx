"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, ShoppingBag } from "lucide-react";

type ToastType = "success" | "error" | "info" | "cart";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  removing?: boolean;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
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
      const id = Math.random().toString(36).substr(2, 9);
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

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      case "error":
        return <AlertCircle className="text-red-500" size={20} />;
      case "info":
        return <Info className="text-blue-500" size={20} />;
      case "cart":
        return <ShoppingBag className="text-[#C5A059]" size={20} />;
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
        return "border-[#C5A059]/30";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`bg-[#0a0a0a] border ${getBorderColor(toast.type)} backdrop-blur-xl shadow-2xl rounded-sm px-5 py-4 flex items-center gap-4 min-w-[300px] max-w-[400px] ${toast.removing ? "animate-[slideOutRight_0.3s_ease-out_forwards]" : "animate-[slideInRight_0.3s_ease-out_forwards]"}`}
          >
            {getIcon(toast.type)}
            <p className="text-sm text-white flex-1">{toast.message}</p>
            <button
              onClick={() => hideToast(toast.id)}
              className="text-zinc-500 hover:text-white transition-colors"
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
