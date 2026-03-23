'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { SchoolCard } from '@/components/school/SchoolCard';
import type { ApiResponse } from '@/lib/api';
import type { School } from '@/types/school';

/* ─── 상수 ──────────────────────────────────────── */
const TYPE_TABS = [
  { key: 'all',        label: '전체' },
  { key: 'university', label: '대학교' },
  { key: 'tafe',       label: 'TAFE' },
  { key: 'language',   label: '어학원' },
  { key: 'college',    label: '전문대' },
  { key: 'rto',        label: 'RTO' },
  { key: 'foundation', label: '파운데이션' },
] as const;

// ⚠️ mock·DB 모두 '멜버른' 사용
const CITY_TABS = [
  { key: '',           label: '전체' },
  { key: '시드니',     label: '시드니' },
  { key: '멜버른',     label: '멜버른' },
  { key: '브리즈번',   label: '브리즈번' },
  { key: '골드코스트', label: '골드코스트' },
  { key: '퍼스',       label: '퍼스' },
] as const;

const CITY_ORDER = ['시드니', '멜버른', '브리즈번', '골드코스트', '퍼스'];
const FIELD_OPTIONS = ['IT', '간호', '비즈니스', '요리', '디자인', '영어', '기타'];

// 학교는 별점 데이터가 없으므로 '이름순'·'지역별'만 노출
const SORT_OPTIONS = [
  { label: '후기 많은순', value: 'review_count' },
  { label: '지역별',      value: 'city_asc'     },
  { label: '이름순',      value: 'name_asc'     },
] as const;

type SortValue        = (typeof SORT_OPTIONS)[number]['value'];
type SchoolTypeFilter = (typeof TYPE_TABS)[number]['key'];
type CityFilter       = (typeof CITY_TABS)[number]['key'];

interface SchoolStats {
  reviewCount: number;
  avgScore: number;
  topAgencyCount: number;
}

