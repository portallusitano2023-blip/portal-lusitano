"use client";

import { AlertCircle } from "lucide-react";

interface FormErrorsProps {
  errors: string[];
}

export default function FormErrors({ errors }: FormErrorsProps) {
  if (errors.length === 0) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-400 mb-2">
            Por favor corrija os seguintes erros:
          </p>
          <ul className="text-sm text-red-300 space-y-1">
            {errors.map((error, i) => (
              <li key={i}>&#8226; {error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
