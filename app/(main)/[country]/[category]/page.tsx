'use client';

import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SearchBar } from '@/components/common/SearchBar';
import { EntityCard } from '@/components/entity/EntityCard';
import { FilterBottomSheet } from '@/components/entity/FilterBottomSheet';
import { useEntities } from '@/lib/hooks/useEntities';
import { useAuthStore } from '@/lib/store/auth';

export default function EntityCategoryPage({ params }: { params: { country: string; category: string } }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [keyword, setKeyword] = useState('');
  const [specialty, setSpecialty] = useState('전체');
  const [sort, setSort] = useState('review_count');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [minScore, setMinScore] = useState(0);

  const categories = ['전체', '어학연수', '대학진학', 'TAFE', 'VET', '워킹홀리데이'];
  const sortOptions = [
    { label: '후기 많은순', value: 'review_count' },
    { label: '평점 높은순', value: 'score_desc' },
    { label: '최신순', value: 'latest' }
  ];

  const query = useMemo(
    () => ({
      category: params.category,
      specialty: specialty === '전체' ? undefined : specialty,
      city: selectedCity || undefined,
      min_score: String(minScore),
      sort,
      q: keyword
    }),
    [keyword, specialty, selectedCity, minScore, sort, params.category]
  );

  const entitiesQuery = useEntities(query, 6);
  const items = entitiesQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const stickyTopClass = isLoggedIn ? 'top-14 md:top-16' : 'top-[90px] md:top-[96px]';

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="mx-auto max-w-layout">
        <div className={`sticky z-30 border-b border-border bg-background/95 backdrop-blur ${stickyTopClass}`}>
          <div className="space-y-3 px-4 pb-3 pt-3 md:px-6">
            <div className="rounded-xl border border-border/70 bg-card p-2 shadow-sm">
              <SearchBar value={keyword} onChange={setKeyword} onFilterClick={() => setFilterOpen(true)} />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSpecialty(category)}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-body2 font-medium transition-colors ${
                    specialty === category ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-body2 text-muted-foreground">
                <span className="font-semibold text-foreground">{items.length}개</span>의 유학원
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
                          className={`w-full px-4 py-2.5 text-left text-body2 hover:bg-muted ${sort === option.value ? 'font-semibold text-accent' : 'text-foreground'}`}
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

        <div className="px-4 pb-8 pt-4 md:px-6">
          <div className="space-y-3 md:hidden">
            {items.map((entity) => (
              <EntityCard key={entity.id} entity={entity} country={params.country} category={params.category} />
            ))}
          </div>

          <div className="hidden grid-cols-2 gap-4 md:grid lg:hidden">
            {items.map((entity) => (
              <EntityCard key={entity.id} entity={entity} country={params.country} category={params.category} />
            ))}
          </div>

          <div className="hidden grid-cols-3 gap-5 lg:grid">
            {items.map((entity) => (
              <EntityCard key={entity.id} entity={entity} country={params.country} category={params.category} />
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => entitiesQuery.fetchNextPage()}
              disabled={!entitiesQuery.hasNextPage || entitiesQuery.isFetchingNextPage}
              className="rounded-lg bg-secondary px-6 py-3 font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {entitiesQuery.isFetchingNextPage ? '불러오는 중...' : '더 많은 유학원 보기'}
            </button>
          </div>
        </div>
      </div>

      <FilterBottomSheet
        open={filterOpen}
        selectedSpecialties={selectedSpecialties}
        selectedCity={selectedCity}
        minScore={minScore}
        onClose={() => setFilterOpen(false)}
        onApply={(next) => {
          setSelectedSpecialties(next.specialties);
          if (next.specialties.length > 0) setSpecialty(next.specialties[0]);
          setSelectedCity(next.city);
          setMinScore(next.minScore);
        }}
      />
    </div>
  );
}
