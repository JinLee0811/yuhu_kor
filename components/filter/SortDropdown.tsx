'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, options, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-body2"
      >
        {options.find((option) => option.value === value)?.label ?? options[0]?.label}
        <ChevronDown className="h-4 w-4" />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-20 mt-2 min-w-[140px] overflow-hidden rounded-lg border border-border bg-card shadow-md">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="block w-full px-3 py-2 text-left text-body2 hover:bg-muted"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
