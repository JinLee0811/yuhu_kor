import Link from 'next/link';

export function Footer() {
  const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'X', href: 'https://x.com' }
  ];

  return (
    <footer className="mt-10 border-t border-border/80 bg-card md:mt-14">
      <div className="mx-auto max-w-layout px-4 py-7 md:px-6 md:py-9">
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-5 md:px-6 md:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[15px] font-semibold text-foreground">유후 | 광고 없음. 진짜 후기만.</p>
              <p className="mt-1 text-caption text-muted-foreground">현재 서비스 국가: 호주</p>
            </div>
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-body2 text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-foreground">
                서비스 소개
              </Link>
              <Link href="/" className="transition-colors hover:text-foreground">
                후기 정책
              </Link>
              <Link href="/" className="transition-colors hover:text-foreground">
                문의하기
              </Link>
            </nav>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-border/70 pt-4 md:flex-row md:items-center md:justify-between">
            <p className="text-caption text-muted-foreground">© 2026 Yuhu.</p>

            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border bg-card px-3 py-1 text-caption text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
