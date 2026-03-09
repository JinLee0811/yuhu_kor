'use client';

import { X } from 'lucide-react';

interface Props {
  open: boolean;
  selectedSpecialties: string[];
  selectedCity: string;
  minScore: number;
  onClose: () => void;
  onApply: (next: { specialties: string[]; city: string; minScore: number }) => void;
}

const specialties = ['어학연수', '대학진학', 'TAFE', 'VET'];
const cities = ['시드니', '멜버른', '브리즈번', '퍼스', '골드코스트'];

export function FilterBottomSheet({ open, selectedSpecialties, selectedCity, minScore, onClose, onApply }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30">
      <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3>필터</h3>
          <button type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-body2 font-semibold">전문분야</p>
          <div className="flex flex-wrap gap-2">
            {specialties.map((item) => {
              const active = selectedSpecialties.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => {
                    const next = active
                      ? selectedSpecialties.filter((value) => value !== item)
                      : [...selectedSpecialties, item];
                    onApply({ specialties: next, city: selectedCity, minScore });
                  }}
                  className={`rounded-lg px-3 py-2 text-body2 ${active ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-body2 font-semibold">커버 도시</p>
          <select
            value={selectedCity}
            onChange={(event) => onApply({ specialties: selectedSpecialties, city: event.target.value, minScore })}
            className="h-10 w-full rounded-lg border border-border bg-card px-3 text-body2"
          >
            <option value="">전체</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-body2 font-semibold">최소 평점: {minScore.toFixed(1)}</p>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={minScore}
            onChange={(event) =>
              onApply({ specialties: selectedSpecialties, city: selectedCity, minScore: Number(event.target.value) })
            }
            className="w-full"
          />
        </div>

        <button onClick={onClose} className="h-11 w-full rounded-lg bg-accent text-body2 font-semibold text-accent-foreground">
          적용
        </button>
      </div>
    </div>
  );
}
