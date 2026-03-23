-- ============================================================
-- Yuhu — 학교 시드 데이터 v2
-- 추가 항목: 어학원(language) 10개, 파운데이션(foundation) 5개,
--            추가 TAFE 3개, 사립 컬리지/RTO 3개
-- 실행 방법: Supabase Dashboard → SQL Editor → 이 파일 전체 붙여넣기 후 Run
-- ============================================================

-- ─────────────────────────────────────────
-- 파운데이션 / 패스웨이
-- ─────────────────────────────────────────

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'UNSW Global (파운데이션)',
  'foundation',
  '시드니',
  'UNSW Sydney 직속 파운데이션 기관. 호주에서 가장 오래 운영된 파운데이션 프로그램 중 하나로, 수료 후 UNSW 학부 패스웨이 입학이 가능해요. 이과·공학·비즈니스 트랙이 특히 인기 있고, 연 4회 입학으로 시작 시점을 유연하게 선택할 수 있어요.',
  ARRAY['이과·공학','비즈니스','IT','인문·사회'],
  'Gate 11, Botany St, Kensington NSW 2033',
  'https://www.unswglobal.unsw.edu.au',
  'AUD 22,000 – 26,000 / year',
  ARRAY['1월','4월','7월','10월'],
  '00098G',
  'unsw-global-foundation',
  ARRAY['Foundation Studies — Science & Engineering','Foundation Studies — Business','Foundation Studies — Humanities & Social Sciences','English for Academic Purposes (EAP)'],
  ARRAY['UNSW 직속 패스웨이','호주 최장 운영 파운데이션','연 4회 입학','학부 패스웨이 보장'],
  'UG'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'Monash College (파운데이션)',
  'foundation',
  '멜버른',
  'Monash University 직속 파운데이션 컬리지. 수료 후 Monash University 200개 이상 학부 과정 보장 입학이 핵심 강점이에요. 비자 1장으로 파운데이션+학위 과정이 커버되고, 8개월 속성 코스도 선택할 수 있어요. 멜버른 남동부 조용한 Caulfield 캠퍼스에 위치해요.',
  ARRAY['비즈니스','이과·공학','IT','인문','건강'],
  '900 Dandenong Rd, Caulfield VIC 3145',
  'https://www.monashcollege.edu.au',
  'AUD 29,000 – 40,000 / year',
  ARRAY['1월','7월'],
  '071178G',
  'monash-college',
  ARRAY['Monash University Foundation Year (MUFY) — Standard','Monash University Foundation Year — Accelerated (8개월)','Monash University Diploma'],
  ARRAY['Monash 200+ 학부 보장 입학','비자 1장 파운데이션+학위','8개월 속성 가능','멜버른 Caulfield 캠퍼스'],
  'MC'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'UQ College (파운데이션)',
  'foundation',
  '브리즈번',
  'University of Queensland 직속 파운데이션 컬리지. 수료 후 UQ 학부 직편입 루트가 명확하고, 영어 요건 미달 시 Integrated English 패키지로도 입학 가능해요. 고성적 학생에게는 장학금(20% 학비 감면)이 자동 적용되는 게 장점이에요.',
  ARRAY['비즈니스','이과','IT','인문','공학'],
  'Campbell Place, 20 Staff House Rd, St Lucia QLD 4067',
  'https://uqcollege.uq.edu.au',
  'AUD 23,000 – 30,000 / year',
  ARRAY['2월','7월'],
  '04039H',
  'uq-college',
  ARRAY['Foundation Program (Standard)','Foundation Program (Accelerated)','Integrated English + Foundation Package'],
  ARRAY['UQ 직속 패스웨이','우수 학생 20% 장학금 자동 적용','영어 패키지 입학 가능','브리즈번 St Lucia 캠퍼스'],
  'UC'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'SIBT (Sydney Institute of Business & Technology)',
  'foundation',
  '시드니',
  'Navitas 그룹 소속 시드니 대표 패스웨이 컬리지. 디플로마 수료 후 Western Sydney University(WSU) 2학년 직편입이 보장되는 구조예요. 3학기제로 8개월 만에 디플로마를 수료할 수 있어서 빠른 대학 진학을 원하는 분들이 많이 선택해요. 한국·아시아 학생 선호도가 높아요.',
  ARRAY['비즈니스','IT','인문','간호'],
  '1-7 Broadway, Ultimo NSW 2007',
  'https://sibt.nsw.edu.au',
  'AUD 13,000 – 18,000 / year',
  ARRAY['3월','7월','10월'],
  '01484E',
  'sibt',
  ARRAY['Foundation Program','Diploma of Business','Diploma of Information Technology','Diploma of Social Science','Diploma of Nursing Studies'],
  ARRAY['WSU 2학년 편입 보장','8개월 속성 디플로마','Navitas 그룹 안정성','시드니 Ultimo 위치'],
  'SB'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'La Trobe College Australia (LTCA)',
  'foundation',
  '멜버른',
  'La Trobe University 직속 패스웨이 컬리지. 파운데이션·디플로마 수료 후 La Trobe University 학부 보장 입학 구조예요. 비자 1장으로 패스웨이+학위 과정이 커버되고, 1월·6월·10월 연 3회 입학이 가능해요. 생명과학·비즈니스·IT 트랙이 인기 있어요.',
  ARRAY['비즈니스·IT','건강·생명과학','인문','공학'],
  'Bundoora Campus, La Trobe University, Melbourne VIC 3086',
  'https://www.latrobecollegeaustralia.edu.au',
  'AUD 28,000 – 40,000 / year',
  ARRAY['1월','6월','10월'],
  '085026J',
  'latrobe-college',
  ARRAY['Foundation Studies (8개월 Standard)','Diploma — Bioscience (12개월)','Diploma — Business & IT','Diploma — Health Sciences'],
  ARRAY['La Trobe 보장 입학','비자 1장 패스웨이+학위','연 3회 입학','디플로마 장학금 (한정)'],
  'LT'
)
on conflict (slug) where slug is not null do nothing;

