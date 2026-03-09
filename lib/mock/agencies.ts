export interface MockAgency {
  id: string;
  slug: string;
  name: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  logo_url?: string;
  headquarters_country: string;
  headquarters_address: string;
  coverage_cities: string[];
  coverage_countries: string[];
  specialties: string[];
  tags: string[];
  avg_score: number;
  review_count: number;
  is_verified: boolean;
  qeac_verified: boolean;
  is_claimed: boolean;
  sns_links: {
    instagram?: string;
    kakao?: string;
  };
}

export const mockAgencies: MockAgency[] = [
  {
    id: '1',
    slug: 'ibn-edu',
    name: 'IBN유학',
    description:
      '호주 맥쿼리대학교 선정 최우수 유학원. 시드니 본사, 서울 강남 운영. 약대/간호/IT/어학연수/조기유학 전문.',
    website: 'https://www.ibnedu.com',
    phone: '+61 2 9261 3086',
    email: 'sydney@ibnedu.com',
    logo_url: '/images/agencies/ibn.svg',
    headquarters_country: 'KR',
    headquarters_address: '서울시 서초구 서초동 1305-7 유창빌딩 9층 (강남역)',
    coverage_cities: ['시드니', '멜버른', '브리즈번', '퍼스'],
    coverage_countries: ['AU'],
    specialties: ['어학연수', '대학진학', '조기유학', '간호/약대'],
    tags: ['강남', '시드니현지', '명문대전문', '맥쿼리공식파트너'],
    avg_score: 4.2,
    review_count: 47,
    is_verified: true,
    qeac_verified: true,
    is_claimed: true,
    sns_links: {
      instagram: 'https://instagram.com/ibnedu',
      kakao: 'ibnedu'
    }
  },
  {
    id: '2',
    slug: 'uhak-station',
    name: '유학스테이션',
    description: '호주 공식입학처. 강남/세종/시드니/멜버른 운영. 어학연수부터 대학, TAFE, 의학/약학/간호 전문 상담.',
    website: 'https://www.uhakstation.com',
    phone: '+61 2 8068 6869',
    email: 'sydney@uhakstation.com',
    logo_url: '/images/agencies/station.svg',
    headquarters_country: 'KR',
    headquarters_address: '서울시 서초구 서초대로 77길 15 대경빌딩 6층 (강남역)',
    coverage_cities: ['시드니', '멜버른', '브리즈번', '골드코스트'],
    coverage_countries: ['AU'],
    specialties: ['어학연수', '대학진학', 'TAFE', '간호/약대', '호텔경영'],
    tags: ['강남', '세종지점', '시드니현지', '멜버른현지', '의약계열전문'],
    avg_score: 4.0,
    review_count: 63,
    is_verified: true,
    qeac_verified: true,
    is_claimed: true,
    sns_links: {
      kakao: 'uhakstation'
    }
  },
  {
    id: '3',
    slug: 'mkl-sydney',
    name: 'MKL Sydney',
    description: '시드니 현지법인 유학원. 어학연수, 전문대/대학교 입학, 비자 수속, 졸업 후 이민까지 현지에서 직접 진행.',
    website: 'https://www.mklsydney.com',
    phone: '+61 2 0000 0000',
    email: 'info@mklsydney.com',
    logo_url: '/images/agencies/mkl.svg',
    headquarters_country: 'AU',
    headquarters_address: 'Sydney CBD, NSW 2000, Australia',
    coverage_cities: ['시드니'],
    coverage_countries: ['AU'],
    specialties: ['어학연수', '대학진학', 'TAFE', '비자', '조기유학'],
    tags: ['시드니현지법인', '이민연계', '현지상담'],
    avg_score: 4.5,
    review_count: 31,
    is_verified: true,
    qeac_verified: true,
    is_claimed: false,
    sns_links: {}
  },
  {
    id: '4',
    slug: 'eduin-melbourne',
    name: '에듀인 유학원',
    description: '멜버른 현지 유학원. 어학연수, 대학교, 조기유학 상담. 멜버른 CBD 위치로 현지 밀착 서비스 제공.',
    website: 'https://www.eduin.com.au',
    phone: '+61 3 0000 0000',
    email: 'info@eduin.com.au',
    headquarters_country: 'AU',
    headquarters_address: 'L8/179 Queen St, Melbourne VIC 3000',
    coverage_cities: ['멜버른', '브리즈번'],
    coverage_countries: ['AU'],
    specialties: ['어학연수', '대학진학', '조기유학'],
    tags: ['멜버른현지', '현지상담', '무료상담'],
    avg_score: 3.8,
    review_count: 22,
    is_verified: false,
    qeac_verified: false,
    is_claimed: false,
    sns_links: {}
  },
  {
    id: '5',
    slug: 'eduyoung',
    name: '에듀영 (EduYoung)',
    description: '브리즈번/골드코스트 전문 유학원. TAFE QLD 공식파트너. 어학연수, 대학진학, 조기유학 전문 상담.',
    website: 'https://eduyoung.com',
    phone: '070-0000-0000',
    email: 'info@eduyoung.com',
    headquarters_country: 'KR',
    headquarters_address: '서울 강남구',
    coverage_cities: ['브리즈번', '골드코스트', '시드니'],
    coverage_countries: ['AU'],
    specialties: ['어학연수', 'TAFE', '대학진학', '조기유학'],
    tags: ['브리즈번전문', '골드코스트', 'TAFE전문', '워홀'],
    avg_score: 4.1,
    review_count: 18,
    is_verified: false,
    qeac_verified: false,
    is_claimed: false,
    sns_links: {
      instagram: 'https://instagram.com/eduyoung'
    }
  },
  {
    id: '6',
    slug: 'ybm-uhak',
    name: 'YBM유학센터',
    description: 'YBM 브랜드 호주 유학 전문 센터. 어학연수, 대학교 입학, 대학원, 조기유학, 워킹홀리데이 전 과정 상담.',
    website: 'https://www.ybmuhak.com',
    phone: '02-0000-0000',
    email: 'info@ybmuhak.com',
    headquarters_country: 'KR',
    headquarters_address: '서울 종로구 (종로 YBM 본사)',
    coverage_cities: ['시드니', '멜버른', '브리즈번', '퍼스', '골드코스트'],
    coverage_countries: ['AU', 'CA', 'UK', 'US'],
    specialties: ['어학연수', '대학진학', '대학원', '워킹홀리데이', '조기유학'],
    tags: ['YBM브랜드', '종로', '대형유학원', '다국가'],
    avg_score: 3.6,
    review_count: 89,
    is_verified: true,
    qeac_verified: true,
    is_claimed: true,
    sns_links: {}
  },
  {
    id: '7',
    slug: 'topworld-uhak',
    name: '탑월드유학그룹',
    description: '호주유학닷컴 운영. 시드니/브리즈번/멜버른/퍼스 전 지역 커버. 어학연수, 대학, 조기유학, 워홀 전문.',
    website: 'https://hojuyuhak.co.kr',
    phone: '02-0000-0000',
    email: 'info@topworld.co.kr',
    headquarters_country: 'KR',
    headquarters_address: '서울 강남구',
    coverage_cities: ['시드니', '멜버른', '브리즈번', '퍼스', '골드코스트'],
    coverage_countries: ['AU'],
    specialties: ['어학연수', '대학진학', '조기유학', '워킹홀리데이'],
    tags: ['강남', '호주전문', '조기유학전문'],
    avg_score: 3.9,
    review_count: 34,
    is_verified: false,
    qeac_verified: false,
    is_claimed: false,
    sns_links: {}
  },
  {
    id: '8',
    slug: 'iworld-study',
    name: '아이월드 유학',
    description: '호주 TAFE 전문 유학원. 지역별 TAFE 맞춤 상담. 영주권 연계 가능 과정 전문 안내.',
    website: 'https://www.iworldstudy.com',
    phone: '02-0000-0000',
    email: 'info@iworldstudy.com',
    headquarters_country: 'KR',
    headquarters_address: '서울 강남구',
    coverage_cities: ['시드니', '멜버른', '브리즈번', '퍼스', '캔버라'],
    coverage_countries: ['AU'],
    specialties: ['TAFE', 'VET', '대학진학', '영주권연계'],
    tags: ['TAFE전문', '영주권연계', 'VET전문'],
    avg_score: 4.3,
    review_count: 27,
    is_verified: false,
    qeac_verified: false,
    is_claimed: false,
    sns_links: {}
  },
  {
    id: '9',
    slug: 'uhak-inet',
    name: '유학아이넷',
    description: '호주 조기유학, 부모동반유학 전문. 대학교 입학 상담. 공립/사립학교 입학 지원 전 과정 케어.',
    website: 'http://yuhakinet.com',
    phone: '02-0000-0000',
    email: 'info@yuhakinet.com',
    headquarters_country: 'KR',
    headquarters_address: '서울 강남구',
    coverage_cities: ['시드니', '멜버른', '브리즈번'],
    coverage_countries: ['AU'],
    specialties: ['조기유학', '부모동반유학', '대학진학'],
    tags: ['조기유학전문', '부모동반', '초중고'],
    avg_score: 4.0,
    review_count: 15,
    is_verified: false,
    qeac_verified: false,
    is_claimed: false,
    sns_links: {}
  },
  {
    id: '10',
    slug: 'coei-uhak',
    name: '코이유학',
    description: '호주 어학연수 전문. 목적별/도시별 맞춤 어학원 선정. 워킹홀리데이 연계 프로그램 운영.',
    website: 'https://www.coei.com',
    phone: '02-0000-0000',
    email: 'info@coei.com',
    headquarters_country: 'KR',
    headquarters_address: '서울 강남구',
    coverage_cities: ['시드니', '멜버른', '브리즈번', '골드코스트', '퍼스'],
    coverage_countries: ['AU'],
    specialties: ['어학연수', '워킹홀리데이', 'IELTS준비'],
    tags: ['어학연수전문', '워홀', 'IELTS'],
    avg_score: 3.7,
    review_count: 41,
    is_verified: false,
    qeac_verified: false,
    is_claimed: false,
    sns_links: {}
  }
];
