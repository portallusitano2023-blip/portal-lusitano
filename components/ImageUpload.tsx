"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  folder?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait";
}

export default function ImageUpload({
  onUpload,
  currentImage,
  folder = "uploads",
  className = "",
  aspectRatio = "video",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  };

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validar tipo
      if (!file.type.startsWith("image/")) {
        setError("Por favor selecione uma imagem");
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Imagem demasiado grande. Maximo 5MB.");
        return;
      }

      // Preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro no upload");
        }

        onUpload(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao fazer upload");
        setPreview(currentImage || null);
      } finally {
        setUploading(false);
      }
    },
    [folder, currentImage, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <div
        className={`relative ${aspectClasses[aspectRatio]} bg-gray-100 border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
          dragOver ? "border-amber-500 bg-amber-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Preview da imagem"
              fill
              className="object-cover"
              unoptimized
            />
            {/* Overlay com botoes */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                disabled={uploading}
              >
                <Upload size={20} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                disabled={uploading}
              >
                <X size={20} />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700"
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
            ) : (
              <>
                <ImageIcon className="w-10 h-10 mb-2" />
                <span className="text-sm font-medium">Clique ou arraste uma imagem</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, WebP ate 5MB</span>
              </>
            )}
          </button>
        )}

        {/* Loading overlay */}
        {uploading && preview && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

// Componente para multiplas imagens
interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
  maxImages?: number;
}

export function MultiImageUpload({
  images,
  onChange,
  folder = "uploads",
  maxImages = 10,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const remainingSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of filesToUpload) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          newUrls.push(data.url);
        }
      } catch (err) {
        console.error("Erro ao fazer upload:", err);
      }
    }

    onChange([...images, ...newUrls]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
          >
            <Image
              src={url}
              alt={`Imagem ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 mb-1" />
                <span className="text-xs">Adicionar</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />

      <p className="text-xs text-gray-500 mt-2">
        {images.length}/{maxImages} imagens
      </p>
    </div>
  );
}