-- ─────────────────────────────────────────
-- 추가 TAFE — 각 주별
-- ─────────────────────────────────────────

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'TAFE Queensland',
  'tafe',
  '브리즈번',
  '퀸즐랜드주 최대 직업교육 기관. 브리즈번(South Bank), 골드코스트(Robina·Southport), 선샤인코스트 등 10개 이상 지역 캠퍼스를 운영해요. 호스피탈리티·비즈니스·IT 디플로마가 인기 있고, QLD의 따뜻한 기후를 선호하는 한국인 학생이 많이 선택해요.',
  ARRAY['호스피탈리티','비즈니스','IT','건강','엔지니어링'],
  '66 Ernest St, South Brisbane QLD 4101',
  'https://tafeqld.edu.au/international',
  'AUD 10,000 – 25,000 / year',
  ARRAY['1월','4월','7월','10월'],
  '03020E',
  'tafe-queensland',
  ARRAY['Diploma of Hospitality Management','Diploma of Business','Diploma of Accounting','Certificate IV in Information Technology','Diploma of Community Services'],
  ARRAY['QLD 전역 10+ 캠퍼스','골드코스트·선샤인코스트 선택','150개+ 국제 과정','따뜻한 기후'],
  'TQ'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'Box Hill Institute',
  'tafe',
  '멜버른',
  '멜버른 동부 Box Hill에 위치한 TAFE 기관. 제과·제빵·요리 과정이 특히 유명하고 전문 교육 시설이 잘 갖춰져 있어요. 수료 후 La Trobe, Swinburne 등 파트너 대학으로 편입 경로도 연결돼요. 요리/제과 루트로 한국인 학생이 많이 선택하는 곳이에요.',
  ARRAY['요리·제과','비즈니스','IT','미용·뷰티','유아교육'],
  '465 Elgar Rd, Box Hill VIC 3128',
  'https://www.boxhill.edu.au/international-students',
  'AUD 7,500 – 18,000 / year',
  ARRAY['1월','7월'],
  '00148C',
  'box-hill-institute',
  ARRAY['Certificate III in Patisserie','Certificate IV in Commercial Cookery','Diploma of Hospitality Management','Diploma of Business','Certificate IV in Beauty Therapy'],
  ARRAY['요리·제과 명문 TAFE','멜버른 동부 조용한 환경','파트너 대학 편입 가능','한국인 선호 높음'],
  'BH'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'North Metropolitan TAFE',
  'tafe',
  '퍼스',
  '퍼스 북부 메트로 지역 최대 TAFE 기관. 퍼스 도심 캠퍼스가 있어 접근이 편리해요. 국제학생은 TIWA(TAFE International WA)를 통해 지원해요. IT·비즈니스·호스피탈리티·미용 과정이 주력이고, 생활비가 저렴한 퍼스에서 실용적인 직업 기술을 배우려는 분들이 선택해요.',
  ARRAY['IT','비즈니스','호스피탈리티','건강','미용'],
  '35 Pier St, Perth WA 6000',
  'https://www.northmetrotafe.wa.edu.au/international-students',
  'AUD 8,000 – 18,000 / year',
  ARRAY['1월','4월','7월','10월'],
  '00020G',
  'north-metropolitan-tafe',
  ARRAY['Diploma of Information Technology','Certificate IV in Commercial Cookery','Diploma of Business','Certificate III in Hospitality','Diploma of Beauty Therapy'],
  ARRAY['TIWA 통한 지원','퍼스 도심 접근 편리','100개+ 과정','WA 주립 TAFE'],
  'NM'
)
on conflict (slug) where slug is not null do nothing;

