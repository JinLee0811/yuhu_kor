/**
 * 유후(Yuhu) 사전 후기 데이터 수집 — Google Forms 자동 빌더 (v3)
 *
 * v3 변경사항 (2026-04-27):
 * - 추천 의향 NPS (0~10) 추가 — 평점 평균과 별도 신뢰도 시그널
 * - 상담 형태 (직접 방문/화상/카톡/이메일) 추가 — consultation 분기에만
 * - 사후관리 평가 분기 텍스트 정리
 *
 * v2 변경사항:
 * - Q2 분기: 3가지(상담/등록/사후관리) → 2가지(상담만/등록+학교)
 * - 사후관리는 등록+학교 후기 안에 선택적 추가 평가로 통합
 * - 인증 파일 업로드 추가 (선택):
 *     상담만 → 카톡 대화내역 스크린샷 1개
 *     등록+학교 → 입학확인서/COE/학생증/비자 승인 이메일 중 최대 3개
 *
 * 사용법:
 * 1. https://sheets.new 접속 (빈 스프레드시트 생성)
 * 2. 상단 메뉴: 확장 프로그램 → Apps Script
 * 3. 열린 에디터 코드 전부 삭제 → 이 파일 전체 복붙
 * 4. 상단 [실행] 클릭 → 권한 승인
 * 5. [실행 로그]에서 폼 편집 URL 및 공유 URL 확인
 *
 * 결과: 5페이지 / 분기 2단계 / 인증 파일 업로드 / 사후관리 통합형 폼 자동 생성
 */

