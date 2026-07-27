import type { ReactNode } from "react";

type SiteBackgroundProps = {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
};

export default function SiteBackground({ children, narrow = false, className = "" }: SiteBackgroundProps) {
  return (
    <main className={`site-background ${className}`}>
      <div className={narrow ? "site-page-narrow" : "site-page"}>{children}</div>
    </main>
  );
}