-- ─────────────────────────────────────────
-- 사립 컬리지 / RTO — 크리에이티브·전문 분야
-- ─────────────────────────────────────────

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'AIE (Academy of Interactive Entertainment)',
  'rto',
  '시드니',
  '1996년 설립된 호주 최고 수준의 게임개발·3D 애니메이션·VFX·영화제작 전문 교육기관. 시드니·멜버른·캔버라 캠퍼스에서 디플로마·학위 과정을 제공해요. 졸업생이 Ubisoft, EA 등 글로벌 게임사에 다수 취업하는 곳으로 유명하고, 게임·애니메이션에 진지한 한국인 학생 사이에서 인지도가 높아요.',
  ARRAY['게임개발','3D 애니메이션','VFX','영화제작'],
  'Level 2, 185-211 Broadway, Sydney NSW 2007',
  'https://aie.edu.au',
  'AUD 18,000 – 32,000 / year',
  ARRAY['2월','7월'],
  '02406F',
  'aie',
  ARRAY['Advanced Diploma of Professional Game Development','Diploma of Screen and Media (3D Animation & VFX)','Bachelor of Game Development','Advanced Diploma of Film & Television'],
  ARRAY['게임·애니메이션 특화 1위','1996년 설립 글로벌 네트워크','Ubisoft·EA 취업 연계','시드니·멜버른·캔버라 캠퍼스'],
  'AI'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'SAE University College',
  'college',
  '시드니',
  '오디오 엔지니어링·영상제작·게임디자인·뮤직프로덕션 과정을 시드니·멜버른·브리즈번·애들레이드·퍼스 등 6개 캠퍼스에서 제공하는 크리에이티브 미디어 특화 대학이에요. 음악·미디어 분야를 꿈꾸는 한국인 유학생 선호도가 높고, 실습 중심 커리큘럼이 강점이에요.',
  ARRAY['오디오 엔지니어링','영상제작','게임디자인','애니메이션','뮤직프로덕션'],
  '215-217 Clarence St, Sydney NSW 2000',
  'https://sae.edu.au',
  'AUD 22,000 – 40,000 / year',
  ARRAY['2월','5월','9월'],
  '00312F',
  'sae-university-college',
  ARRAY['Bachelor of Audio (Production)','Bachelor of Film (Production)','Bachelor of Game Development','Bachelor of Animation','Higher Certificate in Music Production'],
  ARRAY['오디오·미디어 명문','호주 6개 캠퍼스','Navitas 계열 글로벌 네트워크','실습 중심 커리큘럼'],
  'SA'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'Billy Blue College of Design',
  'college',
  '시드니',
  'Torrens University 산하 디자인 전문 사립 컬리지. 그래픽디자인·인테리어디자인·UX·패션·3D 애니메이션 과정이 주력이에요. 디자인 실무 포트폴리오 중심 교육으로 취업 연계가 강하고, 시드니 Surry Hills 크리에이티브 지구에 위치해 있어요.',
  ARRAY['그래픽디자인','인테리어디자인','UX·웹디자인','패션','3D 애니메이션'],
  'Surry Hills NSW 2010',
  'https://www.torrens.edu.au/billy-blue-college-of-design',
  'AUD 22,000 – 35,000 / year',
  ARRAY['2월','7월'],
  '03389E',
  'billy-blue-college',
  ARRAY['Bachelor of Design (Graphic Design)','Bachelor of Design (Interior Design)','Bachelor of Design (UX & Web Design)','Bachelor of Design (Fashion Design)','Master of Design'],
  ARRAY['Torrens University 산하','디자인 포트폴리오 특화','시드니 Surry Hills 크리에이티브 지구','소규모 클래스'],
  'BB'
)
on conflict (slug) where slug is not null do nothing;

