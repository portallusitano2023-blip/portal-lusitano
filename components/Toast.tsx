"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
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
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`${colorScheme.bg} ${colorScheme.border} border rounded-lg px-4 py-3 shadow-xl backdrop-blur-sm flex items-start gap-3 min-w-[320px] max-w-md`}
    >
      <Icon className={`${colorScheme.icon} flex-shrink-0 mt-0.5`} size={20} />
      <p className={`${colorScheme.text} text-sm flex-1 font-medium`}>
        {message}
      </p>
      <button
        onClick={onClose}
        className={`${colorScheme.text} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Fechar notificação"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type?: ToastType;
    duration?: number;
  }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => onRemove(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
