'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { agencySchema, entities } from '@/lib/mock-db';
import { Step1BasicInfo } from '@/components/review/ReviewForm/Step1BasicInfo';
import { Step2Scores } from '@/components/review/ReviewForm/Step2Scores';
import { Step3Text } from '@/components/review/ReviewForm/Step3Text';

export function ReviewForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedAgencyId, setSelectedAgencyId] = useState('');
  const [year, setYear] = useState('');
  const [purpose, setPurpose] = useState('');
  const [city, setCity] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [summary, setSummary] = useState('');

  const canStep1 = Boolean(selectedAgencyId && year && purpose && city);
  const canStep2 = agencySchema.every((item) => (scores[item.key] ?? 0) > 0);
  const canSubmit = pros.trim().length >= 20 && cons.trim().length >= 20 && summary.trim().length > 0;

  const title = useMemo(() => (step === 1 ? '어떤 경험이었어요?' : step === 2 ? '항목별 별점' : '텍스트 후기'), [step]);

  const submit = async () => {
    if (!canSubmit) return;

    const response = await fetch('/api/v1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entity_id: selectedAgencyId,
        scores,
        pros,
        cons,
        summary,
        meta: {
          used_year: Number(year),
          purpose,
          destination_city: city
        }
      })
    });

    if (!response.ok) {
      toast.error('후기 등록에 실패했어요.');
      return;
    }

    toast.success('후기가 등록됐어요!');
    router.push('/mypage');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
      <div className="mb-5 rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <h1>{title}</h1>
          <span className="text-body2 text-muted-foreground">{step}/3</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? 'bg-accent' : 'bg-muted'}`} />
          ))}
        </div>
      </div>

      {step === 1 ? (
        <Step1BasicInfo
          agencies={entities.filter((entity) => entity.category_id === 'cat-agency')}
          selectedAgencyId={selectedAgencyId}
          year={year}
          purpose={purpose}
          city={city}
          onChange={(next) => {
            if (next.selectedAgencyId !== undefined) setSelectedAgencyId(next.selectedAgencyId);
            if (next.year !== undefined) setYear(next.year);
            if (next.purpose !== undefined) setPurpose(next.purpose);
            if (next.city !== undefined) setCity(next.city);
          }}
        />
      ) : null}

      {step === 2 ? (
        <Step2Scores
          items={agencySchema.map((item) => ({ key: item.key, label: item.label }))}
          scores={scores}
          onChange={(key, value) => setScores((prev) => ({ ...prev, [key]: value }))}
        />
      ) : null}

      {step === 3 ? (
        <Step3Text
          pros={pros}
          cons={cons}
          summary={summary}
          onChange={(next) => {
            if (next.pros !== undefined) setPros(next.pros);
            if (next.cons !== undefined) setCons(next.cons);
            if (next.summary !== undefined) setSummary(next.summary);
          }}
        />
      ) : null}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          className="h-11 rounded-lg border border-border bg-card px-4 text-body2"
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          disabled={step === 1}
        >
          이전
        </button>
        {step < 3 ? (
          <button
            type="button"
            className="h-11 flex-1 rounded-lg bg-accent px-4 text-body2 font-semibold text-accent-foreground disabled:opacity-50"
            onClick={() => setStep((prev) => prev + 1)}
            disabled={(step === 1 && !canStep1) || (step === 2 && !canStep2)}
          >
            다음
          </button>
        ) : (
          <button
            type="button"
            className="h-11 flex-1 rounded-lg bg-accent px-4 text-body2 font-semibold text-accent-foreground disabled:opacity-50"
            onClick={submit}
            disabled={!canSubmit}
          >
            제출하기
          </button>
        )}
      </div>
    </div>
  );
}