-- ─────────────────────────────────────────
-- 어학원 (Language Schools) — 시드니
-- ─────────────────────────────────────────

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'ILSC Language School Sydney',
  'language',
  '시드니',
  '시드니 CBD 한가운데 위치한 글로벌 어학원 체인. English Only Policy를 엄격히 적용해서 모국어 의존 없이 영어 실력을 빠르게 올리기 좋아요. 한국인 비율이 상대적으로 낮아 다양한 국적 학생들과 어울릴 수 있고, 멜버른·브리즈번 캠퍼스와 무료 이동이 가능한 것도 장점이에요.',
  ARRAY['General English','IELTS 준비','EAP','Cambridge 시험'],
  'Level 6, 532-540 George St, Sydney NSW 2000',
  'https://www.ilsc.com/language-schools/destinations/australia',
  'AUD 380 – 450 / week',
  ARRAY['매주 월요일'],
  '02137M',
  'ilsc-sydney',
  ARRAY['General English (Communication / Business / Creative 트랙)','IELTS Mastery Program','English for Academic Purposes (EAP)','Cambridge FCE / CAE Preparation'],
  ARRAY['English Only Policy','시드니 CBD 중심','한국인 비율 낮음','멜버른·브리즈번 캠퍼스 이동 가능'],
  'IL'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'Greenwich English College Sydney',
  'language',
  '시드니',
  '시드니 Haymarket(차이나타운 인근)과 시티 두 캠퍼스를 운영하는 어학원. NextEd 그룹 소속으로 평균 600명 이상이 재학 중이에요. 30개국 이상의 다양한 국적이 모이고, 대학 진학을 위한 EAP 과정이 강점이에요. 시드니 유학원을 통한 등록이 많은 편이에요.',
  ARRAY['General English','IELTS 준비','Cambridge 시험','EAP','Business English'],
  'Level 5, 187 Thomas St, Haymarket NSW 2010',
  'https://www.greenwichcollege.edu.au',
  'AUD 350 – 430 / week',
  ARRAY['매주 월요일'],
  '02672K',
  'greenwich-english-sydney',
  ARRAY['General English (ELICOS)','IELTS Preparation','Cambridge FCE / CAE Preparation','English for Academic Purposes (EAP)','Business English'],
  ARRAY['시드니 2개 캠퍼스','30개국+ 다국적','대학 EAP 연계','NextEd 그룹'],
  'GW'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'Navitas English Sydney',
  'language',
  '시드니',
  '하이드파크 인근에 위치한 어학원. 최대 수강 인원 18명의 소규모 클래스 운영이 강점이에요. Navitas 그룹의 대학 패스웨이 연계 어학 과정이 잘 설계되어 있어서, 어학 연수 후 대학 디플로마·학위 과정으로 이어지는 루트를 원하는 분들이 많이 선택해요.',
  ARRAY['General English','IELTS 준비','Cambridge 시험','EAP'],
  '255 Elizabeth St, Sydney NSW 2000',
  'https://www.navitasenglish.edu.au',
  'AUD 375 – 510 / week',
  ARRAY['매주 월요일'],
  '00289M',
  'navitas-english-sydney',
  ARRAY['General English (Beginner ~ Advanced)','Cambridge Preparation (B1/B2/C1/C2)','Academic English Preparation (AEP)','IELTS Preparation'],
  ARRAY['소규모 클래스 (최대 18명)','하이드파크 인근','대학 패스웨이 연계','Navitas 그룹'],
  'NE'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'ELSIS English Language Schools Sydney',
  'language',
  '시드니',
  '1991년 설립된 시드니 대표 어학원 중 하나. Ultimo 캠퍼스에 위치해 있고, 남미·아시아·유럽 등 다양한 국적 학생이 모여요. 비즈니스 영어·Cambridge 시험 준비 과정이 잘 갖춰져 있고, 장기 수강 시 학비 할인 혜택이 있어요.',
  ARRAY['General English','IELTS 준비','Cambridge 시험','EAP','Business English'],
  'Level 10, 700 Harris St, Ultimo NSW 2007',
  'https://www.elsis.edu.au',
  'AUD 350 – 420 / week',
  ARRAY['매주 월요일'],
  '02644C',
  'elsis-sydney',
  ARRAY['General English','IELTS Preparation','Cambridge Exam Preparation','English for Academic Purposes (EAP)','Business English'],
  ARRAY['1991년 설립 역사','Ultimo 캠퍼스','다국적 구성','Business English 강점'],
  'EL'
)
on conflict (slug) where slug is not null do nothing;

