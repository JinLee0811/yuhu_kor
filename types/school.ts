export interface School {
  id: string;
  name: string;
  type: 'university' | 'tafe' | 'language' | 'college';
  city: string;
  description: string;
  fields: string[];
  address: string;
  website: string;
  tuitionRange: string;
  intakePeriods: string[];
  cricosCode: string | null;
  topAgencies: {
    agencyId: string;
    agencyName: string;
    count: number;
  }[];
  programs?: string[];
  featureTags?: string[];
  logoText?: string;
}
