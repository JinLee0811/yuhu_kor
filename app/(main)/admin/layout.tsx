'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Building2,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import type { ApiResponse } from '@/lib/api';
import type { AdminStats } from '@/types/admin';

const NAV_ITEMS = [
  { href: '/admin' as Route, label: '대시보드', icon: LayoutDashboard, exact: true },
  { href: '/admin/verifications' as Route, label: '인증 관리', icon: ShieldCheck, badgeKey: 'pendingVerifications' as const },
  { href: '/admin/agencies' as Route, label: '유학원 관리', icon: Building2 },
  { href: '/admin/schools' as Route, label: '학교 관리', icon: GraduationCap },
  { href: '/admin/reports' as Route, label: '신고 관리', icon: ShieldAlert, badgeKey: 'pendingReports' as const }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isReady = useAuthStore((s) => s.isReady);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const role = useAuthStore((s) => s.role);
  const [badges, setBadges] = useState<Partial<AdminStats>>({});

  // 어드민 권한 체크
  useEffect(() => {
    if (isReady && (!isLoggedIn || role !== 'admin')) {
      router.replace('/mypage');
    }
  }, [isReady, isLoggedIn, role, router]);

  // 배지 숫자 로드 (대기중 인증 수, 미처리 신고 수)
  useEffect(() => {
    if (!isReady || !isLoggedIn || role !== 'admin') return;
    fetch('/api/v1/admin/stats')
      .then((r) => r.json())
      .then((json: ApiResponse<AdminStats>) => {
        if (json.data) setBadges(json.data);
      })
      .catch(() => {});
  }, [isReady, isLoggedIn, role]);

  if (!isReady) return <div className="min-h-screen bg-background" />;

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 어드민 상단 헤더 */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex h-12 items-center gap-2 text-caption text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span className="font-semibold text-accent">Admin</span>
            <ChevronRight className="h-3 w-3" />
            <span>{NAV_ITEMS.find((n) => isActive(n))?.label ?? '관리'}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-6">
        <div className="flex gap-6">
          {/* 사이드바 (데스크탑) */}
          <aside className="hidden w-52 shrink-0 md:block">
            <nav className="sticky top-24 space-y-1 rounded-2xl border border-border bg-card p-3 shadow-sm">
              <p className="mb-2 px-2 text-caption font-semibold text-muted-foreground">관리 메뉴</p>
              {NAV_ITEMS.map((item) => {
                const active = isActive(item);
                const badgeCount = item.badgeKey ? (badges[item.badgeKey] ?? 0) : 0;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-body2 font-medium transition-colors ${
                      active
                        ? 'bg-accent/10 text-accent'
                        : 'text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {badgeCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-foreground">
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* 모바일 탭 네비게이션 */}
          <div className="mb-4 w-full md:hidden">
            <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1.5 shadow-sm">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item);
                const badgeCount = item.badgeKey ? (badges[item.badgeKey] ?? 0) : 0;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-caption font-medium transition-colors ${
                      active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                    {badgeCount > 0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-negative px-1 text-[10px] font-bold text-white">
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      {/* 통계 아이콘 (우하단, 데스크탑만) */}
      <div className="fixed bottom-6 right-6 hidden md:block">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-caption text-muted-foreground shadow-sm">
          <BarChart3 className="h-4 w-4" />
          <span>총 {badges.totalReviews ?? '—'}개 리뷰</span>
          <span className="text-border">·</span>
          <span>회원 {badges.totalUsers ?? '—'}명</span>
        </div>
      </div>
    </div>
  );
}
