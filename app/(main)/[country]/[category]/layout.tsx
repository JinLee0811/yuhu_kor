export function generateStaticParams() {
  return [{ country: 'au', category: 'agency' }];
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
