"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload, Check, Loader2, FileImage, FileVideo, Instagram, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function InstagramUploadPage() {
  const { t } = useLanguage();
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
      alert(t.instagram_upload.error_no_files);
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
        throw new Error(t.instagram_upload.error_upload);
      }

      setUploaded(true);

      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: unknown) {
      if (process.env.NODE_ENV === "development") console.error("[InstagramUpload]", error);
      alert(
        `${t.instagram_upload.error_upload}: ${error instanceof Error ? error.message : t.instagram_upload.error_unknown}`
      );
    } finally {
      setUploading(false);
    }
  };

  if (uploaded) {
    return (
      <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-green-500" size={40} />
          </div>
          <h1 className="text-3xl font-serif text-[var(--foreground)] mb-4">
            {t.instagram_upload.materials_received}
          </h1>
          <p className="text-[var(--foreground-secondary)] mb-6">
            {t.instagram_upload.materials_received_desc}
          </p>
          <p className="text-[var(--foreground-muted)] text-sm">{t.instagram_upload.redirecting}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Instagram className="text-[var(--foreground)]" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-4">
            {t.instagram_upload.title}
          </h1>
          <p className="text-[var(--foreground-secondary)]">{t.instagram_upload.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] p-8 rounded-xl">
            <h2 className="text-xl font-serif text-[var(--foreground)] mb-4">
              {t.instagram_upload.section_files}
            </h2>
            <label className="block border-2 border-dashed border-[var(--border)] rounded-xl p-12 text-center cursor-pointer hover:border-[var(--gold)] transition-colors">
              <Upload className="text-[var(--foreground-muted)] mx-auto mb-4" size={48} />
              <p className="text-[var(--foreground)] font-medium mb-2">
                {t.instagram_upload.click_to_select}
              </p>
              <p className="text-[var(--foreground-muted)] text-sm">
                {t.instagram_upload.max_files}
              </p>
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
                    className="flex items-center justify-between bg-[var(--background-card)] p-3 rounded"
                  >
                    <div className="flex items-center gap-3">
                      {file.type.startsWith("image/") ? (
                        <FileImage className="text-[var(--gold)]" size={20} />
                      ) : (
                        <FileVideo className="text-[var(--gold)]" size={20} />
                      )}
                      <span className="text-[var(--foreground)] text-sm">{file.name}</span>
                      <span className="text-[var(--foreground-muted)] text-xs">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      {t.instagram_upload.btn_remove}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] p-8 rounded-xl">
            <h2 className="text-xl font-serif text-[var(--foreground)] mb-4">
              {t.instagram_upload.section_caption}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                  {t.instagram_upload.field_caption}
                </label>
                <textarea
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  rows={4}
                  className="w-full bg-[var(--background-card)] border border-[var(--border)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--gold)] focus:outline-none resize-none"
                  placeholder={t.instagram_upload.field_caption_placeholder}
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                  {t.instagram_upload.field_hashtags}
                </label>
                <input
                  type="text"
                  value={formData.hashtags}
                  onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                  className="w-full bg-[var(--background-card)] border border-[var(--border)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--gold)] focus:outline-none"
                  placeholder={t.instagram_upload.field_hashtags_placeholder}
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                  {t.instagram_upload.field_link}
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-[var(--background-card)] border border-[var(--border)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--gold)] focus:outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] p-8 rounded-xl">
            <h2 className="text-xl font-serif text-[var(--foreground)] mb-4">
              {t.instagram_upload.section_notes}
            </h2>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={3}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--gold)] focus:outline-none resize-none"
              placeholder={t.instagram_upload.field_notes_placeholder}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || files.length === 0}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-[var(--foreground)] py-4 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                {t.instagram_upload.btn_submitting}
              </>
            ) : (
              <>
                <Send size={18} />
                {t.instagram_upload.btn_submit}
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
