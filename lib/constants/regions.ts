import type { Region } from '@/types/region';

export const regions: Region[] = [
  { id: 'reg-au', slug: 'au', name: '호주', country_code: 'AU', timezone: 'Australia/Sydney', is_active: true },
  {
    id: 'reg-au-sydney',
    slug: 'au-sydney',
    name: '시드니',
    parent_id: 'reg-au',
    country_code: 'AU',
    timezone: 'Australia/Sydney',
    is_active: true
  },
  {
    id: 'reg-au-melbourne',
    slug: 'au-melbourne',
    name: '멜버른',
    parent_id: 'reg-au',
    country_code: 'AU',
    timezone: 'Australia/Melbourne',
    is_active: true
  },
  {
    id: 'reg-au-brisbane',
    slug: 'au-brisbane',
    name: '브리즈번',
    parent_id: 'reg-au',
    country_code: 'AU',
    timezone: 'Australia/Brisbane',
    is_active: true
  },
  {
    id: 'reg-au-perth',
    slug: 'au-perth',
    name: '퍼스',
    parent_id: 'reg-au',
    country_code: 'AU',
    timezone: 'Australia/Perth',
    is_active: true
  },
  {
    id: 'reg-au-gold-coast',
    slug: 'au-gold-coast',
    name: '골드코스트',
    parent_id: 'reg-au',
    country_code: 'AU',
    timezone: 'Australia/Brisbane',
    is_active: true
  }
];
