'use client';

interface Props {
  pros: string;
  cons: string;
  summary: string;
  onChange: (next: { pros?: string; cons?: string; summary?: string }) => void;
}

export function Step3Text({ pros, cons, summary, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block font-semibold">장점 (최소 20자)</label>
        <textarea
          value={pros}
          onChange={(event) => onChange({ pros: event.target.value })}
          className="h-28 w-full rounded-lg border border-border bg-card p-3 text-body2"
        />
        <p className="text-caption text-muted-foreground">{pros.length}/500</p>
      </div>

      <div>
        <label className="mb-2 block font-semibold">단점 (최소 20자)</label>
        <textarea
          value={cons}
          onChange={(event) => onChange({ cons: event.target.value })}
          className="h-28 w-full rounded-lg border border-border bg-card p-3 text-body2"
        />
        <p className="text-caption text-muted-foreground">{cons.length}/500</p>
      </div>

      <div>
        <label className="mb-2 block font-semibold">한줄 요약 (최대 100자)</label>
        <input
          value={summary}
          maxLength={100}
          onChange={(event) => onChange({ summary: event.target.value })}
          className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
        />
        <p className="text-caption text-muted-foreground">{summary.length}/100</p>
      </div>
    </div>
  );
}