-- ─────────────────────────────────────────
-- 어학원 (Language Schools) — 멜버른
-- ─────────────────────────────────────────

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'ILSC Language School Melbourne',
  'language',
  '멜버른',
  '멜버른 CBD Spencer St역 바로 옆에 위치한 ILSC 멜버른 캠퍼스. English Only Policy를 엄격히 적용하고, 다양한 국적의 학생이 모여요. 시드니·브리즈번 캠퍼스와 무료 이동이 가능해서 호주 여러 도시를 경험하고 싶은 분들에게 유리해요.',
  ARRAY['General English','IELTS 준비','EAP','Cambridge 시험'],
  'Level 7, 120 Spencer St, Melbourne VIC 3000',
  'https://www.ilsc.com/language-schools/destinations/australia',
  'AUD 380 – 450 / week',
  ARRAY['매주 월요일'],
  '02137M',
  'ilsc-melbourne',
  ARRAY['General English (Communication / Business / Creative 트랙)','IELTS Mastery Program','English for Academic Purposes (EAP)','Cambridge FCE / CAE Preparation'],
  ARRAY['English Only Policy','Spencer St역 바로 옆','시드니·브리즈번 캠퍼스 이동 가능','다양한 국적'],
  'IL'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'Discover English Melbourne',
  'language',
  '멜버른',
  '멜버른 CBD Collins St 황금 위치에 자리한 소형 어학원. 2010년 설립으로 비교적 신생이지만 수상 경력을 보유하고 있어요. 코스 다양성이 강점으로, Business English·스터디 투어·기업 교육까지 폭넓게 제공해요. 소규모 클래스로 교사 접근성이 높아요.',
  ARRAY['General English','IELTS 준비','Business English','EAP','Cambridge 시험'],
  '247 Collins St, Melbourne VIC 3000',
  'https://www.discoverenglish.vic.edu.au',
  'AUD 350 – 420 / week',
  ARRAY['매주 월요일'],
  '02995B',
  'discover-english-melbourne',
  ARRAY['General English','IELTS Preparation','Business English','English for Academic Purposes (EAP)','Cambridge Exam Preparation'],
  ARRAY['Collins St 황금 위치','소규모 클래스','수상 경력 보유','Business English 특화'],
  'DE'
)
on conflict (slug) where slug is not null do nothing;

