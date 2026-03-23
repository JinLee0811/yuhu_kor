'use client';

import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, Save, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import type { ApiResponse } from '@/lib/api';
import type { School } from '@/types/school';

const SCHOOL_TYPE_LABEL: Record<School['type'], string> = {
  university: '대학교',
  tafe: 'TAFE',
  language: '어학원',
  college: '컬리지',
  rto: 'RTO',
  foundation: '파운데이션',
};

const CITIES = ['시드니', '멜버른', '브리즈번', '퍼스', '애들레이드', '골드코스트', '기타'];

type SchoolForm = {
  id?: string;
  name: string;
  type: School['type'];
  city: string;
  description: string;
  fields: string;
  address: string;
  website: string;
  tuitionRange: string;
  intakePeriods: string;
  cricosCode: string;
  programs: string;
  featureTags: string;
  logoText: string;
  ieltsUndergrad: string;
  ieltsPostgrad: string;
  ieltsDiploma: string;
  ieltsNote: string;
  qsWorld: string;
  qsAustralia: string;
  scholarships: { name: string; amount: string; condition: string }[];
};

const EMPTY_FORM: SchoolForm = {
  name: '',
  type: 'university',
  city: '시드니',
  description: '',
  fields: '',
  address: '',
  website: '',
  tuitionRange: '',
  intakePeriods: '',
  cricosCode: '',
  programs: '',
  featureTags: '',
  logoText: '',
  ieltsUndergrad: '',
  ieltsPostgrad: '',
  ieltsDiploma: '',
  ieltsNote: '',
  qsWorld: '',
  qsAustralia: '',
  scholarships: []
};

function splitCsv(val: string) {
  return val.split(',').map((s) => s.trim()).filter(Boolean);
}

function toForm(s: School): SchoolForm {
  return {
    id: s.id,
    name: s.name,
    type: s.type,
    city: s.city,
    description: s.description,
    fields: s.fields.join(', '),
    address: s.address,
    website: s.website,
    tuitionRange: s.tuitionRange,
    intakePeriods: s.intakePeriods.join(', '),
    cricosCode: s.cricosCode ?? '',
    programs: (s.programs ?? []).join(', '),
    featureTags: (s.featureTags ?? []).join(', '),
    logoText: s.logoText ?? '',
    ieltsUndergrad: String(s.ieltsRequirement?.undergraduate ?? ''),
    ieltsPostgrad: String(s.ieltsRequirement?.postgraduate ?? ''),
    ieltsDiploma: String(s.ieltsRequirement?.diploma ?? ''),
    ieltsNote: s.ieltsRequirement?.note ?? '',
    qsWorld: String(s.qsRanking?.world ?? ''),
    qsAustralia: String(s.qsRanking?.australia ?? ''),
    scholarships: (s.scholarships ?? []).map((sc) => ({ ...sc }))
  };
}

function toPayload(form: SchoolForm) {
  return {
    name: form.name,
    type: form.type,
    city: form.city,
    description: form.description,
    fields: splitCsv(form.fields),
    address: form.address,
    website: form.website,
    tuitionRange: form.tuitionRange,
    intakePeriods: splitCsv(form.intakePeriods),
    cricosCode: form.cricosCode || null,
    programs: splitCsv(form.programs),
    featureTags: splitCsv(form.featureTags),
    logoText: form.logoText,
    ieltsRequirement: {
      undergraduate: form.ieltsUndergrad ? Number(form.ieltsUndergrad) : undefined,
      postgraduate: form.ieltsPostgrad ? Number(form.ieltsPostgrad) : undefined,
      diploma: form.ieltsDiploma ? Number(form.ieltsDiploma) : undefined,
      note: form.ieltsNote || undefined
    },
    qsRanking: {
      world: form.qsWorld ? Number(form.qsWorld) : undefined,
      australia: form.qsAustralia ? Number(form.qsAustralia) : undefined
    },
    scholarships: form.scholarships.filter((s) => s.name.trim())
  };
}

