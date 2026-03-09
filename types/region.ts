export interface Region {
  id: string;
  slug: string;
  name: string;
  parent_id?: string;
  country_code: string;
  timezone: string;
  is_active: boolean;
}
