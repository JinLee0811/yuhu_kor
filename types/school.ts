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

  // 영어 입학 요건 (IELTS Academic 기준 overall)
  ieltsRequirement?: {
    undergraduate?: number; // 학부
    postgraduate?: number;  // 대학원
    diploma?: number;       // 디플로마/수료과정
    note?: string;          // 예외사항 (e.g. "각 밴드 6.0 이상")
  };

  // QS 세계대학 순위 (2025 기준)
  qsRanking?: {
    world?: number;
    australia?: number;
  };

  // 장학금 정보
  scholarships?: {
    name: string;
    amount: string;    // 예: "AUD 10,000" 또는 "등록금 25%"
    condition: string; // 수혜 조건 요약
  }[];
}
