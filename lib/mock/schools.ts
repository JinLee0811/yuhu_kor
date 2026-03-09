import type { School } from '@/types/school';

export const mockSchools: School[] = [
  {
    id: 's-unsw',
    name: 'UNSW',
    type: 'university',
    city: '시드니',
    description:
      'UNSW는 공대와 비즈니스, 데이터 계열로 많이 찾는 시드니 대표 대학교예요. 국제학생 지원이 잘 갖춰져 있고 취업 연계 프로그램도 자주 언급돼요.',
    fields: ['IT', '비즈니스', '간호', '디자인'],
    address: 'High St, Kensington NSW 2052',
    website: 'https://www.unsw.edu.au',
    tuitionRange: 'AUD 32,000 - 58,000 / year',
    intakePeriods: ['2월', '5월', '9월'],
    cricosCode: '00098G',
    topAgencies: [],
    programs: ['Bachelor of Engineering', 'Master of IT', 'Bachelor of Commerce'],
    featureTags: ['취업지원', '산학연계', '공대강세'],
    logoText: 'UN'
  },
  {
    id: 's-uts',
    name: 'UTS',
    type: 'university',
    city: '시드니',
    description:
      'UTS는 도심 접근성이 좋고 실무 중심 커리큘럼으로 많이 언급되는 학교예요. IT, 디자인, 비즈니스 계열 후기가 자주 모여요.',
    fields: ['IT', '비즈니스', '디자인'],
    address: '15 Broadway, Ultimo NSW 2007',
    website: 'https://www.uts.edu.au',
    tuitionRange: 'AUD 28,000 - 52,000 / year',
    intakePeriods: ['2월', '7월', '11월'],
    cricosCode: '00099F',
    topAgencies: [],
    programs: ['Bachelor of IT', 'Bachelor of Design', 'Master of Business Analytics'],
    featureTags: ['도심캠퍼스', '실무중심', '국제학생지원'],
    logoText: 'UT'
  },
  {
    id: 's-tafe-nsw',
    name: 'TAFE NSW',
    type: 'tafe',
    city: '시드니',
    description:
      'TAFE NSW는 실무형 과정과 캠퍼스 선택지가 많아서 기술직, 요리, 비즈니스 쪽으로 많이 찾는 대표 TAFE예요.',
    fields: ['요리', '비즈니스', '디자인', 'IT'],
    address: 'Mary Ann St, Ultimo NSW 2007',
    website: 'https://www.tafensw.edu.au',
    tuitionRange: 'AUD 9,000 - 24,000 / year',
    intakePeriods: ['2월', '7월', '10월'],
    cricosCode: '00591E',
    topAgencies: [],
    programs: ['Diploma of IT', 'Certificate IV in Commercial Cookery', 'Diploma of Business'],
    featureTags: ['실무과정', '지역캠퍼스다양', '이민연계관심'],
    logoText: 'TA'
  },
  {
    id: 's-rmit',
    name: 'RMIT University',
    type: 'college',
    city: '멜버른',
    description:
      'RMIT는 멜버른 시티 중심에 있고 비즈니스, 디자인, IT, 파운데이션 과정으로 자주 비교되는 학교예요.',
    fields: ['IT', '비즈니스', '디자인', '영어'],
    address: '124 La Trobe St, Melbourne VIC 3000',
    website: 'https://www.rmit.edu.au',
    tuitionRange: 'AUD 18,000 - 46,000 / year',
    intakePeriods: ['2월', '7월', '10월'],
    cricosCode: '00122A',
    topAgencies: [],
    programs: ['Diploma of IT', 'Bachelor of Business', 'ELICOS'],
    featureTags: ['시티캠퍼스', '디자인강세', '어학과정'],
    logoText: 'RM'
  },
  {
    id: 's-usyd',
    name: 'University of Sydney',
    type: 'university',
    city: '시드니',
    description:
      '시드니대는 전통 있는 종합대학으로, 학업 분위기와 캠퍼스 만족도 이야기가 많이 올라오는 편이에요.',
    fields: ['IT', '비즈니스', '간호', '기타'],
    address: 'Camperdown NSW 2006',
    website: 'https://www.sydney.edu.au',
    tuitionRange: 'AUD 34,000 - 60,000 / year',
    intakePeriods: ['2월', '8월'],
    cricosCode: '00026A',
    topAgencies: [],
    programs: ['Bachelor of IT', 'Bachelor of Commerce', 'Master of Nursing'],
    featureTags: ['명문대', '연구중심', '캠퍼스만족도'],
    logoText: 'SY'
  },
  {
    id: 's-mq',
    name: 'Macquarie University',
    type: 'university',
    city: '시드니',
    description:
      '맥쿼리대는 비즈니스, 통번역, IT 계열로 많이 찾고, 캠퍼스 생활 만족도가 높은 편으로 자주 언급돼요.',
    fields: ['IT', '비즈니스', '기타'],
    address: '4 Research Park Dr, Macquarie Park NSW 2113',
    website: 'https://www.mq.edu.au',
    tuitionRange: 'AUD 30,000 - 49,000 / year',
    intakePeriods: ['2월', '7월'],
    cricosCode: '00002J',
    topAgencies: [],
    programs: ['Master of Information Systems', 'Bachelor of Commerce', 'Master of Translation'],
    featureTags: ['캠퍼스넓음', '비즈니스강세', '현지생활편함'],
    logoText: 'MQ'
  }
];