export default function AdminSchoolsPage() {
  const [items, setItems] = useState<School[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<SchoolForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState<School['type'] | 'all'>('all');

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/schools');
      const json: ApiResponse<School[]> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '');
      setItems(json.data);
    } catch {
      toast.error('학교 목록을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filteredItems = useMemo(() => {
    if (typeFilter === 'all') return items;
    return items.filter((s) => s.type === typeFilter);
  }, [items, typeFilter]);

  const up = <K extends keyof SchoolForm>(key: K, value: SchoolForm[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSelect = (s: School) => {
    setSelectedId(s.id);
    setForm(toForm(s));
  };

  const handleReset = () => {
    setSelectedId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('학교 이름은 꼭 입력해 주세요.');
      return;
    }
    try {
      setSaving(true);
      const payload = toPayload(form);
      const url = selectedId ? `/api/v1/admin/schools/${selectedId}` : '/api/v1/admin/schools';
      const method = selectedId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json: ApiResponse<School> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '저장에 실패했어요.');
      toast.success(selectedId ? '학교 정보를 수정했어요.' : '학교를 추가했어요.');
      await load();
      setSelectedId(json.data.id);
      setForm(toForm(json.data));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '저장에 실패했어요.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!confirm('학교를 삭제할까요? 이 작업은 되돌릴 수 없어요.')) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/v1/admin/schools/${selectedId}`, { method: 'DELETE' });
      const json: ApiResponse<{ id: string }> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '');
      toast.success('학교를 삭제했어요.');
      await load();
      handleReset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '삭제에 실패했어요.');
    } finally {
      setSaving(false);
    }
  };

  const addScholarship = () =>
    up('scholarships', [...form.scholarships, { name: '', amount: '', condition: '' }]);
  const removeScholarship = (idx: number) =>
    up('scholarships', form.scholarships.filter((_, i) => i !== idx));
  const updateScholarship = (idx: number, key: keyof SchoolForm['scholarships'][0], value: string) =>
    up('scholarships', form.scholarships.map((s, i) => (i === idx ? { ...s, [key]: value } : s)));

  if (loading) return <div className="min-h-[400px] animate-pulse rounded-2xl bg-muted" />;

  const inputCls = 'h-11 w-full rounded-xl border border-border bg-background px-3 text-body2 focus:border-accent focus:outline-none';
  const labelCls = 'mb-1.5 block text-body2 font-semibold text-foreground';

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">학교 관리</h1>
          <p className="mt-1 text-body2 text-muted-foreground">호주 대학교, TAFE, 어학원 정보를 관리해요.</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-body2 font-semibold text-accent-foreground"
        >
          <Plus className="h-4 w-4" />
          새 학교
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        {/* 학교 목록 */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          {/* 유형 필터 */}
          <div className="mb-3 flex flex-wrap gap-1">
            {(['all', 'university', 'tafe', 'language', 'college', 'rto', 'foundation'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`rounded-lg px-2.5 py-1 text-caption font-medium transition-colors ${
                  typeFilter === t ? 'bg-accent text-accent-foreground' : 'bg-muted/60 text-muted-foreground'
                }`}
              >
                {t === 'all' ? '전체' : SCHOOL_TYPE_LABEL[t]}
              </button>
            ))}
          </div>

          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
            {filteredItems.map((s) => {
              const active = selectedId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelect(s)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    active ? 'border-accent bg-accent/5' : 'border-border bg-background hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-caption font-bold text-accent">
                      {s.logoText ?? s.name.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{s.name}</p>
                      <p className="text-caption text-muted-foreground">
                        {s.city} · {SCHOOL_TYPE_LABEL[s.type]}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 편집 폼 */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">{selectedId ? '학교 수정' : '학교 추가'}</h2>
            {selectedId && (
              <button type="button" onClick={handleReset} className="text-caption text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
            {/* 기본 정보 */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>학교명</label>
                <input value={form.name} onChange={(e) => up('name', e.target.value)} className={inputCls} placeholder="University of Sydney" />
              </div>
              <div>
                <label className={labelCls}>로고 텍스트</label>
                <input value={form.logoText} onChange={(e) => up('logoText', e.target.value)} className={inputCls} placeholder="SY" maxLength={4} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>유형</label>
                <select value={form.type} onChange={(e) => up('type', e.target.value as School['type'])} className={inputCls}>
                  {Object.entries(SCHOOL_TYPE_LABEL).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>도시</label>
                <select value={form.city} onChange={(e) => up('city', e.target.value)} className={inputCls}>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>학교 소개</label>
              <textarea value={form.description} onChange={(e) => up('description', e.target.value)} rows={3}
                className="w-full rounded-xl border border-border bg-background px-3 py-3 text-body2 focus:border-accent focus:outline-none" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>웹사이트</label>
                <input value={form.website} onChange={(e) => up('website', e.target.value)} className={inputCls} placeholder="https://..." />
              </div>
              <div>
                <label className={labelCls}>CRICOS 코드</label>
                <input value={form.cricosCode} onChange={(e) => up('cricosCode', e.target.value)} className={inputCls} placeholder="00026A" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>학비 범위</label>
                <input value={form.tuitionRange} onChange={(e) => up('tuitionRange', e.target.value)} className={inputCls} placeholder="AUD 34,000 – 60,000 / year" />
              </div>
              <div>
                <label className={labelCls}>주소</label>
                <input value={form.address} onChange={(e) => up('address', e.target.value)} className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>입학 시기 <span className="font-normal text-muted-foreground">(쉼표 구분)</span></label>
              <input value={form.intakePeriods} onChange={(e) => up('intakePeriods', e.target.value)} className={inputCls} placeholder="2월, 7월" />
            </div>

            <div>
              <label className={labelCls}>전공 분야 <span className="font-normal text-muted-foreground">(쉼표 구분)</span></label>
              <input value={form.fields} onChange={(e) => up('fields', e.target.value)} className={inputCls} placeholder="IT, 비즈니스, 법학" />
            </div>

            <div>
              <label className={labelCls}>대표 프로그램 <span className="font-normal text-muted-foreground">(쉼표 구분)</span></label>
              <input value={form.programs} onChange={(e) => up('programs', e.target.value)} className={inputCls} placeholder="Bachelor of Commerce, Master of IT" />
            </div>

            <div>
              <label className={labelCls}>특징 태그 <span className="font-normal text-muted-foreground">(쉼표 구분)</span></label>
              <input value={form.featureTags} onChange={(e) => up('featureTags', e.target.value)} className={inputCls} placeholder="QS 세계 18위, 캠퍼스 만족도 최상" />
            </div>

            {/* IELTS */}
            <div>
              <label className={labelCls}>IELTS 입학 요건</label>
              <div className="grid gap-2 sm:grid-cols-3">
                <div>
                  <p className="mb-1 text-caption text-muted-foreground">학부</p>
                  <input value={form.ieltsUndergrad} onChange={(e) => up('ieltsUndergrad', e.target.value)} className={inputCls} placeholder="6.5" type="number" step="0.5" />
                </div>
                <div>
                  <p className="mb-1 text-caption text-muted-foreground">대학원</p>
                  <input value={form.ieltsPostgrad} onChange={(e) => up('ieltsPostgrad', e.target.value)} className={inputCls} placeholder="7.0" type="number" step="0.5" />
                </div>
                <div>
                  <p className="mb-1 text-caption text-muted-foreground">디플로마</p>
                  <input value={form.ieltsDiploma} onChange={(e) => up('ieltsDiploma', e.target.value)} className={inputCls} placeholder="6.0" type="number" step="0.5" />
                </div>
              </div>
              <input value={form.ieltsNote} onChange={(e) => up('ieltsNote', e.target.value)} className={`${inputCls} mt-2`} placeholder="각 밴드 6.0 이상 (비고)" />
            </div>

            {/* QS 순위 */}
            <div>
              <label className={labelCls}>QS 순위 (2025)</label>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-caption text-muted-foreground">세계</p>
                  <input value={form.qsWorld} onChange={(e) => up('qsWorld', e.target.value)} className={inputCls} placeholder="18" type="number" />
                </div>
                <div>
                  <p className="mb-1 text-caption text-muted-foreground">호주</p>
                  <input value={form.qsAustralia} onChange={(e) => up('qsAustralia', e.target.value)} className={inputCls} placeholder="3" type="number" />
                </div>
              </div>
            </div>

            {/* 장학금 */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className={labelCls + ' mb-0'}>장학금</label>
                <button type="button" onClick={addScholarship} className="flex items-center gap-1 text-caption text-accent hover:underline">
                  <Plus className="h-3.5 w-3.5" /> 추가
                </button>
              </div>
              <div className="space-y-2">
                {form.scholarships.map((sc, idx) => (
                  <div key={idx} className="rounded-xl border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-2">
                        <input value={sc.name} onChange={(e) => updateScholarship(idx, 'name', e.target.value)}
                          className={inputCls} placeholder="장학금명" />
                        <input value={sc.amount} onChange={(e) => updateScholarship(idx, 'amount', e.target.value)}
                          className={inputCls} placeholder="AUD 10,000 / 등록금 25%" />
                        <input value={sc.condition} onChange={(e) => updateScholarship(idx, 'condition', e.target.value)}
                          className={inputCls} placeholder="수혜 조건" />
                      </div>
                      <button type="button" onClick={() => removeScholarship(idx)} className="mt-1 text-muted-foreground hover:text-negative">
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {form.scholarships.length === 0 && (
                  <p className="text-caption text-muted-foreground">+ 추가 버튼으로 장학금 정보를 입력해요.</p>
                )}
              </div>
            </div>
          </div>

          {/* 저장/삭제 버튼 */}
          <div className="mt-4 flex gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3 font-semibold text-accent-foreground disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {selectedId ? '수정 저장' : '학교 추가'}
            </button>
            {selectedId && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl border border-negative px-4 py-3 font-semibold text-negative disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                삭제
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