/* ─── 페이지 컴포넌트 ───────────────────────────── */
export default function SchoolsPage() {
  // hydration 안전: 서버·클라이언트 초기 렌더 불일치 방지
  const [mounted, setMounted]         = useState(false);
  const [schools, setSchools]         = useState<School[]>([]);
  const [statsById, setStatsById]     = useState<Record<string, SchoolStats>>({});
  const [isLoading, setIsLoading]     = useState(true);

  const [keyword, setKeyword]               = useState('');
  const [activeType, setActiveType]         = useState<SchoolTypeFilter>('all');
  const [selectedCity, setSelectedCity]     = useState<CityFilter>('');
  const [selectedField, setSelectedField]   = useState('');
  const [sort, setSort]                     = useState<SortValue>('review_count');
  const [showSort, setShowSort]             = useState(false);
  const [fieldOpen, setFieldOpen]           = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    setIsLoading(true);
    fetch('/api/v1/schools')
      .then((r) => r.json())
      .then((json: ApiResponse<{ items: School[]; statsById: Record<string, SchoolStats> }>) => {
        if (json.data) { setSchools(json.data.items); setStatsById(json.data.statsById); }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredSchools = useMemo(() => {
    if (!mounted) return [];
    const kw = keyword.trim().toLowerCase();
    const items = schools
      .filter((s) => activeType === 'all' || s.type === activeType)
      .filter((s) => !selectedCity  || s.city === selectedCity)
      .filter((s) => !selectedField || s.fields.includes(selectedField))
      .filter((s) => !kw || s.name.toLowerCase().includes(kw)
                         || s.city.includes(kw)
                         || s.fields.some((f) => f.toLowerCase().includes(kw)));

    return [...items].sort((a, b) => {
      const aS = statsById[a.id] ?? { reviewCount: 0, avgScore: 0, topAgencyCount: 0 };
      const bS = statsById[b.id] ?? { reviewCount: 0, avgScore: 0, topAgencyCount: 0 };
      if (sort === 'name_asc')  return a.name.localeCompare(b.name, 'ko');
      if (sort === 'city_asc') {
        const ai = CITY_ORDER.indexOf(a.city);
        const bi = CITY_ORDER.indexOf(b.city);
        const d  = (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
        return d !== 0 ? d : a.name.localeCompare(b.name, 'ko');
      }
      return bS.reviewCount - aS.reviewCount;
    });
  }, [mounted, activeType, keyword, schools, selectedCity, selectedField, sort, statsById]);

  const hasFilter = activeType !== 'all' || selectedCity !== '' || selectedField !== '' || keyword !== '';
  const clearAll  = () => { setActiveType('all'); setSelectedCity(''); setSelectedField(''); setKeyword(''); };

  return (
    <div className="min-h-screen bg-[#F5F6F8]">

      {/* ── Sticky 필터 헤더 ── */}
      <div className="sticky top-14 z-30 border-b border-[#E8E9EC] bg-white md:top-16">
        <div className="mx-auto max-w-layout px-4 pb-3 pt-3 md:px-6">

          {/* 행 1: 검색창 */}
          <div
            className="mb-2.5 flex items-center gap-2.5 rounded-xl border border-[#E2E4E9] bg-[#F8F9FB] px-3.5 py-2.5
                       transition-colors focus-within:border-[#FF6B35] focus-within:bg-white"
            onClick={() => inputRef.current?.focus()}
            role="button"
            tabIndex={-1}
          >
            <Search className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
            <input
              ref={inputRef}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="학교 이름, 도시, 분야 검색"
              className="min-w-0 flex-1 bg-transparent text-[13.5px] text-[#1A1A2E] placeholder:text-[#ABABAB] outline-none"
            />
            {keyword ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setKeyword(''); }}
                className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#C9CBD0]"
              >
                <X className="h-2.5 w-2.5 text-white" />
              </button>
            ) : null}
          </div>

          {/* 행 2: 유형 탭 + 정렬 드롭다운 */}
          <div className="flex items-center gap-2 mb-2">
            {/* min-w-0 필수: flex 자식이 overflow-x:auto를 올바르게 발동시키기 위해 */}
            <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto scrollbar-hide">
              {TYPE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveType(tab.key)}
                  className={[
                    'shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium transition-all sm:px-3.5 sm:text-[13px]',
                    activeType === tab.key
                      ? 'bg-[#1A1A2E] text-white'
                      : 'bg-[#F0F1F3] text-[#6B7280] hover:bg-[#E4E6EA]',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 정렬 버튼 */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowSort((p) => !p)}
                className="flex items-center gap-1 rounded-full border border-[#E2E4E9] bg-white px-2.5 py-1.5 text-[12px] font-medium text-[#374151] hover:bg-[#F5F6F8] sm:px-3 sm:text-[13px]"
              >
                <span className="hidden sm:inline">{SORT_OPTIONS.find((o) => o.value === sort)?.label}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-[#6B7280] transition-transform ${showSort ? 'rotate-180' : ''}`} />
              </button>
              {showSort ? (
                <>
                  <button className="fixed inset-0 z-30" onClick={() => setShowSort(false)} aria-label="닫기" />
                  <div className="absolute right-0 top-full z-40 mt-1.5 min-w-[140px] overflow-hidden rounded-2xl border border-[#E2E4E9] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                    {SORT_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => { setSort(o.value); setShowSort(false); }}
                        className={[
                          'flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-[#F8F9FB]',
                          sort === o.value ? 'font-semibold text-[#FF6B35]' : 'text-[#374151]',
                        ].join(' ')}
                      >
                        {sort === o.value ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B35]" /> : <span className="h-1.5 w-1.5 shrink-0" />}
                        {o.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* 행 3: 지역 탭 + 분야 버튼 */}
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto scrollbar-hide">
              {CITY_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedCity(tab.key)}
                  className={[
                    'shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium transition-all sm:px-3.5 sm:text-[13px]',
                    selectedCity === tab.key
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-[#F0F1F3] text-[#6B7280] hover:bg-[#E4E6EA]',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 분야 버튼 */}
            <button
              onClick={() => setFieldOpen(true)}
              className={[
                'flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition-all sm:px-3 sm:text-[13px]',
                selectedField
                  ? 'border-[#FF6B35] bg-[#FFF3EE] text-[#FF6B35]'
                  : 'border-[#E2E4E9] bg-white text-[#374151] hover:bg-[#F5F6F8]',
              ].join(' ')}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">{selectedField || '분야'}</span>
            </button>
          </div>

          {/* 결과 수 + 초기화 */}
          <div className="mt-2.5 flex items-center justify-between">
            <p className="text-[12px] text-[#9CA3AF]">
              학교 <span className="font-semibold text-[#1A1A2E]">{filteredSchools.length}개</span>
            </p>
            {hasFilter ? (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-[12px] text-[#9CA3AF] hover:text-[#374151]"
              >
                <X className="h-3 w-3" />
                초기화
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── 카드 그리드 ── */}
      <div className="mx-auto max-w-layout px-4 pb-16 pt-4 md:px-6">
        {!mounted || isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-[#E8E9EC]" />
            ))}
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Search className="h-6 w-6 text-[#C9CBD0]" />
            </div>
            <p className="text-[15px] font-semibold text-[#1A1A2E]">검색 결과가 없어요</p>
            <p className="mt-1 text-[13px] text-[#9CA3AF]">필터를 바꾸거나 검색어를 다시 입력해보세요.</p>
            <button onClick={clearAll} className="mt-5 rounded-xl bg-[#FF6B35] px-6 py-2.5 text-[13px] font-semibold text-white">
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSchools.map((school) => {
              const s = statsById[school.id] ?? { reviewCount: 0, avgScore: 0, topAgencyCount: 0 };
              return (
                <SchoolCard
                  key={school.id}
                  school={school}
                  reviewCount={s.reviewCount}
                  avgScore={s.avgScore}
                  topAgencyCount={s.topAgencyCount}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ── 분야 바텀시트 ── */}
      {fieldOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-[2px]"
          onClick={() => setFieldOpen(false)}
        >
          <div
            className="w-full rounded-t-3xl bg-white px-5 pb-8 pt-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-[#D1D5DB]" />
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">분야 선택</h3>
              <button onClick={() => setFieldOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0F1F3]">
                <X className="h-3.5 w-3.5 text-[#6B7280]" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['전체', ...FIELD_OPTIONS].map((field) => {
                const isActive = field === '전체' ? selectedField === '' : selectedField === field;
                return (
                  <button
                    key={field}
                    onClick={() => setSelectedField(field === '전체' ? '' : field === selectedField ? '' : field)}
                    className={[
                      'rounded-xl px-4 py-2 text-[13px] font-medium transition-all',
                      isActive ? 'bg-[#FF6B35] text-white' : 'bg-[#F0F1F3] text-[#374151] hover:bg-[#E4E6EA]',
                    ].join(' ')}
                  >
                    {field}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setFieldOpen(false)}
              className="mt-5 w-full rounded-2xl bg-[#1A1A2E] py-3.5 text-[14px] font-semibold text-white"
            >
              적용하기
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
