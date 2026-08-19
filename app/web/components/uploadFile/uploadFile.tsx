"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

interface FileUploadProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  accept?: string;
  maxSizeInMB?: number;
  disabled?: boolean;
}

export default function FileUpload({
  value = null,
  onChange,
  accept = "image/*,.pdf",
  maxSizeInMB = 10,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(value);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setFile(value);
  }, [value]);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");

    if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
      setError(`O arquivo não pode ultrapassar ${maxSizeInMB} MB.`);
      event.target.value = "";
      return;
    }

    const isImage = selectedFile.type.startsWith("image/");
    const isPdf = selectedFile.type === "application/pdf";

    if (!isImage && !isPdf) {
      setError("Selecione uma imagem ou um arquivo PDF.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
    onChange?.(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onChange?.(null);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {!file && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="flex min-h-40 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="mb-3 text-4xl">📁</span>

          <span className="text-sm font-medium text-gray-700">
            Clique para selecionar um arquivo
          </span>

          <span className="mt-1 text-xs text-gray-500">
            Imagem ou PDF até {maxSizeInMB} MB
          </span>
        </button>
      )}

      {file && (
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
          {previewUrl ? (
            <div className="flex max-h-80 justify-center bg-gray-100">
              <img
                src={previewUrl}
                alt={file.name}
                className="max-h-80 max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex min-h-40 flex-col items-center justify-center bg-gray-50">
              <span className="text-6xl">📄</span>

              <span className="mt-3 max-w-[80%] truncate text-sm font-medium">
                {file.name}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t p-3">
            <span className="truncate text-sm text-gray-600">{file.name}</span>

            <button
              type="button"
              onClick={handleRemove}
              className="shrink-0 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
            >
              Remover
            </button>
          </div>
        </div>
      )}

      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
