import * as React from "react";
import { cn } from "@/lib/utils";
import { FileText, Trash2, X } from "lucide-react";

export interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  currentPreview?: string | null;
  currentAlt?: string;
  uploading?: boolean;
  error?: string;
  id?: string;
  label?: string;
  hint?: string;
}

export function FileUploader({
  onFilesSelected,
  onRemove,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
  maxFiles = 1,
  currentPreview,
  currentAlt,
  uploading = false,
  error,
  id = "file-upload",
  label = "Upload a file",
  hint,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const hiddenFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter(
      (f) =>
        f.size <= maxSize &&
        (accept ? f.type.match(accept.replace("*", ".*")) : true)
    );
    if (validFiles.length > 0) {
      onFilesSelected(validFiles.slice(0, maxFiles));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleClick = () => {
    if (uploading) return;
    hiddenFileInputRef.current?.click();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-2">
      {currentPreview ? (
        <div className="relative inline-block">
          <img
            src={currentPreview}
            alt={currentAlt || "uploaded preview"}
            className="h-32 w-32 rounded-xl object-cover"
          />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              disabled={uploading}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors",
            "border-neutral-300 bg-neutral-50 hover:bg-neutral-100",
            isDragOver && "border-foundation-400 bg-foundation-50",
            error && "border-red-300",
            uploading && "pointer-events-none opacity-60"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <input
            ref={hiddenFileInputRef}
            id={id}
            type="file"
            accept={accept}
            max={maxFiles}
            multiple={maxFiles > 1}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            aria-label={label}
          />
          <FileText className="h-10 w-10 text-neutral-400" />
          <span className="mt-2 text-sm font-medium text-neutral-700">
            {label}
          </span>
          {hint && (
            <span className="text-xs text-neutral-500">{hint}</span>
          )}
          <span className="text-xs text-neutral-400 mt-1">
            Max: {formatBytes(maxSize)}
          </span>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
