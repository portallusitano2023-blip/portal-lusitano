"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  removing?: boolean;
  onClose: () => void;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    icon: "text-green-400",
  },
  error: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    icon: "text-red-400",
  },
  warning: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    icon: "text-yellow-400",
  },
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    icon: "text-blue-400",
  },
};

export default function Toast({
  message,
  type = "info",
  duration = 5000,
  removing = false,
  onClose,
}: ToastProps) {
  const Icon = icons[type];
  const colorScheme = colors[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`${colorScheme.bg} ${colorScheme.border} border rounded-lg px-4 py-3 shadow-xl backdrop-blur-sm flex items-start gap-3 min-w-[320px] max-w-md ${removing ? "animate-[slideOutRight_0.3s_ease-out_forwards]" : "animate-[slideInRight_0.3s_ease-out_forwards]"}`}
    >
      <Icon className={`${colorScheme.icon} flex-shrink-0 mt-0.5`} size={20} />
      <p className={`${colorScheme.text} text-sm flex-1 font-medium`}>{message}</p>
      <button
        onClick={onClose}
        className={`${colorScheme.text} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Fechar notificação"
      >
        <X size={18} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type?: ToastType;
    duration?: number;
    removing?: boolean;
  }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            removing={toast.removing}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
