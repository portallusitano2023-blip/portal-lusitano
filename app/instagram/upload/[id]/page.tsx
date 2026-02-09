"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload, Check, Loader2, FileImage, FileVideo, Instagram, Send } from "lucide-react";

export default function InstagramUploadPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [formData, setFormData] = useState({
    caption: "",
    hashtags: "",
    link: "",
    observacoes: "",
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, 5)); // Max 5 files
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Por favor adicione pelo menos 1 ficheiro");
      return;
    }

    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("sessionId", sessionId);
      uploadFormData.append("caption", formData.caption);
      uploadFormData.append("hashtags", formData.hashtags);
      uploadFormData.append("link", formData.link);
      uploadFormData.append("observacoes", formData.observacoes);

      files.forEach((file, index) => {
        uploadFormData.append(`file${index}`, file);
      });

      const response = await fetch("/api/instagram/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload");
      }

      setUploaded(true);

      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: unknown) {
      console.error("Upload error:", error);
      alert(`Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    } finally {
      setUploading(false);
    }
  };

  if (uploaded) {
    return (
      <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-green-500" size={40} />
          </div>
          <h1 className="text-3xl font-serif text-white mb-4">Materiais Recebidos!</h1>
          <p className="text-zinc-400 mb-6">
            Obrigado! Recebemos os seus materiais e vamos publicar no Instagram nas próximas 48
            horas.
          </p>
          <p className="text-zinc-500 text-sm">A redirecionar...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Instagram className="text-white" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">Upload de Materiais</h1>
          <p className="text-zinc-400">Envie as imagens/vídeos e instruções para a publicação</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-xl">
            <h2 className="text-xl font-serif text-white mb-4">1. Imagens/Vídeos</h2>
            <label className="block border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-[#C5A059] transition-colors">
              <Upload className="text-zinc-500 mx-auto mb-4" size={48} />
              <p className="text-white font-medium mb-2">Clique para seleccionar ficheiros</p>
              <p className="text-zinc-500 text-sm">Máximo 5 ficheiros (imagens ou vídeos)</p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Preview dos ficheiros */}
            {files.length > 0 && (
              <div className="mt-6 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-zinc-800 p-3 rounded"
                  >
                    <div className="flex items-center gap-3">
                      {file.type.startsWith("image/") ? (
                        <FileImage className="text-[#C5A059]" size={20} />
                      ) : (
                        <FileVideo className="text-[#C5A059]" size={20} />
                      )}
                      <span className="text-white text-sm">{file.name}</span>
                      <span className="text-zinc-500 text-xs">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-xl">
            <h2 className="text-xl font-serif text-white mb-4">2. Caption e Hashtags</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Caption do Post</label>
                <textarea
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  rows={4}
                  className="w-full bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none resize-none"
                  placeholder="Escreva a caption para o post..."
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Hashtags (opcional)</label>
                <input
                  type="text"
                  value={formData.hashtags}
                  onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                  className="w-full bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none"
                  placeholder="#lusitano #cavalos #portugal"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Link (se aplicável)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-xl">
            <h2 className="text-xl font-serif text-white mb-4">3. Observações Adicionais</h2>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={3}
              className="w-full bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none resize-none"
              placeholder="Alguma instrução especial? Melhor dia/hora para publicar?"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || files.length === 0}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-4 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={18} />A enviar...
              </>
            ) : (
              <>
                <Send size={18} />
                Enviar Materiais
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
