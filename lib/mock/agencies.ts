export interface MockAgency {
  id: string;
  slug: string;
  display_order?: number;
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
    display_order: 1,
    name: 'IBN유학',
    description:
      '호주 맥쿼리대학교 선정 최우수 유학원. 시드니 본사, 서울 강남 운영. 약대/간호/IT/어학연수/조기유학 전문.',
    website: 'https://www.ibnedu.com',
    phone: '02-3477-2412',
    email: 'seoul@ibnedu.com',
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
      kakao: 'https://pf.kakao.com/_lutpd'
    }
  },
  {
    id: '2',
    slug: 'uhak-station',
    display_order: 2,
    name: '유학스테이션',
    description: '2001년 설립, 강남·세종·시드니·멜버른·브리즈번 8개 직영센터 운영. 어학연수부터 대학, TAFE, 의학/약학/간호 전문 상담.',
    website: 'https://www.uhakstation.com',
    phone: '02-532-6504',
    email: 'gangnam@uhakstation.com',
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
      instagram: 'https://instagram.com/uhakstation_aus',
      kakao: 'https://pf.kakao.com/_UHAKSTATION'
    }
  },
  {
    id: '3',
    slug: 'mkl-sydney',
    display_order: 3,
    name: 'MKL Sydney',
    description: '시드니 현지법인 유학원 (QEAC No.11970). 어학연수, 전문대/대학교 입학, 비자 수속, 졸업 후 이민까지 현지에서 직접 진행.',
    website: 'https://www.mklsydney.com',
    phone: '+61 2 8066 0875',
    email: 'info@mklsydney.com',
    logo_url: '/images/agencies/mkl.svg',
    headquarters_country: 'AU',
    headquarters_address: 'Level 8, Suite 52, 301 Castlereagh Street, Haymarket NSW 2000',
    coverage_cities: ['시드니'],
    coverage_countries: ['AU'],
    specialties: ['어학연수', '대학진학', 'TAFE', '비자', '조기유학'],
    tags: ['시드니현지법인', '이민연계', '현지상담', 'QEAC공인'],
    avg_score: 4.5,
    review_count: 31,
    is_verified: true,
    qeac_verified: true,
    is_claimed: false,
    sns_links: {
      kakao: 'https://pf.kakao.com/_mxoNQb'
    }
  },
  {
    id: '4',
    slug: 'eduin-melbourne',
    display_order: 4,
    name: '에듀인 유학원',
    description: '2015년 설립, 멜버른 기반 현지 유학원. 조기교육·어학연수·VET·고등교육·학생비자 전문. 강남·목동 한국 지사 운영.',
    website: 'https://www.eduin.com.au',
    phone: '+61 3 8590 2401',
    email: 'info@eduin.com.au',
    headquarters_country: 'AU',
    headquarters_address: '612/365 Little Collins Street, Melbourne VIC 3000',
    coverage_cities: ['멜버른', '시드니', '브리즈번'],
    coverage_countries: ['AU'],
    specialties: ['어학연수', '대학진학', '조기유학', 'VET'],
    tags: ['멜버른현지', '강남지사', '목동지사', '현지상담'],
    avg_score: 3.8,
    review_count: 22,
    is_verified: false,
    qeac_verified: false,
    is_claimed: false,
    sns_links: {
      instagram: 'https://instagram.com/eduininternational'
    }
  },
  {
    id: '5',
    slug: 'eduyoung',
    display_order: 5,
    name: '에듀영 (EduYoung)',
    description: '브리즈번 현지 유학원 (QEAC I382). TAFE Queensland 공식 에이전트. 어학연수, 대학진학 전문 상담.',
    website: 'https://eduyoung.com',
    phone: '+61 7 3012 7200',
    email: 'info@eduyoung.com',
    headquarters_country: 'AU',
    headquarters_address: 'Suite 3, Level 1, 233 Albert Street, Brisbane City QLD 4000',
    coverage_cities: ['브리즈번', '골드코스트', '시드니'],
    coverage_countries: ['AU'],
    specialties: ['어학연수', 'TAFE', '대학진학', '조기유학'],
    tags: ['브리즈번현지', '골드코스트', 'TAFE공식파트너', 'QEAC공인'],
    avg_score: 4.1,
    review_count: 18,
    is_verified: true,
    qeac_verified: true,
    is_claimed: false,
    sns_links: {}
  },
  {
    id: '6',
    slug: 'ybm-uhak',
    display_order: 6,
    name: 'YBM유학센터',
    description: '1982년 설립, 국내 대형 어학·유학 브랜드 YBM 직영. 강남 본사. 호주 포함 미국·영국·캐나다 등 전방위 유학 서비스.',
    website: 'https://www.ybmuhak.com',
    phone: '1688-9671',
    email: 'ybmuhak@ybmsisa.com',
    headquarters_country: 'KR',
    headquarters_address: '서울특별시 강남구 테헤란로 98 2층 (강남역)',
    coverage_cities: ['시드니', '멜버른', '브리즈번', '퍼스', '골드코스트'],
    coverage_countries: ['AU', 'CA', 'UK', 'US'],
    specialties: ['어학연수', '대학진학', '대학원', '워킹홀리데이', '조기유학'],
    tags: ['YBM브랜드', '강남', '대형유학원', '다국가'],
    avg_score: 3.6,
    review_count: 89,
    is_verified: true,
    qeac_verified: true,
    is_claimed: true,
    sns_links: {
      instagram: 'https://instagram.com/ybmuhak',
      kakao: 'https://pf.kakao.com/_xbbwVxd'
    }
  },
  {
    id: '7',
    slug: 'topworld-uhak',
    display_order: 7,
    name: '탑월드유학그룹',
    description: '호주유학닷컴 운영. 강남 기반. 초·중·고 유학, 정규유학, 어학연수, 유학 후 이민, 기술이민, 워킹홀리데이 전 과정.',
    website: 'https://hojuyuhak.co.kr',
    phone: '02-501-6696',
    email: 'twa6696@hanmail.net',
    headquarters_country: 'KR',
    headquarters_address: '서울시 서초구 서운로 142-4 재전빌딩 610호 (강남)',
    coverage_cities: ['시드니', '멜버른', '브리즈번', '퍼스', '골드코스트'],
    coverage_countries: ['AU'],
    specialties: ['어학연수', '대학진학', '조기유학', '워킹홀리데이', '이민'],
    tags: ['강남', '호주전문', '조기유학전문', '이민연계'],
    avg_score: 3.9,
    review_count: 34,
    is_verified: false,
    qeac_verified: false,
    is_claimed: false,
    sns_links: {
      kakao: 'gotwa0419'
    }
  },
  {
    id: '8',
    slug: 'iworld-study',
    display_order: 8,
    name: '아이월드 유학',
    description: '2002년 설립. 서울·시드니·멜버른·브리즈번 직영 지사 운영. 호주 유학·취업·이민 전문. TAFE 및 VET 영주권 연계 과정 특화.',
    website: 'https://www.iworldstudy.com',
    phone: '02-3472-1113',
    email: 'sydney@iworldstudy.com',
    headquarters_country: 'KR',
    headquarters_address: '서울시 서초구 서초대로 74길 23 서초타운 트라팰리스 7층 706호',
    coverage_cities: ['시드니', '멜버른', '브리즈번', '퍼스', '캔버라'],
    coverage_countries: ['AU'],
    specialties: ['TAFE', 'VET', '대학진학', '영주권연계', '취업이민'],
    tags: ['TAFE전문', '영주권연계', 'VET전문', '시드니현지', '멜버른현지'],
    avg_score: 4.3,
    review_count: 27,
    is_verified: true,
    qeac_verified: false,
    is_claimed: false,
    sns_links: {
      instagram: 'https://instagram.com/iworldglobal',
      kakao: 'https://pf.kakao.com/_uxgCxoM'
    }
  },
  {
    id: '9',
    slug: 'uhak-inet',
    display_order: 9,
    name: '유학아이넷',
    description: '1995년 시드니 설립, 2001년 서울 본사 개설. 호주 조기유학·부모동반유학 전문. 공립/사립학교 입학 지원 전 과정 케어.',
    website: 'http://yuhakinet.com',
    phone: '070-8850-0907',
    email: 'info@yuhakinet.com',
    headquarters_country: 'KR',
    headquarters_address: '서울 본사 (시드니 현지 지사 운영)',
    coverage_cities: ['시드니', '멜버른', '브리즈번'],
    coverage_countries: ['AU'],
    specialties: ['조기유학', '부모동반유학', '대학진학', '워킹홀리데이'],
    tags: ['조기유학전문', '부모동반', '초중고', '시드니현지'],
    avg_score: 4.0,
    review_count: 15,
    is_verified: false,
    qeac_verified: false,
    is_claimed: false,
    sns_links: {
      instagram: 'https://instagram.com/yuhakinet',
      kakao: 'https://pf.kakao.com/_zXaBu'
    }
  },
  {
    id: '10',
    slug: 'coei-uhak',
    display_order: 10,
    name: '종로유학원 (코이)',
    description: '창립 44년, 국내 1위 종합유학원. 종로·강남 본점 운영. 호주 포함 미국·영국·캐나다 등 전방위 어학연수·대학진학 서비스.',
    website: 'https://www.coei.com',
    phone: '02-738-4193',
    email: 'kn@coei.com',
    headquarters_country: 'KR',
    headquarters_address: '서울시 중구 세종대로 136 서울파이낸스센터 7층 (종로본점)',
    coverage_cities: ['시드니', '멜버른', '브리즈번', '골드코스트', '퍼스'],
    coverage_countries: ['AU', 'US', 'UK', 'CA', 'NZ'],
    specialties: ['어학연수', '워킹홀리데이', 'IELTS준비', '대학진학'],
    tags: ['종로', '강남지점', '대형유학원', '44년역사', '다국가'],
    avg_score: 3.7,
    review_count: 41,
    is_verified: true,
    qeac_verified: false,
    is_claimed: false,
    sns_links: {
      kakao: 'https://pf.kakao.com/_gzVkxl'
    }
  }
];
