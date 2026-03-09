'use client';

interface Props {
  items: string[];
  active: string;
  onChange: (item: string) => void;
}

export function FilterChips({ items, active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`whitespace-nowrap rounded-lg px-3 py-2 text-body2 font-medium ${active === item ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
