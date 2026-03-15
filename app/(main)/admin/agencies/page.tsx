'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Plus, Save, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ApiResponse } from '@/lib/api';
import type { Entity } from '@/types/entity';
import { useAuthStore } from '@/lib/store/auth';

interface EntitiesPayload {
  items: Entity[];
  total: number;
  nextPage: number | null;
}

type EntityForm = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  logo_url: string;
  headquarters_country: string;
  headquarters_address: string;
  coverage_cities: string;
  coverage_countries: string;
  specialties: string;
  tags: string;
  display_order: string;
  is_verified: boolean;
  qeac_verified: boolean;
  is_claimed: boolean;
};

const EMPTY_FORM: EntityForm = {
  slug: '',
  name: '',
  description: '',
  website: '',
  phone: '',
  email: '',
  logo_url: '',
  headquarters_country: 'AU',
  headquarters_address: '',
  coverage_cities: '',
  coverage_countries: 'AU',
  specialties: '',
  tags: '',
  display_order: '0',
  is_verified: false,
  qeac_verified: false,
  is_claimed: false
};

function splitCsv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toForm(entity: Entity): EntityForm {
  return {
    id: entity.id,
    slug: entity.slug,
    name: entity.name,
    description: entity.description ?? '',
    website: entity.website ?? '',
    phone: entity.phone ?? '',
    email: entity.email ?? '',
    logo_url: entity.logo_url ?? '',
    headquarters_country: entity.headquarters_country ?? 'AU',
    headquarters_address: entity.headquarters_address ?? '',
    coverage_cities: entity.coverage_cities.join(', '),
    coverage_countries: entity.coverage_countries.join(', '),
    specialties: entity.specialties.join(', '),
    tags: entity.tags.join(', '),
    display_order: String(entity.display_order ?? 0),
    is_verified: entity.is_verified,
    qeac_verified: Boolean(entity.qeac_verified),
    is_claimed: Boolean(entity.is_claimed)
  };
}

