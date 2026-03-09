'use client';

import { Search, SlidersHorizontal } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, onFilterClick, placeholder = '유학원 이름 검색' }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-body2 outline-none ring-0 focus:border-ring"
        />
      </div>
      {onFilterClick ? (
        <button onClick={onFilterClick} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card">
          <SlidersHorizontal className="h-4 w-4 text-foreground" />
        </button>
      ) : null}
    </div>
  );
}
