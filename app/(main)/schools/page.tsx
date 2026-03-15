'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { SearchBar } from '@/components/common/SearchBar';
import { SchoolCard } from '@/components/school/SchoolCard';
import type { ApiResponse } from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth';
import type { School } from '@/types/school';

const typeTabs = [
  { key: 'all', label: '전체' },
  { key: 'university', label: '대학교' },
  { key: 'tafe', label: 'TAFE' },
  { key: 'language', label: '어학원' },
  { key: 'college', label: '전문대' }
] as const;

const cityOptions = ['시드니', '멜번', '브리즈번', '퍼스', '애들레이드'];
const fieldOptions = ['IT', '간호', '비즈니스', '요리', '디자인', '영어', '기타'];
const sortOptions = [
  { label: '후기 많은순', value: 'review_count' },
  { label: '별점 높은순', value: 'score_desc' },
  { label: '이름순', value: 'name_asc' }
] as const;

type SortValue = (typeof sortOptions)[number]['value'];
type SchoolTypeFilter = (typeof typeTabs)[number]['key'];

export default function SchoolsPage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const stickyTopClass = 'top-14 md:top-16';
  const [schools, setSchools] = useState<School[]>([]);
  const [statsById, setStatsById] = useState<Record<string, { reviewCount: number; avgScore: number; topAgencyCount: number }>>({});

  const [keyword, setKeyword] = useState('');
  const [activeType, setActiveType] = useState<SchoolTypeFilter>('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [sort, setSort] = useState<SortValue>('review_count');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const loadSchools = async () => {
      const response = await fetch('/api/v1/schools');
      const json: ApiResponse<{
        items: School[];
        statsById: Record<string, { reviewCount: number; avgScore: number; topAgencyCount: number }>;
      }> = await response.json();
      if (response.ok && json.data) {
        setSchools(json.data.items);
        setStatsById(json.data.statsById);
      }
    };

    void loadSchools();
  }, []);

  const filteredSchools = useMemo(() => {
    const items = schools
      .filter((school) => (activeType === 'all' ? true : school.type === activeType))
      .filter((school) => (selectedCity ? school.city === selectedCity : true))
      .filter((school) => (selectedField ? school.fields.includes(selectedField) : true))
      .filter((school) => {
        const keywordLower = keyword.trim().toLowerCase();
        if (!keywordLower) return true;
        return school.name.toLowerCase().includes(keywordLower) || school.fields.some((field) => field.toLowerCase().includes(keywordLower));
      });

    return [...items].sort((a, b) => {
      const aStats = statsById[a.id] ?? { reviewCount: 0, avgScore: 0, topAgencyCount: 0 };
      const bStats = statsById[b.id] ?? { reviewCount: 0, avgScore: 0, topAgencyCount: 0 };
      if (sort === 'score_desc') return bStats.avgScore - aStats.avgScore;
      if (sort === 'name_asc') return a.name.localeCompare(b.name, 'ko');
      return bStats.reviewCount - aStats.reviewCount;
    });
  }, [activeType, keyword, schools, selectedCity, selectedField, sort, statsById]);

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="mx-auto max-w-layout">
        <div className={`sticky z-30 border-b border-border bg-background ${stickyTopClass}`}>
          <div className="space-y-3 px-4 pb-5 pt-4 md:px-6 md:pt-5">
            <div className="rounded-xl border border-border/70 bg-card p-2 shadow-sm">
              <SearchBar value={keyword} onChange={setKeyword} onFilterClick={() => setFilterOpen(true)} placeholder="학교 이름 검색" />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {typeTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveType(tab.key)}
                    className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-body2 font-medium transition-colors ${
                      activeType === tab.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="hidden shrink-0 items-center gap-3 md:flex">
                <p className="text-body2 text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredSchools.length}개</span>의 학교
                </p>

                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown((prev) => !prev)}
                    className="flex items-center gap-1 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-body2 font-medium text-foreground hover:bg-muted/50"
                  >
                    <span>{sortOptions.find((option) => option.value === sort)?.label}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showSortDropdown ? (
                    <>
                      <button className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)} aria-label="close" />
                      <div className="absolute right-0 top-full z-40 mt-2 min-w-[140px] overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSort(option.value);
                              setShowSortDropdown(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-body2 hover:bg-muted ${
                              sort === option.value ? 'font-semibold text-accent' : 'text-foreground'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:hidden">
              <p className="text-body2 text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredSchools.length}개</span>의 학교
              </p>

              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown((prev) => !prev)}
                  className="flex items-center gap-1 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-body2 font-medium text-foreground hover:bg-muted/50"
                >
                  <span>{sortOptions.find((option) => option.value === sort)?.label}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showSortDropdown ? (
                  <>
                    <button className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)} aria-label="close" />
                    <div className="absolute right-0 top-full z-40 mt-2 min-w-[140px] overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSort(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-body2 hover:bg-muted ${
                            sort === option.value ? 'font-semibold text-accent' : 'text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-10 pt-3 md:px-6 md:pt-4">
          <div className="space-y-3 md:hidden">
            {filteredSchools.map((school) => (
              <SchoolCard key={school.id} school={school} topAgencyCount={statsById[school.id]?.topAgencyCount ?? 0} />
            ))}
          </div>

          <div className="hidden grid-cols-2 gap-4 md:grid lg:hidden">
            {filteredSchools.map((school) => (
              <SchoolCard key={school.id} school={school} topAgencyCount={statsById[school.id]?.topAgencyCount ?? 0} />
            ))}
          </div>

          <div className="hidden grid-cols-3 gap-5 lg:grid">
            {filteredSchools.map((school) => (
              <SchoolCard key={school.id} school={school} topAgencyCount={statsById[school.id]?.topAgencyCount ?? 0} />
            ))}
          </div>
        </div>
      </div>

      {filterOpen ? (
        <div className="fixed inset-0 z-50 bg-black/30">
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">학교 필터</h3>
              <button type="button" onClick={() => setFilterOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="mb-2 text-body2 font-semibold">도시</p>
              <select
                value={selectedCity}
                onChange={(event) => setSelectedCity(event.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-card px-3 text-body2"
              >
                <option value="">전체</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-body2 font-semibold">분야</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedField('')}
                  className={`rounded-lg px-3 py-2 text-body2 ${selectedField === '' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  전체
                </button>
                {fieldOptions.map((field) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => setSelectedField(field)}
                    className={`rounded-lg px-3 py-2 text-body2 ${
                      selectedField === field ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setFilterOpen(false)}
              className="h-11 w-full rounded-lg bg-accent text-body2 font-semibold text-accent-foreground"
            >
              적용
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
