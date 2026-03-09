'use client';

import type { Entity } from '@/types/entity';

interface Props {
  agencies: Entity[];
  selectedAgencyId: string;
  year: string;
  purpose: string;
  city: string;
  onChange: (next: { selectedAgencyId?: string; year?: string; purpose?: string; city?: string }) => void;
}

const purposes = ['어학연수', '대학진학', 'TAFE', 'VET'];
const years = ['2026', '2025', '2024', '2023', '2022'];

export function Step1BasicInfo({ agencies, selectedAgencyId, year, purpose, city, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block font-semibold">유학원 선택 *</label>
        <select
          value={selectedAgencyId}
          onChange={(event) => onChange({ selectedAgencyId: event.target.value })}
          className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
        >
          <option value="">유학원을 선택하세요</option>
          {agencies.map((agency) => (
            <option key={agency.id} value={agency.id}>
              {agency.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block font-semibold">이용 연도 *</label>
        <select
          value={year}
          onChange={(event) => onChange({ year: event.target.value })}
          className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
        >
          <option value="">연도를 선택하세요</option>
          {years.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block font-semibold">이용 목적 *</label>
        <div className="flex flex-wrap gap-2">
          {purposes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onChange({ purpose: item })}
              className={`rounded-lg px-3 py-2 text-body2 ${item === purpose ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block font-semibold">보낸 도시 *</label>
        <input
          value={city}
          onChange={(event) => onChange({ city: event.target.value })}
          placeholder="예: 시드니"
          className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
        />
      </div>
    </div>
  );
}
