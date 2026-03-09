'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Building2, User, CheckCircle2, GraduationCap, MessageSquareText } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/store/auth';
import type { Route } from 'next';
import { useEffect, useState } from 'react';

const navItems = [
  { path: '/', label: '홈', icon: HomeIcon },
  { path: '/au/agency', label: '유학원', icon: Building2 },
  { path: '/schools', label: '학교 정보', icon: GraduationCap },
  { path: '/board', label: '학교생활', icon: MessageSquareText },
  { path: '/mypage', label: '내 페이지', icon: User }
];

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);
  const showLoggedIn = mounted ? isLoggedIn : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto max-w-layout px-4 md:px-6">
        <div className="hidden h-16 items-center justify-between md:flex">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">유후</span>
            </div>
            <h1 className="text-[18px] font-bold text-foreground">유학후기</h1>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === '/' ? pathname === '/' : pathname === item.path || pathname.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.path}
                  href={item.path as Route}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-2 transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {showLoggedIn ? (
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-border px-3 py-2 text-body2 text-foreground hover:bg-muted"
              >
                로그아웃
              </button>
            ) : (
              <>
                <Link href="/login" className="rounded-lg border border-border px-3 py-2 text-body2 text-foreground hover:bg-muted">
                  로그인
                </Link>
                <Link href="/signup" className="rounded-lg bg-accent px-3 py-2 text-body2 font-semibold text-accent-foreground">
                  가입하기
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex h-14 items-center justify-between md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-xs font-bold text-primary-foreground">유후</span>
            </div>
            <h1 className="font-bold text-foreground">유학후기</h1>
          </Link>
          {showLoggedIn ? (
            <Link href="/mypage" className="rounded-lg bg-muted px-3 py-1.5 text-caption font-medium text-foreground">
              내 페이지
            </Link>
          ) : (
            <Link href="/login" className="rounded-lg bg-accent px-3 py-1.5 text-caption font-semibold text-accent-foreground">
              로그인
            </Link>
          )}
        </div>
      </div>

      {!showLoggedIn ? (
        <div className="border-t border-border/80 bg-info/5">
          <div className="mx-auto flex max-w-layout items-center justify-between px-4 py-2 md:px-6">
            <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-info" />
              로그인하면 후기 남기고 내 페이지도 쓸 수 있어요 😊
            </p>
            <Link href="/login" className="text-caption font-semibold text-accent">
              로그인하기
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
