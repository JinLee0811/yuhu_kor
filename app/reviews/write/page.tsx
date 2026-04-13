'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import { ChevronLeft, Search } from 'lucide-react';
import { toast } from 'sonner';
import { StarRating } from '@/components/review/StarRating';
import { FileUpload } from '@/components/review/FileUpload';
import { REVIEW_SCHEMAS } from '@/lib/constants/reviewSchema';
import { submitReview } from '@/lib/api/reviews';
import type { ApiResponse } from '@/lib/api';
import type { Entity } from '@/types/entity';
import type { ReviewFormData, ReviewMeta, ReviewType } from '@/types/review';
import { cn } from '@/lib/utils/cn';
import { findSchoolIdByText } from '@/lib/utils/findSchoolId';
import { useAuthStore } from '@/lib/store/auth';

const reviewTypeCards: Array<{ type: ReviewType; icon: string; label: string; desc: string }> = [
  { type: 'consultation', icon: '💬', label: '상담만 받았어요', desc: '상담만 받았거나 등록 안 한 경우' },
  { type: 'full', icon: '✈️', label: '등록하고 학교까지 갔어요', desc: '실제로 등록하고 학교 간 경우' },
  { type: 'aftercare', icon: '📞', label: '학교 다니면서 관리받은 후기예요', desc: '학교 다니면서 받은 관리 경험' }
];

const purposeOptions = ['어학연수', '대학진학', 'TAFE', 'VET', '조기유학', '워킹홀리데이', '기타'];
const cityOptions = ['시드니', '멜버른', '브리즈번', '골드코스트', '퍼스', '캔버라', '애들레이드', '기타'];
const yearOptions = Array.from({ length: 8 }, (_, index) => String(2025 - index));

const PROS_CHECKLIST: Record<ReviewType, string[]> = {
  consultation: [
    '연락/응답이 빨랐어요',
    '학교 옵션을 다양하게 비교해줬어요',
    '압박 없이 편하게 상담했어요',
    '비자/서류 절차를 꼼꼼히 안내해줬어요',
    '내 상황에 맞게 맞춤 상담해줬어요',
    '비용을 투명하게 설명해줬어요'
  ],
  full: [
    '입학 서류 준비를 체계적으로 도와줬어요',
    '비자 신청 과정에서 실수가 없었어요',
    '학교 오리엔테이션 전까지 꼼꼼히 챙겨줬어요',
    '학교 선택을 후회하지 않아요',
    '예상한 것과 실제 학교 환경이 일치했어요',
    '문제가 생겼을 때 빠르게 해결해줬어요'
  ],
  aftercare: [
    '학교 적응 못할 때 직접 학교에 연락해줬어요',
    '코스 변경을 빠르게 처리해줬어요',
    '비자 연장 시기를 미리 알려줬어요',
    '문제가 생겼을 때 책임지고 해결해줬어요',
    '정기적으로 연락해서 상태를 확인해줬어요'
  ]
};

const CONS_CHECKLIST: Record<ReviewType, string[]> = {
  consultation: [
    '특정 학교만 계속 추천했어요',
    '비용 설명이 불명확했어요',
    '영주권/취업 전망을 너무 장밋빛으로 얘기했어요',
    '담당자가 자꾸 바뀌었어요',
    '상담사가 전문성이 부족한 느낌이었어요',
    '연락이 잘 안 됐어요'
  ],
  full: [
    '등록하고 나서 연락이 뜸해졌어요',
    '설명과 실제 학교 환경이 달랐어요',
    '서류 누락으로 비자가 지연됐어요',
    '학교 문제 생겼을 때 도움을 못 받았어요',
    '담당자가 바뀌고 나서 관리가 소홀해졌어요',
    '약속한 것을 지키지 않았어요'
  ],
  aftercare: [
    '등록 후에는 연락해도 잘 안 받았어요',
    '담당자가 바뀌고 관리가 소홀해졌어요',
    '비자 만료 임박해서야 연락이 왔어요',
    '학교 문제를 얘기해도 해결이 안 됐어요',
    '사후 관리가 거의 없었어요'
  ]
};