function createYuhuReviewSurvey() {
  const form = FormApp.create('🇦🇺 호주 유학원 후기 — 유후(Yuhu) 사전 데이터');

  form.setDescription(
    '안녕! 광고 없는 호주 유학원 리뷰 플랫폼 "유후(Yuhu)"를 준비 중인 정진이야.\n\n' +
    '너의 솔직한 후기 한 편이 다른 유학생들에게 진짜 도움이 돼.\n\n' +
    '📌 어떤 후기를 받아?\n' +
    '• 상담만 받은 경험 (등록 안 한 경우 포함)\n' +
    '• 등록하고 학교까지 간 경험 (사후관리도 함께 평가 가능)\n\n' +
    '⏱️ 5~7분 / 익명 처리\n' +
    '🔒 인증 자료 첨부 시 ✅ 인증 후기 배지 부여 (선택)\n' +
    '🎁 답해준 사람에겐 런칭 시 가장 먼저 알려주고 프리미엄 첫 달 무료!'
  );

  form.setProgressBar(true);
  form.setCollectEmail(false);
  form.setShowLinkToRespondAgain(true);
  form.setLimitOneResponsePerUser(false);
  form.setAcceptingResponses(true);

  // =====================================================================
  // 공통 옵션 (코드 mock 데이터와 1:1 매핑)
  // =====================================================================
  const AGENCIES = [
    'IBN유학',
    '유학스테이션',
    'MKL Sydney',
    '에듀인 유학원',
    '에듀영 (EduYoung)',
    'YBM유학센터',
    '탑월드유학그룹',
    '아이월드 유학',
    '유학아이넷',
    '종로유학원 (코이)'
  ];

  const PURPOSES = ['어학연수', '대학진학', 'TAFE', 'VET', '조기유학', '워킹홀리데이', '기타'];
  const CITIES = ['시드니', '멜버른', '브리즈번', '골드코스트', '퍼스', '캔버라', '애들레이드', '기타'];
  const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

  const PROS_CONSULT = [
    '연락/응답이 빨랐어요',
    '학교 옵션을 다양하게 비교해줬어요',
    '압박 없이 편하게 상담했어요',
    '비자/서류 절차를 꼼꼼히 안내해줬어요',
    '내 상황에 맞게 맞춤 상담해줬어요',
    '비용을 투명하게 설명해줬어요'
  ];
  const CONS_CONSULT = [
    '특정 학교만 계속 추천했어요',
    '비용 설명이 불명확했어요',
    '영주권/취업 전망을 너무 장밋빛으로 얘기했어요',
    '담당자가 자꾸 바뀌었어요',
    '상담사가 전문성이 부족한 느낌이었어요',
    '연락이 잘 안 됐어요'
  ];

  const PROS_FULL = [
    '입학 서류 준비를 체계적으로 도와줬어요',
    '비자 신청 과정에서 실수가 없었어요',
    '학교 오리엔테이션 전까지 꼼꼼히 챙겨줬어요',
    '학교 선택을 후회하지 않아요',
    '예상한 것과 실제 학교 환경이 일치했어요',
    '문제가 생겼을 때 빠르게 해결해줬어요'
  ];
  const CONS_FULL = [
    '등록하고 나서 연락이 뜸해졌어요',
    '설명과 실제 학교 환경이 달랐어요',
    '서류 누락으로 비자가 지연됐어요',
    '학교 문제 생겼을 때 도움을 못 받았어요',
    '담당자가 바뀌고 나서 관리가 소홀해졌어요',
    '약속한 것을 지키지 않았어요'
  ];

  const PROS_AFTER = [
    '학교 적응 못할 때 직접 학교에 연락해줬어요',
    '코스 변경을 빠르게 처리해줬어요',
    '비자 연장 시기를 미리 알려줬어요',
    '문제가 생겼을 때 책임지고 해결해줬어요',
    '정기적으로 연락해서 상태를 확인해줬어요'
  ];
  const CONS_AFTER = [
    '등록 후에는 연락해도 잘 안 받았어요',
    '담당자가 바뀌고 관리가 소홀해졌어요',
    '비자 만료 임박해서야 연락이 왔어요',
    '학교 문제를 얘기해도 해결이 안 됐어요',
    '사후 관리가 거의 없었어요'
  ];

  const EXTRA_COST_ITEMS = ['서류 준비 수수료', '비자 대행 수수료', '공항 픽업 비용', '숙소 연결 수수료'];

  // =====================================================================
  // 헬퍼 함수
  // =====================================================================
  function addRatingScales(labels) {
    labels.forEach(function (label) {
      form.addScaleItem()
        .setTitle(label)
        .setBounds(1, 5)
        .setLabels('별로', '최고')
        .setRequired(true);
    });
  }

  function addProsConsBlock(prosOptions, consOptions) {
    form.addCheckboxItem()
      .setTitle('✅ 좋았던 점 (해당하는 거 다 체크)')
      .setChoiceValues(prosOptions)
      .showOtherOption(true);

    form.addParagraphTextItem()
      .setTitle('✍️ 좋았던 점 자유롭게 (선택)')
      .setHelpText('체크리스트 외에 기억에 남는 경험');

    form.addCheckboxItem()
      .setTitle('😅 아쉬웠던 점 (해당하는 거 다 체크)')
      .setChoiceValues(consOptions)
      .showOtherOption(true);

    form.addParagraphTextItem()
      .setTitle('✍️ 아쉬웠던 점 자유롭게 (선택)');
  }

  function addExtraCostBlock() {
    form.addMultipleChoiceItem()
      .setTitle('💰 추가 비용이 있었어?')
      .setRequired(true)
      .setChoiceValues(['없었어요', '있었어요']);

    form.addCheckboxItem()
      .setTitle('(있었다면) 어떤 항목이었어?')
      .setHelpText('"없었어요" 답한 경우 빈칸으로 두면 돼')
      .setChoiceValues(EXTRA_COST_ITEMS)
      .showOtherOption(true);

    form.addTextItem()
      .setTitle('(있었다면) 대략 얼마? (예: $200 AUD)')
      .setHelpText('"없었어요" 답한 경우 빈칸');
  }

  // =====================================================================
  // 페이지 0 — 기본 (유학원 + 리뷰 타입 선택)
  // =====================================================================
  form.addSectionHeaderItem()
    .setTitle('📍 어떤 유학원에 대한 후기인가요?')
    .setHelpText('먼저 유학원을 선택하고, 어떤 단계까지 경험했는지 알려줘.');

  form.addMultipleChoiceItem()
    .setTitle('1. 유학원 선택')
    .setRequired(true)
    .setChoiceValues(AGENCIES)
    .showOtherOption(true);

  // 분기 트리거 (옵션은 페이지 정의 후 설정)
  const q2 = form.addMultipleChoiceItem()
    .setTitle('2. 어떤 단계까지 경험했어?')
    .setHelpText('답변에 따라 다음 질문이 달라져.')
    .setRequired(true);

  // =====================================================================
  // 페이지 1 — 상담만 받은 경험
  // =====================================================================
  const consultPage = form.addPageBreakItem()
    .setTitle('💬 상담만 받은 경험')
    .setHelpText('상담만 받고 등록은 안 한 경우 포함');

  form.addListItem()
    .setTitle('상담받은 연도')
    .setRequired(true)
    .setChoiceValues(YEARS);

  form.addListItem()
    .setTitle('상담 목적')
    .setRequired(true)
    .setChoiceValues(PURPOSES);

  form.addMultipleChoiceItem()
    .setTitle('실제 등록까지 했어?')
    .setRequired(true)
    .setChoiceValues(['예', '아니오']);

  form.addMultipleChoiceItem()
    .setTitle('상담 형태')
    .setHelpText('어떻게 상담받았어?')
    .setRequired(true)
    .setChoiceValues(['직접 방문', '화상 상담', '카톡 상담', '이메일', '기타']);

  form.addTextItem()
    .setTitle('상담받은 학교/과정 (선택)')
    .setHelpText('예: UNSW - IT')
    .setRequired(false);

  form.addSectionHeaderItem()
    .setTitle('⭐ 항목별 평점 (1=별로 / 5=최고)');

  addRatingScales(['상담 연락 속도', '상담 퀄리티', '정보 정확성', '압박 영업 없음', '전반적 만족도']);

  form.addScaleItem()
    .setTitle('🎯 이 유학원을 친구에게 추천할 의향')
    .setHelpText('0=절대 추천 안 함 / 10=꼭 추천')
    .setBounds(0, 10)
    .setLabels('절대 안 함', '꼭 추천')
    .setRequired(true);

  addProsConsBlock(PROS_CONSULT, CONS_CONSULT);

  addExtraCostBlock();

  form.addTextItem()
    .setTitle('📝 한 줄 요약 (이 유학원을 한 문장으로)')
    .setHelpText('예: 상담은 친절한데 등록 후 관리가 아쉬워요')
    .setRequired(true);

  // 인증 자료 업로드 — 카톡 대화내역
  form.addSectionHeaderItem()
    .setTitle('🔒 인증 자료 (선택, 첨부 시 ✅ 인증 후기 배지)')
    .setHelpText('카톡/이메일 상담 대화내역 캡처. 개인정보(이름·번호)는 가려서 올려줘. 검토 후 즉시 삭제.');

  form.addFileUploadItem()
    .setTitle('카톡/이메일 상담 대화내역 (이미지 1개)')
    .setRequired(false)
    .setHelpText('Google 계정 로그인이 필요해. 첨부 어려우면 그냥 빈칸으로 두고 다음으로 가도 OK.');

  // =====================================================================
  // 페이지 2 — 등록하고 학교까지 간 경험 (사후관리 통합)
  // =====================================================================
  const fullPage = form.addPageBreakItem()
    .setTitle('✈️ 등록하고 학교까지 간 경험')
    .setHelpText('실제 등록 후 학교에 진학한 경우. 사후관리 평가는 마지막에 선택적으로 가능.');

  form.addListItem()
    .setTitle('이용 연도')
    .setRequired(true)
    .setChoiceValues(YEARS);

  form.addListItem()
    .setTitle('이용 목적')
    .setRequired(true)
    .setChoiceValues(PURPOSES);

  form.addListItem()
    .setTitle('보낸 도시')
    .setRequired(true)
    .setChoiceValues(CITIES);

  form.addTextItem()
    .setTitle('어느 학교/과정으로 갔어?')
    .setHelpText('예: University of Sydney - Bachelor of IT')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('현재 상태')
    .setRequired(true)
    .setChoiceValues(['재학 중', '졸업·귀국함']);

  form.addSectionHeaderItem()
    .setTitle('⭐ 항목별 평점 (1=별로 / 5=최고)');

  addRatingScales(['초기 상담', '정보 정확성', '수수료 투명성', '비자/서류 지원', '전반적 만족도']);

  form.addScaleItem()
    .setTitle('🎯 이 유학원을 친구에게 추천할 의향')
    .setHelpText('0=절대 추천 안 함 / 10=꼭 추천')
    .setBounds(0, 10)
    .setLabels('절대 안 함', '꼭 추천')
    .setRequired(true);

  addProsConsBlock(PROS_FULL, CONS_FULL);

  addExtraCostBlock();

  form.addTextItem()
    .setTitle('📝 한 줄 요약 (이 유학원을 한 문장으로)')
    .setHelpText('예: 비자 걱정 없이 진행됐어요, 강추')
    .setRequired(true);

  // 인증 자료 업로드 — 입학확인서/COE/학생증/비자 이메일
  form.addSectionHeaderItem()
    .setTitle('🔒 인증 자료 (선택, 첨부 시 ✅ 인증 후기 배지)')
    .setHelpText('아래 중 하나라도 첨부하면 인증 후기 처리. 개인정보(여권번호·생년월일)는 가려서 올려줘. 검토 후 즉시 삭제.');

  form.addFileUploadItem()
    .setTitle('입학확인서 / COE / 학생증 / 비자 승인 이메일 (이미지·PDF, 최대 3개)')
    .setRequired(false)
    .setHelpText('하나만 있어도 OK. Google 계정 로그인이 필요해. 첨부 어려우면 빈칸으로 두고 다음으로 가도 됨.');

  // 사후관리 평가 분기 (페이지 2 마지막 질문)
  const aftercareBranch = form.addMultipleChoiceItem()
    .setTitle('📞 등록 후 사후관리 경험도 평가해줄래?')
    .setHelpText('받은 만큼만 평가하면 돼. 거의 못 받았어도 그것이 중요한 정보야!')
    .setRequired(true);
  // 분기 옵션은 페이지 정의 후 설정

  // =====================================================================
  // 페이지 3 — 사후관리 추가 평가 (full 응답자 중 원하는 사람만)
  // =====================================================================
  const aftercareDetailPage = form.addPageBreakItem()
    .setTitle('📞 사후관리 추가 평가')
    .setHelpText('학교 다니면서 받은 관리에 대한 평가. 받은 만큼만 평가해.');

  form.addSectionHeaderItem()
    .setTitle('⭐ 사후관리 평점 (1=별로 / 5=최고)');

  addRatingScales(['연락 응답 속도', '문제 해결 능력', '약속 이행 여부', '지속적 관리', '전반적 만족도']);

  addProsConsBlock(PROS_AFTER, CONS_AFTER);

  // =====================================================================
  // 페이지 4 — 마무리
  // =====================================================================
  const finalPage = form.addPageBreakItem()
    .setTitle('🙇 마무리')
    .setHelpText('거의 다 왔어! 마지막 세 가지');

  form.addTextItem()
    .setTitle('닉네임 (후기에 표시될 이름)')
    .setHelpText('예: 시드니유학생, 호주살이중 — 본명 권장 안 함')
    .setRequired(true);

  form.addTextItem()
    .setTitle('이메일 (런칭 알림 받을 곳, 선택)')
    .setHelpText('답해준 사람만 받는 사전 등록자 혜택 드릴게');

  form.addMultipleChoiceItem()
    .setTitle('다른 유학원 후기도 쓸래?')
    .setHelpText('"예" 선택 후 제출 → 아래 "다른 응답 제출" 링크 클릭하면 다시 폼 열림')
    .setChoiceValues(['아니오, 끝!', '예, 다른 유학원도 후기 있어요']);

  // =====================================================================
  // 분기 로직 설정 (모든 페이지 정의 끝난 후)
  // =====================================================================
  q2.setChoices([
    q2.createChoice('상담만 받은 경험 (등록 안 함 포함)', consultPage),
    q2.createChoice('등록하고 학교까지 간 경험', fullPage)
  ]);

  aftercareBranch.setChoices([
    aftercareBranch.createChoice('예, 사후관리도 평가할게요', aftercareDetailPage),
    aftercareBranch.createChoice('스킵할게요', finalPage)
  ]);

  // 페이지 1 (상담만) 끝 → 마무리로 점프
  consultPage.setGoToPage(finalPage);
  // 페이지 3 (사후관리 상세) 끝 → 마무리로 점프
  aftercareDetailPage.setGoToPage(finalPage);
  // 페이지 2 (등록+학교) 끝의 분기 처리는 aftercareBranch가 담당 (setGoToPage 불필요)

  // =====================================================================
  // 완료
  // =====================================================================
  Logger.log('✅ 폼 생성 완료!');
  Logger.log('편집 URL (대표님이 수정할 때): ' + form.getEditUrl());
  Logger.log('응답 URL (지인에게 공유할 링크): ' + form.getPublishedUrl());
}
