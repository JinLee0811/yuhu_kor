import type { Entity } from '@/types/entity';
import { EntityCard } from '@/components/entity/EntityCard';

interface Props {
  items: Entity[];
  country?: string;
  category?: string;
}

export function EntityList({ items, country, category }: Props) {
  return (
    <div>
      <div className="space-y-3 md:hidden">
        {items.map((entity) => (
          <EntityCard key={entity.id} entity={entity} country={country} category={category} />
        ))}
      </div>
      <div className="hidden grid-cols-2 gap-4 md:grid lg:hidden">
        {items.map((entity) => (
          <EntityCard key={entity.id} entity={entity} country={country} category={category} />
        ))}
      </div>
      <div className="hidden grid-cols-3 gap-5 lg:grid">
        {items.map((entity) => (
          <EntityCard key={entity.id} entity={entity} country={country} category={category} />
        ))}
      </div>
    </div>
  );
}
