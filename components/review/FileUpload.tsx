'use client';

import { Paperclip, X } from 'lucide-react';

interface FileUploadProps {
  label: string;
  fileName?: string;
  onSelect: (file?: File) => void;
  onRemove: () => void;
  primary?: boolean;
}

export function FileUpload({ label, fileName, onSelect, onRemove, primary = false }: FileUploadProps) {
  return (
    <div>
      <label
        className={`flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-body2 font-medium transition-colors ${
          primary
            ? 'border-accent bg-accent text-accent-foreground hover:opacity-90'
            : 'border-border bg-card text-foreground hover:bg-muted'
        }`}
      >
        <Paperclip className="h-4 w-4" />
        {label}
        <input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(event) => {
            // TODO: connect actual upload API/storage when backend wiring starts.
            onSelect(event.target.files?.[0]);
          }}
        />
      </label>

      {fileName ? (
        <div className="mt-2 flex items-center justify-between rounded-md bg-muted px-3 py-2 text-caption text-foreground">
          <span className="line-clamp-1">{fileName}</span>
          <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