-- ─────────────────────────────────────────
-- 어학원 (Language Schools) — 브리즈번
-- ─────────────────────────────────────────

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'BROWNS English Language School Brisbane',
  'language',
  '브리즈번',
  '2003년 설립, 한국인 유학생 사이에서 인지도가 매우 높은 브리즈번 대표 어학원. King George Square 인근 위치로 접근성이 좋아요. English Only Policy를 엄격히 적용하고, IELTS·Cambridge 시험 준비 과정이 특히 강해요. 골드코스트 캠퍼스로의 이동도 가능해요.',
  ARRAY['General English','IELTS 준비','Cambridge 시험','TOEFL 준비','EAP'],
  'Level 8, 102 Adelaide St, Brisbane City QLD 4000',
  'https://brownsenglish.edu.au',
  'AUD 350 – 430 / week',
  ARRAY['매주 월요일'],
  '02663M',
  'browns-brisbane',
  ARRAY['General English','IELTS Exam Preparation','Cambridge FCE / CAE Preparation','Advanced English Academic Practice','TOEFL Preparation'],
  ARRAY['한국인 인지도 최상위','English Only Policy 엄격','브리즈번 CBD 중심','골드코스트 캠퍼스 이동 가능'],
  'BR'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'ILSC Language School Brisbane',
  'language',
  '브리즈번',
  '브리즈번 CBD Adelaide St에 위치한 ILSC 브리즈번 캠퍼스. English Only Policy를 엄격히 적용하고, 한국인 유학생에게도 인지도가 높아요. 시드니·멜버른 캠퍼스로의 무료 이동이 가능해서 도시 이동을 원하는 분들이 선택해요.',
  ARRAY['General English','IELTS 준비','EAP','Cambridge 시험'],
  'Level 1, 232 Adelaide St, Brisbane City QLD 4000',
  'https://www.ilsc.com/language-schools/destinations/australia',
  'AUD 380 – 450 / week',
  ARRAY['매주 월요일'],
  '02137M',
  'ilsc-brisbane',
  ARRAY['General English','IELTS Mastery Program','English for Academic Purposes (EAP)','Cambridge Preparation'],
  ARRAY['English Only Policy','브리즈번 CBD','시드니·멜버른 캠퍼스 이동 가능','다양한 국적'],
  'IL'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'Lexis English Brisbane',
  'language',
  '브리즈번',
  'Queen Street Mall 바로 옆 22층에 위치한 어학원으로 전망이 좋기로 유명해요. 소규모 클래스(평균 11명)를 운영해서 개인 맞춤형 수업이 가능하고, Cambridge 시험 준비 과정이 특히 강점이에요. 한국인 유학생들 사이에서 긍정적인 후기가 많아요.',
  ARRAY['General English','IELTS 준비','Cambridge 시험','고교 영어'],
  'Level 22, 333 Ann St, Brisbane QLD 4000',
  'https://brisbane.lexisenglish.com',
  'AUD 350 – 500 / week',
  ARRAY['매주 월요일'],
  '02499G',
  'lexis-brisbane',
  ARRAY['General English','IELTS Preparation','Cambridge B2 First (FCE)','Cambridge C1 Advanced (CAE)','Cambridge C2 Proficiency (CPE)'],
  ARRAY['소규모 클래스 (평균 11명)','22층 전망 명소','Queen Street Mall 바로 옆','Cambridge 과정 강세'],
  'LX'
)
on conflict (slug) where slug is not null do nothing;

