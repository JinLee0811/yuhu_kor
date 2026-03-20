'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import {
  ArrowRight,
  Building2,
  FileCheck,
  GraduationCap,
  ShieldAlert,
  ShieldCheck,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';
import type { ApiResponse } from '@/lib/api';
import type { AdminStats } from '@/types/admin';
import { useAuthStore } from '@/lib/store/auth';

interface StatCard {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  iconColor: string;
  href?: Route;
  urgent?: boolean;
}

export default function AdminDashboardPage() {
  const isReady = useAuthStore((s) => s.isReady);
  const role = useAuthStore((s) => s.role);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || role !== 'admin') return;
    fetch('/api/v1/admin/stats')
      .then((r) => r.json())
      .then((json: ApiResponse<AdminStats>) => {
        if (json.data) setStats(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isReady, role]);

  if (!isReady || loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  const cards: StatCard[] = [
    {
      label: '대기중 인증 요청',
      value: stats?.pendingVerifications ?? 0,
      sub: '검토가 필요해요',
      icon: ShieldCheck,
      iconColor: 'text-yellow-600',
      href: '/admin/verifications' as Route,
      urgent: (stats?.pendingVerifications ?? 0) > 0
    },
    {
      label: '미처리 신고',
      value: stats?.pendingReports ?? 0,
      sub: '처리 대기 중',
      icon: ShieldAlert,
      iconColor: 'text-negative',
      href: '/admin/reports' as Route,
      urgent: (stats?.pendingReports ?? 0) > 0
    },
    {
      label: '전체 리뷰',
      value: stats?.totalReviews ?? 0,
      sub: `이번 주 +${stats?.reviewsThisWeek ?? 0}건`,
      icon: Star,
      iconColor: 'text-accent'
    },
    {
      label: '전체 회원',
      value: stats?.totalUsers ?? 0,
      sub: `이번 주 +${stats?.newUsersThisWeek ?? 0}명`,
      icon: Users,
      iconColor: 'text-blue-500'
    },
    {
      label: '등록된 유학원',
      value: stats?.totalEntities ?? 0,
      sub: '관리 가능',
      icon: Building2,
      iconColor: 'text-purple-500',
      href: '/admin/agencies' as Route
    },
    {
      label: '이번 주 성장',
      value: `리뷰 ${stats?.reviewsThisWeek ?? 0} · 회원 ${stats?.newUsersThisWeek ?? 0}`,
      icon: TrendingUp,
      iconColor: 'text-green-600'
    }
  ];

  const quickActions = [
    { href: '/admin/verifications' as Route, label: '인증 요청 검토', icon: FileCheck, desc: '서류 확인 및 승인/반려' },
    { href: '/admin/agencies' as Route, label: '유학원 추가/수정', icon: Building2, desc: '정보 업데이트 및 순서 조정' },
    { href: '/admin/schools' as Route, label: '학교 정보 관리', icon: GraduationCap, desc: '학교 데이터 편집' },
    { href: '/admin/reports' as Route, label: '신고 처리', icon: ShieldAlert, desc: '콘텐츠 모더레이션' }
  ];

  return (
    <div className="space-y-6">
      {/* 타이틀 */}
      <div>
        <h1 className="text-lg font-bold text-foreground">대시보드</h1>
        <p className="mt-1 text-body2 text-muted-foreground">유후 플랫폼 전체 현황을 한눈에 확인해요.</p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border bg-card p-4 shadow-sm transition-shadow ${
              card.urgent ? 'border-yellow-300 bg-yellow-50/50' : 'border-border'
            }`}
          >
            <div className="mb-3 flex items-start justify-between">
              <div className={`rounded-xl bg-muted/60 p-2 ${card.iconColor}`}>
                <card.icon className="h-5 w-5" />
              </div>
              {card.href && (
                <Link href={card.href} className="text-muted-foreground hover:text-accent">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <p className="text-caption text-muted-foreground">{card.label}</p>
            <p className={`mt-1 text-xl font-bold ${card.urgent ? 'text-yellow-700' : 'text-foreground'}`}>
              {card.value}
            </p>
            {card.sub && <p className="mt-0.5 text-caption text-muted-foreground">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* 빠른 작업 */}
      <div>
        <h2 className="mb-3 font-semibold text-foreground">빠른 작업</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              <div className="rounded-xl bg-accent/10 p-2.5 text-accent">
                <action.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{action.label}</p>
                <p className="text-caption text-muted-foreground">{action.desc}</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