export default function AdminAgenciesPage() {
  const router = useRouter();
  const isReady = useAuthStore((state) => state.isReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const role = useAuthStore((state) => state.role);
  const [items, setItems] = useState<Entity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<EntityForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isReady && (!isLoggedIn || role !== 'admin')) {
      router.replace('/mypage');
    }
  }, [isLoggedIn, isReady, role, router]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/admin/entities', { cache: 'no-store' });
      const json: ApiResponse<EntitiesPayload> = await response.json();
      if (!response.ok || !json.data) {
        throw new Error(json.error?.message ?? '유학원 관리 목록을 불러오지 못했어요.');
      }
      setItems(json.data.items);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '유학원 목록을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady && isLoggedIn && role === 'admin') {
      void loadItems();
    }
  }, [isLoggedIn, isReady, role]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (a.display_order ?? Number.MAX_SAFE_INTEGER) - (b.display_order ?? Number.MAX_SAFE_INTEGER)),
    [items]
  );

  const updateForm = <K extends keyof EntityForm>(key: K, value: EntityForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelect = (entity: Entity) => {
    setSelectedId(entity.id);
    setForm(toForm(entity));
  };

  const handleReset = () => {
    setSelectedId(null);
    setForm({
      ...EMPTY_FORM,
      display_order: String(sortedItems.length + 1)
    });
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('이름과 slug는 꼭 입력해줘요.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        slug: form.slug,
        name: form.name,
        description: form.description,
        website: form.website,
        phone: form.phone,
        email: form.email,
        logo_url: form.logo_url,
        headquarters_country: form.headquarters_country,
        headquarters_address: form.headquarters_address,
        coverage_cities: splitCsv(form.coverage_cities),
        coverage_countries: splitCsv(form.coverage_countries),
        specialties: splitCsv(form.specialties),
        tags: splitCsv(form.tags),
        display_order: Number(form.display_order || 0),
        is_verified: form.is_verified,
        qeac_verified: form.qeac_verified,
        is_claimed: form.is_claimed
      };

      const response = await fetch(selectedId ? `/api/v1/admin/entities/${selectedId}` : '/api/v1/admin/entities', {
        method: selectedId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const json: ApiResponse<Entity> = await response.json();
      if (!response.ok || !json.data) {
        throw new Error(json.error?.message ?? '저장에 실패했어요.');
      }

      toast.success(selectedId ? '유학원 정보를 수정했어요.' : '유학원을 추가했어요.');
      await loadItems();
      setSelectedId(json.data.id);
      setForm(toForm(json.data));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '유학원 저장에 실패했어요.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      setSaving(true);
      const response = await fetch(`/api/v1/admin/entities/${selectedId}`, {
        method: 'DELETE'
      });
      const json: ApiResponse<{ id: string }> = await response.json();
      if (!response.ok || !json.data) {
        throw new Error(json.error?.message ?? '삭제에 실패했어요.');
      }
      toast.success('유학원을 삭제했어요.');
      await loadItems();
      handleReset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '유학원 삭제에 실패했어요.');
    } finally {
      setSaving(false);
    }
  };

  const moveItem = (id: string, direction: -1 | 1) => {
    const index = sortedItems.findIndex((item) => item.id === id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= sortedItems.length) return;

    const next = [...sortedItems];
    const [item] = next.splice(index, 1);
    next.splice(targetIndex, 0, item);
    setItems(
      next.map((entity, idx) => ({
        ...entity,
        display_order: idx + 1
      }))
    );
  };

  const handleSaveOrder = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/v1/admin/entities/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: sortedItems.map((item, index) => ({
            id: item.id,
            display_order: index + 1
          }))
        })
      });
      const json: ApiResponse<{ success: boolean }> = await response.json();
      if (!response.ok || !json.data) {
        throw new Error(json.error?.message ?? '순서 저장에 실패했어요.');
      }
      toast.success('유학원 노출 순서를 저장했어요.');
      await loadItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '순서 저장에 실패했어요.');
    } finally {
      setSaving(false);
    }
  };

  if (!isReady || loading) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-caption font-semibold text-accent">
              <ShieldCheck className="h-4 w-4" />
              Admin
            </div>
            <h1 className="font-bold text-foreground">유학원 관리</h1>
            <p className="mt-1 text-body2 text-muted-foreground">유학원 추가, 수정, 삭제와 노출 순서 조정을 여기서 할 수 있어요.</p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-body2 font-semibold text-accent-foreground"
          >
            <Plus className="h-4 w-4" />
            새 유학원
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">유학원 목록</h2>
              <button
                type="button"
                onClick={handleSaveOrder}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-body2 font-medium text-foreground disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                순서 저장
              </button>
            </div>
            <div className="space-y-3">
              {sortedItems.map((item, index) => {
                const active = selectedId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-3 transition-colors ${active ? 'border-accent bg-accent/5' : 'border-border bg-background'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button type="button" onClick={() => handleSelect(item)} className="min-w-0 flex-1 text-left">
                        <p className="mb-1 text-caption font-semibold text-accent">노출 순서 {index + 1}</p>
                        <p className="truncate font-semibold text-foreground">{item.name}</p>
                        <p className="mt-1 truncate text-caption text-muted-foreground">{item.slug}</p>
                      </button>
                      <div className="flex shrink-0 gap-1">
                        <button type="button" onClick={() => moveItem(item.id, -1)} className="rounded-lg border border-border p-2">
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => moveItem(item.id, 1)} className="rounded-lg border border-border p-2">
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-4 font-semibold text-foreground">{selectedId ? '유학원 수정' : '유학원 추가'}</h2>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-body2 font-semibold">이름</label>
                  <input value={form.name} onChange={(e) => updateForm('name', e.target.value)} className="h-11 w-full rounded-lg border border-border bg-background px-3" />
                </div>
                <div>
                  <label className="mb-2 block text-body2 font-semibold">Slug</label>
                  <input value={form.slug} onChange={(e) => updateForm('slug', e.target.value)} className="h-11 w-full rounded-lg border border-border bg-background px-3" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-body2 font-semibold">소개</label>
                <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={4} className="w-full rounded-lg border border-border bg-background px-3 py-3" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-body2 font-semibold">웹사이트</label>
                  <input value={form.website} onChange={(e) => updateForm('website', e.target.value)} className="h-11 w-full rounded-lg border border-border bg-background px-3" />
                </div>
                <div>
                  <label className="mb-2 block text-body2 font-semibold">로고 URL</label>
                  <input value={form.logo_url} onChange={(e) => updateForm('logo_url', e.target.value)} className="h-11 w-full rounded-lg border border-border bg-background px-3" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-body2 font-semibold">전화번호</label>
                  <input value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} className="h-11 w-full rounded-lg border border-border bg-background px-3" />
                </div>
                <div>
                  <label className="mb-2 block text-body2 font-semibold">이메일</label>
                  <input value={form.email} onChange={(e) => updateForm('email', e.target.value)} className="h-11 w-full rounded-lg border border-border bg-background px-3" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-body2 font-semibold">본사 국가</label>
                  <input value={form.headquarters_country} onChange={(e) => updateForm('headquarters_country', e.target.value)} className="h-11 w-full rounded-lg border border-border bg-background px-3" />
                </div>
                <div>
                  <label className="mb-2 block text-body2 font-semibold">노출 순서</label>
                  <input value={form.display_order} onChange={(e) => updateForm('display_order', e.target.value)} className="h-11 w-full rounded-lg border border-border bg-background px-3" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-body2 font-semibold">본사 주소</label>
                <input value={form.headquarters_address} onChange={(e) => updateForm('headquarters_address', e.target.value)} className="h-11 w-full rounded-lg border border-border bg-background px-3" />
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-body2 font-semibold">커버 도시</label>
                  <input value={form.coverage_cities} onChange={(e) => updateForm('coverage_cities', e.target.value)} placeholder="시드니, 멜버른" className="h-11 w-full rounded-lg border border-border bg-background px-3" />
                </div>
                <div>
                  <label className="mb-2 block text-body2 font-semibold">커버 국가</label>
                  <input value={form.coverage_countries} onChange={(e) => updateForm('coverage_countries', e.target.value)} placeholder="AU, KR" className="h-11 w-full rounded-lg border border-border bg-background px-3" />
                </div>
                <div>
                  <label className="mb-2 block text-body2 font-semibold">전문 분야</label>
                  <input value={form.specialties} onChange={(e) => updateForm('specialties', e.target.value)} placeholder="어학연수, 대학진학" className="h-11 w-full rounded-lg border border-border bg-background px-3" />
                </div>
                <div>
                  <label className="mb-2 block text-body2 font-semibold">태그</label>
                  <input value={form.tags} onChange={(e) => updateForm('tags', e.target.value)} placeholder="강남, 현지상담" className="h-11 w-full rounded-lg border border-border bg-background px-3" />
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-3 text-body2">
                  <input type="checkbox" checked={form.is_verified} onChange={(e) => updateForm('is_verified', e.target.checked)} />
                  기본 인증
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-3 text-body2">
                  <input type="checkbox" checked={form.qeac_verified} onChange={(e) => updateForm('qeac_verified', e.target.checked)} />
                  QEAC 인증
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-3 text-body2">
                  <input type="checkbox" checked={form.is_claimed} onChange={(e) => updateForm('is_claimed', e.target.checked)} />
                  클레임 완료
                </label>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={handleSubmit} disabled={saving} className="flex-1 rounded-lg bg-accent px-4 py-3 font-semibold text-accent-foreground disabled:opacity-60">
                  {selectedId ? '수정 저장' : '유학원 추가'}
                </button>
                {selectedId ? (
                  <button type="button" onClick={handleDelete} disabled={saving} className="inline-flex items-center gap-2 rounded-lg border border-negative px-4 py-3 font-semibold text-negative disabled:opacity-60">
                    <Trash2 className="h-4 w-4" />
                    삭제
                  </button>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