const EXTRA_COST_ITEMS = ['서류 준비 수수료', '비자 대행 수수료', '공항 픽업 비용', '숙소 연결 수수료'];

const SUMMARY_PLACEHOLDERS = [
  '상담은 친절한데 등록 후 관리가 아쉬워요',
  '비자 걱정 없이 진행됐어요, 강추해요',
  '영주권 얘기로 꼬시는데 현실은 달랐어요',
  '담당자 바뀌고 나서 관리가 소홀해졌어요'
];

function WriteReviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReady = useAuthStore((state) => state.isReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const hasNickname = useAuthStore((state) => state.hasNickname);

  const [step, setStep] = useState(1);
  const [agencies, setAgencies] = useState<Entity[]>([]);
  const [showAgencyResult, setShowAgencyResult] = useState(false);
  const [agencyKeyword, setAgencyKeyword] = useState('');
  const [selectedAgencyId, setSelectedAgencyId] = useState('');
  const [reviewType, setReviewType] = useState<ReviewType>('consultation');

  const [consultedYear, setConsultedYear] = useState('');
  const [consultPurpose, setConsultPurpose] = useState('');
  const [registered, setRegistered] = useState<boolean | null>(null);
  const [schoolConsulted, setSchoolConsulted] = useState('');

  const [usedYear, setUsedYear] = useState('');
  const [usedPurpose, setUsedPurpose] = useState('');
  const [usedCity, setUsedCity] = useState('');
  const [schoolCourse, setSchoolCourse] = useState('');

  const [enrolledYear, setEnrolledYear] = useState('');
  const [afterSchool, setAfterSchool] = useState('');
  const [afterCourse, setAfterCourse] = useState('');
  const [afterCity, setAfterCity] = useState('');
  const [currentStatus, setCurrentStatus] = useState<'enrolled' | 'graduated' | ''>('');

  const [scores, setScores] = useState<Record<string, number>>({});
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [summary, setSummary] = useState('');
  const [agreedPolicy, setAgreedPolicy] = useState(false);

  const [prosChecks, setProsChecks] = useState<string[]>([]);
  const [consChecks, setConsChecks] = useState<string[]>([]);
  const [extraCostOption, setExtraCostOption] = useState<'none' | 'yes' | ''>('');
  const [extraCostItems, setExtraCostItems] = useState<string[]>([]);
  const [extraCostOther, setExtraCostOther] = useState('');
  const [extraCostIsPublic, setExtraCostIsPublic] = useState<boolean | null>(null);
  const [extraCostAmount, setExtraCostAmount] = useState('');
  const [extraCostCurrency, setExtraCostCurrency] = useState<'AUD' | 'KRW'>('AUD');

  const [verificationFile, setVerificationFile] = useState('');

  useEffect(() => {
    const loadEntities = async () => {
      const response = await fetch('/api/v1/entities?limit=100');
      const json: ApiResponse<{ items: Entity[] }> = await response.json();
      if (response.ok && json.data?.items) {
        setAgencies(json.data.items);
      }
    };

    void loadEntities();
  }, []);

  useEffect(() => {
    const agencyId = searchParams.get('agency');
    if (!agencyId || agencies.length === 0) return;

    const agency = agencies.find((item) => item.id === agencyId);
    if (!agency) return;

    setSelectedAgencyId(agency.id);
    setAgencyKeyword(agency.name);
  }, [searchParams, agencies]);

  useEffect(() => {
    if (!isReady || !isLoggedIn || hasNickname) return;
    const next = `/reviews/write${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    router.replace(`/nickname?next=${encodeURIComponent(next)}` as Route);
  }, [hasNickname, isLoggedIn, isReady, router, searchParams]);

  const filteredAgencies = useMemo(() => {
    if (!agencyKeyword.trim()) return agencies;
    return agencies.filter((agency) => agency.name.toLowerCase().includes(agencyKeyword.toLowerCase()));
  }, [agencies, agencyKeyword]);

  const scoreItems = REVIEW_SCHEMAS[reviewType];

  const canProceedStep1 = useMemo(() => {
    if (!selectedAgencyId) return false;

    if (reviewType === 'consultation') {
      return Boolean(consultedYear && consultPurpose && registered !== null);
    }

    if (reviewType === 'full') {
      return Boolean(usedYear && usedPurpose && usedCity && schoolCourse.trim());
    }

    return Boolean(enrolledYear && afterSchool.trim() && afterCourse.trim() && afterCity && currentStatus);
  }, [
    selectedAgencyId,
    reviewType,
    consultedYear,
    consultPurpose,
    registered,
    usedYear,
    usedPurpose,
    usedCity,
    schoolCourse,
    enrolledYear,
    afterSchool,
    afterCourse,
    afterCity,
    currentStatus
  ]);

  const canProceedStep2 = useMemo(() => scoreItems.every((item) => (scores[item.key] ?? 0) > 0), [scoreItems, scores]);
  const canSubmit = summary.trim().length > 0 && agreedPolicy;

  const selectedAgency = agencies.find((agency) => agency.id === selectedAgencyId);

  const prosOptions = PROS_CHECKLIST[reviewType];
  const consOptions = CONS_CHECKLIST[reviewType];
  const summaryPlaceholder = useMemo(
    () => SUMMARY_PLACEHOLDERS[Math.floor(Math.random() * SUMMARY_PLACEHOLDERS.length)],
    []
  );

  const toggleChecklistItem = (
    type: 'pros' | 'cons',
    option: string
  ) => {
    if (type === 'pros') {
      setProsChecks((prev) => {
        const exists = prev.includes(option);
        return exists ? prev.filter((item) => item !== option) : [...prev, option];
      });
    } else {
      setConsChecks((prev) => {
        const exists = prev.includes(option);
        return exists ? prev.filter((item) => item !== option) : [...prev, option];
      });
    }
  };

  const buildMeta = (): ReviewMeta => {
    const extraCost = {
      exists: extraCostOption === 'yes',
      types: extraCostOption === 'yes' ? [...extraCostItems, ...(extraCostOther.trim() ? [extraCostOther.trim()] : [])] : [],
      amount:
        extraCostOption === 'yes' && extraCostIsPublic && extraCostAmount.trim()
          ? Number(extraCostAmount.replace(/[^0-9.]/g, ''))
          : null,
      currency:
        extraCostOption === 'yes' && extraCostIsPublic && extraCostAmount.trim() ? extraCostCurrency : null,
      is_public: extraCostOption === 'yes' ? Boolean(extraCostIsPublic) : false
    } as ReviewMeta['extra_cost'];

    const common = {
      pros_tags: prosChecks,
      cons_tags: consChecks,
      pros_text: pros.trim() ? pros.trim() : null,
      cons_text: cons.trim() ? cons.trim() : null,
      extra_cost: extraCost
    };

    if (reviewType === 'consultation') {
      return {
        consulted_year: Number(consultedYear),
        purpose: consultPurpose,
        registered: Boolean(registered),
        school_id: findSchoolIdByText(schoolConsulted),
        school_consulted: schoolConsulted.trim() || undefined,
        ...common
      };
    }

    if (reviewType === 'full') {
      return {
        used_year: Number(usedYear),
        purpose: usedPurpose,
        destination_city: usedCity,
        school_id: findSchoolIdByText(schoolCourse),
        school_course: schoolCourse.trim(),
        ...common
      };
    }

    return {
      enrolled_year: Number(enrolledYear),
      school_id: findSchoolIdByText(afterSchool),
      school: afterSchool.trim(),
      course: afterCourse.trim(),
      destination_city: afterCity,
      current_status: currentStatus || undefined,
      ...common
    };
  };

  const onSubmit = async () => {
    if (!canSubmit || !selectedAgencyId) return;

    const payload: ReviewFormData = {
      entity_id: selectedAgencyId,
      review_type: reviewType,
      scores,
      pros,
      cons,
      summary,
      meta: buildMeta(),
      is_verified_review: Boolean(verificationFile)
    };

    try {
      const result = await submitReview(payload);
      if (result.success) {
        router.push(`/au/agency/${selectedAgency?.slug ?? ''}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '후기 등록에 실패했어요.');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-4 md:px-6">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => (step > 1 ? setStep((prev) => prev - 1) : router.back())}
              className="flex items-center gap-1 text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium">{step > 1 ? '이전' : '취소'}</span>
            </button>
            <span className="text-body2 text-muted-foreground">{step} / 3 단계</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? 'bg-accent' : 'bg-muted'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-6 md:py-8">
        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 font-bold">어떤 경험이었어요?</h1>
              <p className="text-body2 text-muted-foreground">어떤 후기인지 선택하면 해당 폼이 나와요.</p>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-foreground">유학원 선택 *</label>
              <div className="relative">
                <div className="flex items-center rounded-lg border border-border bg-card px-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={agencyKeyword}
                    onChange={(event) => {
                      setAgencyKeyword(event.target.value);
                      setShowAgencyResult(true);
                    }}
                    onFocus={() => setShowAgencyResult(true)}
                    placeholder="유학원명을 입력하세요"
                    className="h-11 w-full bg-transparent px-2 text-body2 focus:outline-none"
                  />
                </div>

                {showAgencyResult ? (
                  <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-64 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                    {filteredAgencies.map((agency) => (
                      <button
                        key={agency.id}
                        type="button"
                        onClick={() => {
                          setSelectedAgencyId(agency.id);
                          setAgencyKeyword(agency.name);
                          setShowAgencyResult(false);
                        }}
                        className="w-full border-b border-border px-3 py-2.5 text-left last:border-none hover:bg-muted"
                      >
                        <p className="font-medium text-foreground">{agency.name}</p>
                        <p className="text-caption text-muted-foreground">{agency.coverage_cities.join(', ')}</p>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-foreground">어떤 후기예요? *</label>
              <div className="grid gap-3 md:grid-cols-3">
                {reviewTypeCards.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      setReviewType(item.type);
                      setScores({});
                      setVerificationFile('');
                    }}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      reviewType === item.type ? 'border-accent bg-accent/10' : 'border-border bg-card hover:bg-muted/40'
                    }`}
                  >
                    <p className="mb-1 text-[18px]">{item.icon}</p>
                    <p className="font-semibold text-foreground">{item.label}</p>
                    <p className="mt-1 text-caption text-muted-foreground">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {reviewType === 'consultation' ? (
              <div className="space-y-4 rounded-xl border border-border bg-card p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-body2 font-semibold">상담 연도 *</label>
                    <select
                      value={consultedYear}
                      onChange={(event) => setConsultedYear(event.target.value)}
                      className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
                    >
                      <option value="">연도 선택</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-body2 font-semibold">상담 목적 *</label>
                    <select
                      value={consultPurpose}
                      onChange={(event) => setConsultPurpose(event.target.value)}
                      className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
                    >
                      <option value="">목적 선택</option>
                      {purposeOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-body2 font-semibold">실제 등록 여부 *</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRegistered(true)}
                      className={`rounded-lg px-4 py-2 text-body2 ${registered === true ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}
                    >
                      예
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegistered(false)}
                      className={`rounded-lg px-4 py-2 text-body2 ${registered === false ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}
                    >
                      아니오
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-body2 font-semibold">어떤 학교/과정을 상담받으셨나요? (선택)</label>
                  <input
                    value={schoolConsulted}
                    onChange={(event) => setSchoolConsulted(event.target.value)}
                    placeholder="예: UNSW - IT"
                    className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
                  />
                </div>

                <div className="rounded-xl bg-[#F5F5F5] p-4">
                  <h3 className="mb-1 font-semibold text-foreground">🔒 인증하면 더 믿음가는 후기가 돼요 (선택)</h3>
                  <FileUpload
                    label="상담 카톡/이메일 스크린샷 업로드"
                    fileName={verificationFile}
                    onSelect={(file) => setVerificationFile(file?.name ?? '')}
                    onRemove={() => setVerificationFile('')}
                  />
                  <p className="mt-3 text-caption text-muted-foreground">* 개인정보는 가려서 올려주세요</p>
                  <p className="text-caption text-muted-foreground">* 업로드 후 즉시 삭제돼요</p>
                </div>
              </div>
            ) : null}

            {reviewType === 'full' ? (
              <div className="space-y-4 rounded-xl border border-border bg-card p-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-body2 font-semibold">이용 연도 *</label>
                    <select
                      value={usedYear}
                      onChange={(event) => setUsedYear(event.target.value)}
                      className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
                    >
                      <option value="">연도 선택</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-body2 font-semibold">이용 목적 *</label>
                    <select
                      value={usedPurpose}
                      onChange={(event) => setUsedPurpose(event.target.value)}
                      className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
                    >
                      <option value="">목적 선택</option>
                      {purposeOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-body2 font-semibold">보낸 도시 *</label>
                    <select
                      value={usedCity}
                      onChange={(event) => setUsedCity(event.target.value)}
                      className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
                    >
                      <option value="">도시 선택</option>
                      {cityOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-body2 font-semibold">어느 학교/과정으로 가셨나요? *</label>
                  <input
                    value={schoolCourse}
                    onChange={(event) => setSchoolCourse(event.target.value)}
                    placeholder="예: University of Sydney - Bachelor of IT"
                    className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
                  />
                </div>

                <div className="rounded-xl border border-blue-200 bg-[#EEF2FF] p-4">
                  <h3 className="mb-1 font-semibold text-foreground">✅ 입학 인증 (권장)</h3>
                  <p className="mb-3 text-body2 text-muted-foreground">인증하면 ✓ 입학 인증 배지 달리고 검색 상단에 노출돼요.</p>
                  <div className="space-y-2">
                    <FileUpload
                      label="입학확인서 (Offer Letter)"
                      fileName={verificationFile}
                      onSelect={(file) => setVerificationFile(file?.name ?? '')}
                      onRemove={() => setVerificationFile('')}
                      primary
                    />
                    <FileUpload
                      label="COE (입학등록증)"
                      fileName={verificationFile}
                      onSelect={(file) => setVerificationFile(file?.name ?? '')}
                      onRemove={() => setVerificationFile('')}
                      primary
                    />
                    <FileUpload
                      label="비자 승인 이메일"
                      fileName={verificationFile}
                      onSelect={(file) => setVerificationFile(file?.name ?? '')}
                      onRemove={() => setVerificationFile('')}
                      primary
                    />
                  </div>
                  <p className="mt-3 text-caption text-muted-foreground">* 개인정보는 가려서 올려주세요</p>
                  <p className="text-caption text-muted-foreground">* 업로드 후 즉시 삭제돼요</p>
                  <p className="text-caption text-muted-foreground">* 인증 안 해도 후기 작성 가능해요</p>
                </div>
              </div>
            ) : null}

            {reviewType === 'aftercare' ? (
              <div className="space-y-4 rounded-xl border border-border bg-card p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-body2 font-semibold">입학 연도 *</label>
                    <select
                      value={enrolledYear}
                      onChange={(event) => setEnrolledYear(event.target.value)}
                      className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
                    >
                      <option value="">연도 선택</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-body2 font-semibold">도시 *</label>
                    <select
                      value={afterCity}
                      onChange={(event) => setAfterCity(event.target.value)}
                      className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
                    >
                      <option value="">도시 선택</option>
                      {cityOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-body2 font-semibold">학교명 *</label>
                  <input
                    value={afterSchool}
                    onChange={(event) => setAfterSchool(event.target.value)}
                    placeholder="예: University of Sydney"
                    className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-body2 font-semibold">과정명 *</label>
                  <input
                    value={afterCourse}
                    onChange={(event) => setAfterCourse(event.target.value)}
                    placeholder="예: Bachelor of Information Technology"
                    className="h-11 w-full rounded-lg border border-border bg-card px-3 text-body2"
                  />
                </div>

                <div>
                  <p className="mb-2 text-body2 font-semibold">현재 상태 *</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStatus('enrolled')}
                      className={`rounded-lg px-4 py-2 text-body2 ${currentStatus === 'enrolled' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}
                    >
                      재학 중
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStatus('graduated')}
                      className={`rounded-lg px-4 py-2 text-body2 ${currentStatus === 'graduated' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}
                    >
                      졸업
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-orange-200 bg-[#FFF4E6] p-4">
                  <h3 className="mb-1 font-semibold text-foreground">🎓 재학생 인증 (강력 권장)</h3>
                  <p className="mb-3 text-body2 text-muted-foreground">이 후기는 실제 학교 생활 경험이라 인증 권장해요.</p>
                  <div className="space-y-2">
                    <FileUpload
                      label="학생증"
                      fileName={verificationFile}
                      onSelect={(file) => setVerificationFile(file?.name ?? '')}
                      onRemove={() => setVerificationFile('')}
                      primary
                    />
                    <FileUpload
                      label="재학증명서"
                      fileName={verificationFile}
                      onSelect={(file) => setVerificationFile(file?.name ?? '')}
                      onRemove={() => setVerificationFile('')}
                      primary
                    />
                    <FileUpload
                      label="성적표 (일부)"
                      fileName={verificationFile}
                      onSelect={(file) => setVerificationFile(file?.name ?? '')}
                      onRemove={() => setVerificationFile('')}
                      primary
                    />
                  </div>
                  <p className="mt-3 text-caption text-muted-foreground">* 개인정보는 반드시 가려주세요</p>
                  <p className="text-caption text-muted-foreground">* 업로드 후 즉시 삭제돼요</p>
                  <p className="text-caption font-semibold text-orange-700">⚠️ 인증 없으면 후기가 하단에 노출돼요</p>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="w-full rounded-lg bg-accent px-6 py-4 font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              다음 단계
            </button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 font-bold">항목별 평점</h1>
              <p className="text-body2 text-muted-foreground">선택한 후기 타입에 맞는 항목만 평가해줘요.</p>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {scoreItems.map((item) => (
                <div key={item.key} className="border-b border-border p-4 last:border-none">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <span className="text-caption text-muted-foreground">가중치 {item.weight}</span>
                  </div>
                  <StarRating value={scores[item.key] ?? 0} onChange={(value) => setScores((prev) => ({ ...prev, [item.key]: value }))} size="lg" />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-lg bg-secondary px-6 py-4 font-semibold text-secondary-foreground">
                이전
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className="flex-1 rounded-lg bg-accent px-6 py-4 font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                다음 단계
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-8">
            <div>
              <h1 className="mb-2 font-bold">텍스트 후기</h1>
              <p className="text-body2 text-muted-foreground">체크리스트로 골라보고, 필요한 내용은 직접 채워줘요.</p>
            </div>

            {/* 좋았던 점 */}
            <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-5">
              <div>
                <h2 className="text-sm font-semibold text-foreground">✅ 좋았던 점</h2>
                <p className="mt-1 text-caption text-muted-foreground">해당하는 거 골라봐요 (복수 선택 가능)</p>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {prosOptions.map((option) => {
                  const checked = prosChecks.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleChecklistItem('pros', option)}
                      className={cn(
                        'flex min-h-[44px] items-center rounded-lg border px-3 py-2 text-left text-body2 transition-colors',
                        checked
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border bg-background text-foreground hover:bg-muted/60'
                      )}
                    >
                      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded border border-border bg-card text-[11px]">
                        {checked ? '✓' : ''}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">✍️ 직접 써봐요 (선택)</p>
                    <p className="text-caption text-muted-foreground">
                      체크리스트 외에 기억에 남는 경험이 있으면 자유롭게 써줘요
                    </p>
                  </div>
                </div>
                <textarea
                  value={pros}
                  onChange={(event) => setPros(event.target.value)}
                  maxLength={500}
                  className="h-32 w-full resize-none rounded-lg border border-border bg-background p-3 text-body2 outline-none focus:border-ring"
                  placeholder="예) 담당 선생님이 유독 꼼꼼해서 비자 준비가 하나도 안 힘들었어요"
                />
                <p className="mt-1 text-right text-caption text-muted-foreground">{pros.length}/500</p>
              </div>
            </section>

            {/* 추가 비용 섹션 */}
            <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-5">
              <div>
                <h2 className="text-sm font-semibold text-foreground">💰 추가 비용이 있었나요?</h2>
                <p className="mt-1 text-caption text-muted-foreground">상담은 무료지만 추가로 청구된 비용이 있었는지 알려줘요</p>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <button
                  type="button"
                  onClick={() => {
                    setExtraCostOption('none');
                    setExtraCostItems([]);
                    setExtraCostOther('');
                  }}
                  className={cn(
                    'flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-body2 transition-colors',
                    extraCostOption === 'none'
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-background text-foreground hover:bg-muted/60'
                  )}
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border text-[10px]">
                    {extraCostOption === 'none' ? '●' : ''}
                  </span>
                  <span>없었어요 (상담~등록까지 추가 비용 없었어요)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExtraCostOption('yes')}
                  className={cn(
                    'flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-body2 transition-colors',
                    extraCostOption === 'yes'
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-background text-foreground hover:bg-muted/60'
                  )}
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border text-[10px]">
                    {extraCostOption === 'yes' ? '●' : ''}
                  </span>
                  <span>있었어요</span>
                </button>
              </div>

              {extraCostOption === 'yes' ? (
                <div className="mt-3 space-y-2">
                  <div className="grid gap-2 md:grid-cols-2">
                    {EXTRA_COST_ITEMS.map((item) => {
                      const checked = extraCostItems.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setExtraCostItems((prev) =>
                              prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
                            )
                          }
                          className={cn(
                            'flex min-h-[40px] items-center rounded-lg border px-3 py-2 text-left text-body2 transition-colors',
                            checked
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-border bg-background text-foreground hover:bg-muted/60'
                          )}
                        >
                          <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded border border-border bg-card text-[11px]">
                            {checked ? '✓' : ''}
                          </span>
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2">
                    <label className="mb-1 block text-caption font-medium text-foreground">기타 (직접 입력)</label>
                    <input
                      value={extraCostOther}
                      onChange={(event) => setExtraCostOther(event.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-body2 outline-none focus:border-ring"
                      placeholder="추가로 지출된 비용이 있다면 적어줘요"
                    />
                  </div>
                  <div className="mt-4 space-y-2 rounded-lg bg-background p-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">금액을 공개할 수 있나요?</p>
                      <p className="text-caption text-muted-foreground">공개하면 다른 유학생들에게 큰 도움이 돼요</p>
                    </div>
                    <div className="flex flex-col gap-2 md:flex-row">
                      <button
                        type="button"
                        onClick={() => setExtraCostIsPublic(true)}
                        className={cn(
                          'flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-body2 transition-colors',
                          extraCostIsPublic === true
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border bg-background text-foreground hover:bg-muted/60'
                        )}
                      >
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border text-[10px]">
                          {extraCostIsPublic === true ? '●' : ''}
                        </span>
                        <span>공개할게요</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setExtraCostIsPublic(false)}
                        className={cn(
                          'flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-body2 transition-colors',
                          extraCostIsPublic === false
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border bg-background text-foreground hover:bg-muted/60'
                        )}
                      >
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border text-[10px]">
                          {extraCostIsPublic === false ? '●' : ''}
                        </span>
                        <span>비공개할게요</span>
                      </button>
                    </div>
                    {extraCostIsPublic === true ? (
                      <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center">
                        <input
                          value={extraCostAmount}
                          onChange={(event) => setExtraCostAmount(event.target.value)}
                          className="h-10 flex-1 rounded-lg border border-border bg-card px-3 text-body2 outline-none focus:border-ring"
                          placeholder="예) $200 AUD"
                        />
                        <select
                          value={extraCostCurrency}
                          onChange={(event) => setExtraCostCurrency(event.target.value as 'AUD' | 'KRW')}
                          className="h-10 rounded-lg border border-border bg-card px-3 text-body2 outline-none focus:border-ring md:w-28"
                        >
                          <option value="AUD">AUD</option>
                          <option value="KRW">KRW</option>
                        </select>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </section>

            {/* 아쉬웠던 점 */}
            <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-5">
              <div>
                <h2 className="text-sm font-semibold text-foreground">😅 아쉬웠던 점</h2>
                <p className="mt-1 text-caption text-muted-foreground">솔직하게 골라봐요, 익명이에요</p>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {consOptions.map((option) => {
                  const checked = consChecks.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleChecklistItem('cons', option)}
                      className={cn(
                        'flex min-h-[44px] items-center rounded-lg border px-3 py-2 text-left text-body2 transition-colors',
                        checked
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border bg-background text-foreground hover:bg-muted/60'
                      )}
                    >
                      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded border border-border bg-card text-[11px]">
                        {checked ? '✓' : ''}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-1">
                <div>
                  <p className="text-sm font-semibold text-foreground">✍️ 직접 써봐요 (선택)</p>
                  <p className="text-caption text-muted-foreground">더 하고 싶은 말이 있으면 자유롭게 써줘요</p>
                </div>
                <textarea
                  value={cons}
                  onChange={(event) => setCons(event.target.value)}
                  maxLength={500}
                  className="h-32 w-full resize-none rounded-lg border border-border bg-background p-3 text-body2 outline-none focus:border-ring"
                  placeholder="예) 등록하고 나서 담당자가 3번이나 바뀌었어요. 매번 처음부터 설명해야 했어요"
                />
                <p className="mt-1 text-right text-caption text-muted-foreground">{cons.length}/500</p>
              </div>
            </section>

            {/* 한줄 요약 */}
            <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-5">
              <div>
                <h2 className="text-sm font-semibold text-foreground">한줄 요약 (최대 100자)</h2>
                <p className="mt-1 text-caption text-muted-foreground">이 유학원을 한 문장으로 표현한다면?</p>
              </div>
              <input
                type="text"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                maxLength={100}
                placeholder={`예) ${summaryPlaceholder}`}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body2 outline-none focus:border-ring"
              />
              <p className="mt-1 text-right text-caption text-muted-foreground">{summary.length}/100</p>
            </section>

            <label className="flex items-start gap-2 rounded-lg border border-border bg-card p-3 text-body2 text-muted-foreground">
              <input type="checkbox" checked={agreedPolicy} onChange={(event) => setAgreedPolicy(event.target.checked)} className="mt-1" />
              <span>허위/광고성/개인정보 금지 원칙에 동의하고 사실 기반으로 작성했어요.</span>
            </label>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-lg bg-secondary px-6 py-4 font-semibold text-secondary-foreground">
                이전
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!canSubmit}
                className="flex-1 rounded-lg bg-accent px-6 py-4 font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                제출하기
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function WriteReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <WriteReviewPageContent />
    </Suspense>
  );
}