-- ─────────────────────────────────────────
-- 어학원 (Language Schools) — 골드코스트
-- ─────────────────────────────────────────

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'BROWNS English Language School Gold Coast',
  'language',
  '골드코스트',
  '골드코스트 Southport 중심에 위치한 BROWNS 골드코스트 캠퍼스. 해변과 가깝고 날씨가 좋아서 공부와 라이프스타일 두 마리 토끼를 잡고 싶은 분들이 선택해요. 브리즈번 캠퍼스와 같은 법인으로 캠퍼스 이동이 자유롭고, English Only Policy를 동일하게 적용해요.',
  ARRAY['General English','IELTS 준비','Cambridge 시험','EAP'],
  '5 Hicks St, Southport QLD 4215',
  'https://brownsenglish.edu.au',
  'AUD 350 – 430 / week',
  ARRAY['매주 월요일'],
  '02663M',
  'browns-gold-coast',
  ARRAY['General English','IELTS Exam Preparation','Cambridge FCE / CAE Preparation','Advanced English Academic Practice'],
  ARRAY['해변 근접 어학원','골드코스트 Southport','브리즈번 캠퍼스 이동 가능','English Only Policy'],
  'BR'
)
on conflict (slug) where slug is not null do nothing;

-- ─────────────────────────────────────────
-- 어학원 (Language Schools) — 퍼스
-- ─────────────────────────────────────────

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'Lexis English Perth',
  'language',
  '퍼스',
  '퍼스 CBD 메인 스트리트(St George''s Terrace)에 위치한 어학원. 소규모 클래스로 운영되어 교사와의 상호작용이 많고, Cambridge 시험 준비 과정이 강점이에요. 퍼스는 영어 노출이 많고 한국인 커뮤니티가 작아서 실력 향상이 빠르다는 후기가 많아요.',
  ARRAY['General English','IELTS 준비','Cambridge 시험','고교 영어'],
  'St George''s Terrace, Perth WA 6000',
  'https://perthcity.lexisenglish.com',
  'AUD 350 – 500 / week',
  ARRAY['매주 월요일'],
  '01632D',
  'lexis-perth',
  ARRAY['General English','IELTS Preparation','Cambridge Preparation (PET/FCE/CAE/CPE)','High School English'],
  ARRAY['퍼스 CBD 메인 스트리트','소규모 클래스','영어 노출 높은 환경','Cambridge 과정 강세'],
  'LX'
)
on conflict (slug) where slug is not null do nothing;

insert into schools (name, type, city, description, fields, address, website, tuition_range, intake_periods, cricos_code, slug, programs, feature_tags, logo_text)
values (
  'Navitas English Perth',
  'language',
  '퍼스',
  '퍼스 CBD 인근 Northbridge에 위치한 어학원. Navitas 그룹 특유의 소규모 클래스와 대학 패스웨이 연계 어학 과정이 강점이에요. 퍼스에서 어학 연수 후 Curtin, ECU 등 대학 진학을 계획하는 분들이 많이 선택해요.',
  ARRAY['General English','IELTS 준비','Cambridge 시험','EAP'],
  '211 Newcastle St, Northbridge WA 6003',
  'https://www.navitasenglish.edu.au',
  'AUD 375 – 510 / week',
  ARRAY['매주 월요일'],
  '00289M',
  'navitas-english-perth',
  ARRAY['General English (Beginner ~ Advanced)','Cambridge Preparation','IELTS Preparation','Academic English Preparation (AEP)'],
  ARRAY['소규모 클래스','퍼스 Northbridge 위치','대학 패스웨이 연계','Navitas 그룹'],
  'NE'
)
on conflict (slug) where slug is not null do nothing;

-- ============================================================
-- 완료 메시지
-- ============================================================
-- 위 SQL 실행 후 아래 쿼리로 확인:
-- select type, count(*) from schools group by type order by type;
-- select name, type, city from schools order by type, city, name;
