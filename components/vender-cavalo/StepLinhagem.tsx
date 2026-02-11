"use client";

import { Upload, CheckCircle, FileText } from "lucide-react";
import type { StepProps, Documentos, DocumentType } from "@/components/vender-cavalo/types";

interface StepLinhagemProps extends StepProps {
  documentos: Documentos;
  onDocUpload: (type: DocumentType, file: File) => void;
}

export default function StepLinhagem({
  formData,
  updateField,
  documentos,
  onDocUpload,
}: StepLinhagemProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center text-black text-sm font-bold">
          3
        </span>
        Linhagem e Documentação
      </h2>

      <div className="space-y-6">
        {/* Pai */}
        <div>
          <h3 className="text-sm font-medium text-[#C5A059] mb-3">Pai</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Nome do Pai *</label>
              <input
                type="text"
                required
                minLength={2}
                value={formData.pai_nome}
                onChange={(e) => updateField("pai_nome", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Registo APSL do Pai *</label>
              <input
                type="text"
                required
                value={formData.pai_registo}
                onChange={(e) => updateField("pai_registo", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>

        {/* Mãe */}
        <div>
          <h3 className="text-sm font-medium text-[#C5A059] mb-3">Mãe</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Nome da Mãe *</label>
              <input
                type="text"
                required
                minLength={2}
                value={formData.mae_nome}
                onChange={(e) => updateField("mae_nome", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Registo APSL da Mãe *</label>
              <input
                type="text"
                required
                value={formData.mae_registo}
                onChange={(e) => updateField("mae_registo", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>

        {/* Coudelaria */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Coudelaria de Origem</label>
          <input
            type="text"
            value={formData.coudelaria_origem}
            onChange={(e) => updateField("coudelaria_origem", e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
            placeholder="Nome da coudelaria onde nasceu"
          />
        </div>

        {/* Upload Documentos */}
        <div className="border-t border-zinc-800 pt-6">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <FileText size={18} className="text-[#C5A059]" />
            Upload de Documentos Obrigatórios
          </h3>

          <div className="space-y-4">
            {/* Livro Azul */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Livro Azul (APSL) *</span>
                {documentos.livroAzul && <CheckCircle size={18} className="text-green-400" />}
              </div>
              <p className="text-xs text-zinc-500 mb-3">Cópia do registo oficial do cavalo</p>
              <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-zinc-600 rounded-lg cursor-pointer hover:border-[#C5A059] transition-colors touch-manipulation">
                <Upload size={18} className="text-zinc-500" />
                <span className="text-sm text-zinc-400">
                  {documentos.livroAzul
                    ? documentos.livroAzul.name
                    : "Escolher ficheiro (PDF ou imagem)"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && onDocUpload("livroAzul", e.target.files[0])
                  }
                />
              </label>
            </div>

            {/* Passaporte */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Passaporte Equino</span>
                {documentos.passaporte && <CheckCircle size={18} className="text-green-400" />}
              </div>
              <p className="text-xs text-zinc-500 mb-3">Documento de identificação europeu</p>
              <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-zinc-600 rounded-lg cursor-pointer hover:border-[#C5A059] transition-colors touch-manipulation">
                <Upload size={18} className="text-zinc-500" />
                <span className="text-sm text-zinc-400">
                  {documentos.passaporte ? documentos.passaporte.name : "Escolher ficheiro"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && onDocUpload("passaporte", e.target.files[0])
                  }
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
