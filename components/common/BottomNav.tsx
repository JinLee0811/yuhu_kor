"use client";

import { Home, Building2, User, GraduationCap, MessageSquareText, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth";

const navItems = [
  { path: "/", label: "홈", icon: Home },
  { path: "/reviews", label: "유학 후기", icon: FileText },
  { path: "/au/agency", label: "유학원", icon: Building2 },
  { path: "/schools", label: "학교 정보", icon: GraduationCap },
  { path: "/board", label: "학교생활", icon: MessageSquareText },
];

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const visibleNavItems = isLoggedIn
    ? [...navItems, { path: "/mypage", label: "내", icon: User }]
    : navItems;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <nav className='fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden'>
          <div className='flex h-[calc(56px+env(safe-area-inset-bottom))] items-start justify-around pb-safe pt-1' />
        </nav>
        <div className='h-14 md:hidden' />
      </>
    );
  }

  return (
    <>
      <nav className='fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden'>
        <div className='flex h-[calc(56px+env(safe-area-inset-bottom))] items-start justify-around pb-safe pt-1'>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? pathname === "/"
                : pathname === item.path || pathname.startsWith(`${item.path}/`);
            const tone = isActive ? "text-primary" : "text-muted-foreground";
            return (
              <Link
                key={item.path}
                href={item.path as Route}
                className={`flex h-[56px] flex-1 flex-col items-center justify-center ${tone}`}>
                <span className='flex h-5 items-center justify-center'>
                  <Icon className='h-5 w-5' strokeWidth={2.1} />
                </span>
                <span className='mt-1 text-[11px] font-medium leading-none'>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <div className='h-14 md:hidden' />
    </>
  );
}
