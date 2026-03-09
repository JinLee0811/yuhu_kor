'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/common/SearchBar';
import { EntityList } from '@/components/entity/EntityList';
import type { Entity } from '@/types/entity';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [items, setItems] = useState<Entity[]>([]);

  const search = async (next: string) => {
    setKeyword(next);
    const params = new URLSearchParams({ q: next, category: 'agency' });
    const response = await fetch(`/api/v1/search?${params.toString()}`);
    const json = await response.json();
    setItems(json.data?.items ?? []);
  };

  return (
    <div className="px-4 py-6 md:px-6">
      <h1 className="mb-4">통합 검색</h1>
      <SearchBar value={keyword} onChange={search} />
      <div className="mt-5">
        <EntityList items={items} country="au" category="agency" />
      </div>
    </div>
  );
}
