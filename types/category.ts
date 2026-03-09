export interface ReviewSchemaItem {
  key: string;
  label: string;
  weight: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  description?: string;
  review_schema: ReviewSchemaItem[];
  is_active: boolean;
  sort_order: number;
}
