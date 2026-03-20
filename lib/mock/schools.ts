import type { School } from '@/types/school';

export const mockSchools: School[] = [
  // ─────────────────────────────────────────
  // 시드니
  // ─────────────────────────────────────────
  {
    id: 's-usyd',
    name: 'University of Sydney',
    type: 'university',
    city: '시드니',
    description:
      '1850년 개교한 호주 최초의 대학. 아이비리그급 캠퍼스 분위기와 탄탄한 연구 기반으로 유명해요. 비즈니스·법·의학·IT 모든 계열에 강하고, 학업 만족도 후기가 꾸준히 높아요.',
    fields: ['IT', '비즈니스', '법학', '의학', '간호'],
    address: 'Camperdown NSW 2006',
    website: 'https://www.sydney.edu.au',
    tuitionRange: 'AUD 34,000 – 60,000 / year',
    intakePeriods: ['2월', '8월'],
    cricosCode: '00026A',
    topAgencies: [
      { agencyId: '1', agencyName: 'IBN유학', count: 28 },
      { agencyId: '6', agencyName: 'YBM유학센터', count: 19 },
      { agencyId: '10', agencyName: '종로유학원 (코이)', count: 15 },
    ],
    programs: [
      'Bachelor of Commerce',
      'Bachelor of Information Technology',
      'Bachelor of Nursing',
      'Master of Information Technology',
      'Juris Doctor',
    ],
    featureTags: ['QS 세계 18위', '호주 최초 대학', '캠퍼스 만족도 최상', '명문대 프리미엄'],
    logoText: 'SY',
    ieltsRequirement: {
      undergraduate: 6.5,
      postgraduate: 7.0,
      note: '각 밴드 6.0 이상 (일부 전공 6.5)',
    },
    qsRanking: { world: 18, australia: 3 },
    scholarships: [
      {
        name: 'International Merit Scholarship',
        amount: '등록금 25%',
        condition: '입학 성적 우수자 자동 심사, 유지 GPA 65 이상',
      },
      {
        name: 'Sydney Scholars Award',
        amount: 'AUD 6,000 (1회)',
        condition: '본과 신입생, 학업 성취도 및 리더십 기반 심사',
      },
    ],
  },
  {
    id: 's-unsw',
    name: 'UNSW Sydney',
    type: 'university',
    city: '시드니',
    description:
      '공대·비즈니스·데이터 계열로 취업 연계가 강한 시드니 대표 이공계 명문. 캠퍼스가 넓고 국제학생 지원팀이 잘 구성돼 있어요. Co-op 프로그램으로 재학 중 인턴십 연계가 가능해요.',
    fields: ['IT', '비즈니스', '공학', '간호', '데이터사이언스'],
    address: 'High St, Kensington NSW 2052',
    website: 'https://www.unsw.edu.au',
    tuitionRange: 'AUD 32,000 – 58,000 / year',
    intakePeriods: ['2월', '5월', '9월'],
    cricosCode: '00098G',
    topAgencies: [
      { agencyId: '3', agencyName: 'MKL Sydney', count: 34 },
      { agencyId: '1', agencyName: 'IBN유학', count: 22 },
      { agencyId: '5', agencyName: '에듀영 (EduYoung)', count: 18 },
    ],
    programs: [
      'Bachelor of Engineering (Hons)',
      'Bachelor of Computer Science',
      'Master of IT',
      'Bachelor of Commerce',
      'Master of Data Science',
    ],
    featureTags: ['QS 세계 19위', 'Co-op 인턴십', '이공계 강세', '취업지원 우수'],
    logoText: 'UN',
    ieltsRequirement: {
      undergraduate: 6.5,
      postgraduate: 7.0,
      note: '각 밴드 6.0 이상 / 공학 일부 6.5 전 밴드',
    },
    qsRanking: { world: 19, australia: 4 },
    scholarships: [
      {
        name: 'Global Academic Award',
        amount: 'AUD 5,000 – 10,000',
        condition: '신입 국제학생 성적 기반 자동 심사',
      },
      {
        name: "Dean's International Award",
        amount: 'AUD 20,000 (4년)',
        condition: '최우수 성적, 별도 지원서 제출',
      },
    ],
  },
  {
    id: 's-uts',
    name: 'UTS',
    type: 'university',
    city: '시드니',
    description:
      '시내 중심가에 위치해 접근성이 최고인 실무 중심 대학. IT·디자인·비즈니스 계열 후기가 특히 많이 모이고, 졸업 후 현지 취업으로 이어지는 케이스가 많아요.',
    fields: ['IT', '비즈니스', '디자인', '커뮤니케이션'],
    address: '15 Broadway, Ultimo NSW 2007',
    website: 'https://www.uts.edu.au',
    tuitionRange: 'AUD 28,000 – 52,000 / year',
    intakePeriods: ['2월', '7월', '11월'],
    cricosCode: '00099F',
    topAgencies: [
      { agencyId: '2', agencyName: '유학스테이션', count: 29 },
      { agencyId: '3', agencyName: 'MKL Sydney', count: 21 },
      { agencyId: '8', agencyName: '아이월드 유학', count: 14 },
    ],
    programs: [
      'Bachelor of Information Technology',
      'Bachelor of Design (Visual Communication)',
      'Master of Business Analytics',
      'Bachelor of Business',
      'Master of Interaction Design',
    ],
    featureTags: ['QS 세계 133위', '도심 캠퍼스', '실무 중심 커리큘럼', '국제학생 지원 우수'],
    logoText: 'UT',
    ieltsRequirement: {
      undergraduate: 6.5,
      postgraduate: 6.5,
      note: '각 밴드 6.0 이상',
    },
    qsRanking: { world: 133, australia: 11 },
    scholarships: [
      {
        name: 'UTS International Scholarship',
        amount: 'AUD 6,000 – 10,000',
        condition: '성적 우수 신입생 자동 심사',
      },
    ],
  },
  {
    id: 's-mq',
    name: 'Macquarie University',
    type: 'university',
    city: '시드니',
    description:
      '비즈니스·통번역·IT 계열로 많이 찾는 학교. 넓은 캠퍼스와 현지 생활 편의시설이 잘 갖춰져 있고, 학교 안에 대형 쇼핑몰이 있어서 생활이 편하다는 후기가 많아요.',
    fields: ['IT', '비즈니스', '통번역', '언어학'],
    address: '4 Research Park Dr, Macquarie Park NSW 2113',
    website: 'https://www.mq.edu.au',
    tuitionRange: 'AUD 30,000 – 49,000 / year',
    intakePeriods: ['2월', '7월'],
    cricosCode: '00002J',
    topAgencies: [
      { agencyId: '4', agencyName: '에듀인 유학원', count: 17 },
      { agencyId: '7', agencyName: '탑월드유학그룹', count: 13 },
      { agencyId: '9', agencyName: '유학아이넷', count: 10 },
    ],
    programs: [
      'Master of Information Systems',
      'Bachelor of Commerce',
      'Master of Translation and Interpreting',
      'Master of Applied Finance',
      'Bachelor of Psychological Science',
    ],
    featureTags: ['QS 세계 195위', '캠퍼스 내 쇼핑몰', '통번역 강세', '현지 생활 편함'],
    logoText: 'MQ',
    ieltsRequirement: {
      undergraduate: 6.5,
      postgraduate: 6.5,
      note: '일부 대학원 전공 7.0 요구',
    },
    qsRanking: { world: 195, australia: 16 },
    scholarships: [
      {
        name: "Vice-Chancellor's International Scholarship",
        amount: '등록금 20%',
        condition: '성적 우수 신입 국제학생 자동 심사',
      },
    ],
  },
  {
    id: 's-tafe-nsw',
    name: 'TAFE NSW',
    type: 'tafe',
    city: '시드니',
    description:
      '호주 최대 규모의 직업 교육 기관. 시드니 포함 NSW 전역 캠퍼스를 보유하고 있어 지역 선택이 자유로워요. 요리·IT·비즈니스 디플로마 후 대학 편입 루트로도 많이 활용돼요.',
    fields: ['요리/제과', '비즈니스', 'IT', '건축·인테리어', '간호보조'],
    address: 'Mary Ann St, Ultimo NSW 2007',
    website: 'https://www.tafensw.edu.au',
    tuitionRange: 'AUD 9,000 – 24,000 / year',
    intakePeriods: ['2월', '7월', '10월'],
    cricosCode: '00591E',
    topAgencies: [
      { agencyId: '2', agencyName: '유학스테이션', count: 26 },
      { agencyId: '5', agencyName: '에듀영 (EduYoung)', count: 20 },
      { agencyId: '9', agencyName: '유학아이넷', count: 16 },
    ],
    programs: [
      'Certificate IV in Commercial Cookery',
      'Diploma of Information Technology',
      'Diploma of Business',
      'Certificate III in Patisserie',
      'Diploma of Building and Construction',
    ],
    featureTags: ['NSW 전역 캠퍼스', '대학 편입 가능', '이민 연계 관심', '실무 중심 과정'],
    logoText: 'TA',
    ieltsRequirement: {
      diploma: 5.5,
      note: 'Certificate IV 5.5 / Diploma 5.5–6.0 (과정마다 상이)',
    },
    scholarships: [
      {
        name: 'TAFE NSW 국제학생 장학금',
        amount: 'AUD 1,000 – 3,000',
        condition: '과정별 별도 공고, 성적 및 에세이 심사',
      },
    ],
  },

  // ─────────────────────────────────────────
  // 멜버른
  // ─────────────────────────────────────────
  {
    id: 's-umelb',
    name: 'University of Melbourne',
    type: 'university',
    city: '멜버른',
    description:
      '호주 최고 명문으로 꼽히는 연구 중심 대학. 법·의학·교육 분야 평판이 세계 최상위권이에요. 멜버른 시내에서 도보권으로 생활 편의성도 좋고, 졸업장 프리미엄이 강한 편이에요.',
    fields: ['법학', '의학', '비즈니스', 'IT', '교육'],
    address: 'Parkville VIC 3010',
    website: 'https://www.unimelb.edu.au',
    tuitionRange: 'AUD 36,000 – 65,000 / year',
    intakePeriods: ['2월', '7월'],
    cricosCode: '00116K',
    topAgencies: [
      { agencyId: '1', agencyName: 'IBN유학', count: 31 },
      { agencyId: '6', agencyName: 'YBM유학센터', count: 24 },
      { agencyId: '10', agencyName: '종로유학원 (코이)', count: 18 },
    ],
    programs: [
      'Bachelor of Commerce',
      'Master of Information Technology',
      'Juris Doctor',
      'Master of Engineering',
      'Master of Teaching',
    ],
    featureTags: ['QS 세계 13위', '호주 1위 논란', '법·의학 강세', '졸업장 프리미엄'],
    logoText: 'UM',
    ieltsRequirement: {
      undergraduate: 6.5,
      postgraduate: 7.0,
      note: '각 밴드 6.0 이상 / 법·의대 7.0 전 밴드',
    },
    qsRanking: { world: 13, australia: 2 },
    scholarships: [
      {
        name: 'Graduate Research Scholarship',
        amount: '등록금 전액 + 생활비',
        condition: '연구과정 지원자, 최상위 성적',
      },
      {
        name: 'Melbourne International Undergraduate Scholarship',
        amount: '등록금 50%',
        condition: '학부 신입생, 출신국 상위 성적 기준',
      },
    ],
  },
  {
    id: 's-monash',
    name: 'Monash University',
    type: 'university',
    city: '멜버른',
    description:
      '멜버른 외곽 Clayton 캠퍼스 기반의 대형 종합 대학. 약학·공학·비즈니스로 유명하고 말레이시아 분교도 있어요. 조용한 캠퍼스 생활을 원하는 분들이 자주 선택해요.',
    fields: ['공학', '약학', '비즈니스', 'IT', '간호'],
    address: 'Wellington Rd, Clayton VIC 3800',
    website: 'https://www.monash.edu',
    tuitionRange: 'AUD 30,000 – 55,000 / year',
    intakePeriods: ['2월', '7월'],
    cricosCode: '00008C',
    topAgencies: [
      { agencyId: '7', agencyName: '탑월드유학그룹', count: 22 },
      { agencyId: '4', agencyName: '에듀인 유학원', count: 16 },
      { agencyId: '8', agencyName: '아이월드 유학', count: 12 },
    ],
    programs: [
      'Bachelor of Engineering (Hons)',
      'Bachelor of Pharmacy (Hons)',
      'Master of Business Administration',
      'Master of IT',
      'Bachelor of Nursing',
    ],
    featureTags: ['QS 세계 37위', '약학·공학 강세', '조용한 캠퍼스', '말레이시아 분교'],
    logoText: 'MO',
    ieltsRequirement: {
      undergraduate: 6.5,
      postgraduate: 6.5,
      note: '각 밴드 6.0 이상 / 약학 7.0',
    },
    qsRanking: { world: 37, australia: 6 },
    scholarships: [
      {
        name: 'Monash International Merit Scholarship',
        amount: 'AUD 10,000/year',
        condition: '입학 성적 우수자 자동 심사 (최대 4년)',
      },
      {
        name: 'Monash International Leadership Scholarship',
        amount: '등록금 50%',
        condition: '리더십·봉사 활동 기반 별도 지원',
      },
    ],
  },
  {
    id: 's-rmit',
    name: 'RMIT University',
    type: 'university',
    city: '멜버른',
    description:
      '멜버른 시티 중심부에 위치한 실무 중심 대학. 디자인·IT·건축·패션 계열 후기가 자주 모여요. 파운데이션·디플로마 과정도 운영해서 어학 연수 후 편입 루트로도 많이 활용돼요.',
    fields: ['IT', '디자인', '비즈니스', '건축', '패션'],
    address: '124 La Trobe St, Melbourne VIC 3000',
    website: 'https://www.rmit.edu.au',
    tuitionRange: 'AUD 18,000 – 46,000 / year',
    intakePeriods: ['2월', '7월', '10월'],
    cricosCode: '00122A',
    topAgencies: [
      { agencyId: '5', agencyName: '에듀영 (EduYoung)', count: 25 },
      { agencyId: '2', agencyName: '유학스테이션', count: 18 },
      { agencyId: '9', agencyName: '유학아이넷', count: 11 },
    ],
    programs: [
      'Bachelor of Design (Graphic Design)',
      'Diploma of IT',
      'Bachelor of Business',
      'Master of Architecture',
      'ELICOS (영어과정)',
    ],
    featureTags: ['QS 세계 124위', '시티 캠퍼스', '디자인 강세', '어학 연계 가능'],
    logoText: 'RM',
    ieltsRequirement: {
      undergraduate: 6.5,
      postgraduate: 6.5,
      diploma: 5.5,
      note: '각 밴드 6.0 이상 (디플로마 5.5)',
    },
    qsRanking: { world: 124, australia: 10 },
    scholarships: [
      {
        name: 'RMIT International Excellence Scholarship',
        amount: 'AUD 10,000',
        condition: '신입 국제학생 성적 기반, 자동 심사',
      },
    ],
  },
  {
    id: 's-deakin',
    name: 'Deakin University',
    type: 'university',
    city: '멜버른',
    description:
      '온라인 학습 시스템이 잘 갖춰진 대학으로, 비즈니스·간호·스포츠사이언스 계열 한국인 학생이 많아요. Geelong, Burwood, Warrnambool 등 캠퍼스 선택지가 다양해요.',
    fields: ['비즈니스', '간호', '스포츠사이언스', 'IT', '교육'],
    address: '221 Burwood Hwy, Burwood VIC 3125',
    website: 'https://www.deakin.edu.au',
    tuitionRange: 'AUD 28,000 – 46,000 / year',
    intakePeriods: ['2월', '7월', '10월'],
    cricosCode: '00113B',
    topAgencies: [
      { agencyId: '8', agencyName: '아이월드 유학', count: 19 },
      { agencyId: '4', agencyName: '에듀인 유학원', count: 14 },
    ],
    programs: [
      'Bachelor of Nursing',
      'Bachelor of Business',
      'Master of Business Administration',
      'Bachelor of Sport Science',
      'Master of IT',
    ],
    featureTags: ['QS 세계 233위', '온라인 학습 우수', '간호 강세', '캠퍼스 다양'],
    logoText: 'DK',
    ieltsRequirement: {
      undergraduate: 6.0,
      postgraduate: 6.5,
      note: '간호 학부 7.0 (각 밴드 7.0)',
    },
    qsRanking: { world: 233, australia: 19 },
    scholarships: [
      {
        name: 'Deakin Vice-Chancellor International Scholarship',
        amount: '등록금 25%',
        condition: '성적 우수 신입생, 첫 학기 이후 GPA 70 유지',
      },
    ],
  },

  // ─────────────────────────────────────────
  // 브리즈번 / 골드코스트
  // ─────────────────────────────────────────
  {
    id: 's-uq',
    name: 'University of Queensland',
    type: 'university',
    city: '브리즈번',
    description:
      '브리즈번 대표 명문으로 강변 캠퍼스 경관이 아름다운 것으로도 유명해요. 생명과학·비즈니스·IT 계열 연구 실적이 탄탄하고, 날씨가 좋아서 생활 만족도가 높은 편이에요.',
    fields: ['생명과학', '비즈니스', 'IT', '의학', '공학'],
    address: 'St Lucia QLD 4072',
    website: 'https://www.uq.edu.au',
    tuitionRange: 'AUD 32,000 – 56,000 / year',
    intakePeriods: ['2월', '7월'],
    cricosCode: '00025B',
    topAgencies: [
      { agencyId: '1', agencyName: 'IBN유학', count: 20 },
      { agencyId: '6', agencyName: 'YBM유학센터', count: 15 },
      { agencyId: '10', agencyName: '종로유학원 (코이)', count: 12 },
    ],
    programs: [
      'Bachelor of Business Management',
      'Bachelor of Information Technology',
      'Master of Biotechnology',
      'Bachelor of Engineering (Hons)',
      'Master of Data Science',
    ],
    featureTags: ['QS 세계 40위', '브리즈번 명문', '강변 캠퍼스', '날씨·생활 만족도 높음'],
    logoText: 'UQ',
    ieltsRequirement: {
      undergraduate: 6.5,
      postgraduate: 6.5,
      note: '각 밴드 6.0 이상 / 의대 7.0',
    },
    qsRanking: { world: 40, australia: 7 },
    scholarships: [
      {
        name: 'UQ International Scholarship',
        amount: '등록금 25%',
        condition: '성적 우수 신입 국제학생 자동 심사',
      },
    ],
  },
  {
    id: 's-qut',
    name: 'QUT',
    type: 'university',
    city: '브리즈번',
    description:
      '브리즈번 시내에 위치한 실용 중심 대학. IT·미디어·디자인·비즈니스 계열에서 현지 취업 연계가 활발하고, 졸업생 취업률이 꾸준히 높은 학교예요.',
    fields: ['IT', '미디어', '비즈니스', '디자인', '법학'],
    address: '2 George St, Brisbane City QLD 4000',
    website: 'https://www.qut.edu.au',
    tuitionRange: 'AUD 26,000 – 45,000 / year',
    intakePeriods: ['2월', '7월'],
    cricosCode: '00213J',
    topAgencies: [
      { agencyId: '7', agencyName: '탑월드유학그룹', count: 18 },
      { agencyId: '9', agencyName: '유학아이넷', count: 13 },
    ],
    programs: [
      'Bachelor of Information Technology',
      'Bachelor of Business',
      'Master of Data Analytics',
      'Bachelor of Design (Visual Communication)',
      'Bachelor of Laws',
    ],
    featureTags: ['QS 세계 206위', '브리즈번 시내', '취업률 우수', 'IT·미디어 강세'],
    logoText: 'QT',
    ieltsRequirement: {
      undergraduate: 6.5,
      postgraduate: 6.5,
      note: '각 밴드 6.0 이상',
    },
    qsRanking: { world: 206, australia: 17 },
    scholarships: [
      {
        name: 'QUT International Merit Scholarship',
        amount: 'AUD 5,000',
        condition: '학부·대학원 신입생, 성적 기반 자동 심사',
      },
    ],
  },
  {
    id: 's-griffith',
    name: 'Griffith University',
    type: 'university',
    city: '골드코스트',
    description:
      '골드코스트와 브리즈번 두 도시에 캠퍼스를 운영하는 대학. 음악·예술·환경·비즈니스 계열이 강하고, 골드코스트의 자유롭고 쾌적한 생활 환경을 원하는 분들이 많이 선택해요.',
    fields: ['비즈니스', '음악·예술', '환경과학', '간호', 'IT'],
    address: 'Parklands Dr, Southport QLD 4215',
    website: 'https://www.griffith.edu.au',
    tuitionRange: 'AUD 24,000 – 43,000 / year',
    intakePeriods: ['2월', '7월'],
    cricosCode: '00233E',
    topAgencies: [
      { agencyId: '8', agencyName: '아이월드 유학', count: 16 },
      { agencyId: '5', agencyName: '에듀영 (EduYoung)', count: 11 },
    ],
    programs: [
      'Bachelor of Business',
      'Bachelor of Music',
      'Bachelor of Environmental Science',
      'Bachelor of Nursing',
      'Master of IT',
    ],
    featureTags: ['골드코스트·브리즈번 캠퍼스', '음악·예술 강세', '비치 생활', '소도시 여유'],
    logoText: 'GR',
    ieltsRequirement: {
      undergraduate: 6.0,
      postgraduate: 6.5,
      note: '각 밴드 6.0 이상',
    },
    qsRanking: { world: 346, australia: 24 },
    scholarships: [
      {
        name: 'Griffith Remarkable Scholarship',
        amount: '등록금 50%',
        condition: '최상위 성적 신입생, 별도 지원 필요',
      },
      {
        name: 'Griffith International Student Excellence Scholarship',
        amount: '등록금 25%',
        condition: '성적 우수 신입 국제학생 자동 심사',
      },
    ],
  },

  // ─────────────────────────────────────────
  // 퍼스
  // ─────────────────────────────────────────
  {
    id: 's-curtin',
    name: 'Curtin University',
    type: 'university',
    city: '퍼스',
    description:
      '퍼스 대표 대학으로 광업·공학·비즈니스 계열 평판이 높아요. 조용하고 안전한 퍼스 생활을 원하는 분들이 주로 선택하고, 두바이·말레이시아 분교도 있어요. 한국인 커뮤니티가 작아서 영어 노출이 많다는 게 장점이에요.',
    fields: ['공학', '광업', '비즈니스', 'IT', '과학'],
    address: 'Kent St, Bentley WA 6102',
    website: 'https://www.curtin.edu.au',
    tuitionRange: 'AUD 26,000 – 48,000 / year',
    intakePeriods: ['2월', '7월'],
    cricosCode: '00301J',
    topAgencies: [
      { agencyId: '3', agencyName: 'MKL Sydney', count: 14 },
      { agencyId: '4', agencyName: '에듀인 유학원', count: 10 },
    ],
    programs: [
      'Bachelor of Engineering (Hons)',
      'Bachelor of Commerce',
      'Master of Information Technology',
      'Bachelor of Science',
      'Master of Business Administration',
    ],
    featureTags: ['QS 세계 186위', '퍼스 대표', '영어 노출 많음', '공학·광업 강세'],
    logoText: 'CU',
    ieltsRequirement: {
      undergraduate: 6.0,
      postgraduate: 6.5,
      note: '각 밴드 6.0 이상',
    },
    qsRanking: { world: 186, australia: 14 },
    scholarships: [
      {
        name: 'Curtin International Scholarships',
        amount: 'AUD 4,000 – 8,000',
        condition: '성적 기반, 신입 국제학생 자동 심사',
      },
    ],
  },
];
