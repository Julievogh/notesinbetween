import Link from "next/link";

import LatestEntry from "@/components/LatestEntry";
import MusicWidget from "@/components/MusicWidget";
import RecentNotes from "@/components/RecentNotes";
import SiteBackground from "@/components/SiteBackground";

export const dynamic = "force-dynamic";
export const revalidate = 0;
const menuItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Journal",
    href: "/journal",
  },
  {
    label: "Archive",
    href: "/journal",
  },
  {
    label: "About",
    href: "/#about",
  },
  {
    label: "Playlist",
    href: "/#playlist",
  },
  {
    label: "Contact",
    href: "/#contact",
  },
];

export default function Home() {
  return (
    <SiteBackground>
      <div id="top">
        <header className="flex items-center justify-between border-b border-black pb-4 font-mono text-xs uppercase tracking-[0.16em]">
          <p>Sat 25.07.2026 · 18:22:01</p>

          <nav className="hidden gap-8 md:flex">
            <Link href="/journal" className="transition hover:opacity-50">
              Journal
            </Link>

            <Link href="/journal" className="transition hover:opacity-50">
              Archive
            </Link>

            <Link href="/#about" className="transition hover:opacity-50">
              About
            </Link>

            <span className="accent-text">✳</span>
          </nav>
        </header>

        <div className="mt-5 grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)_380px]">
          <aside className="space-y-5">
            <section className="window-panel">
              <div className="window-header">
                <span>Menu</span>
                <span>– □ ×</span>
              </div>

              <nav className="font-mono text-sm uppercase tracking-[0.08em]">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 border-b border-black/20 px-5 py-4 transition hover:bg-[var(--color-lavender)]"
                  >
                    <span className="accent-text">→</span>

                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex justify-between px-5 py-3 font-mono text-[10px]">
                <span>notes in between</span>
                <span>v1.0</span>
              </div>
            </section>

            <div id="playlist">
              <MusicWidget />
            </div>

            <section className="window-panel">
              <div className="window-header">
                <span>Current Mood</span>
                <span>– □ ×</span>
              </div>

              <div className="p-4 font-mono text-sm leading-7">
                <p>daydreaming</p>
                <p>with a coffee</p>
                <p>and a notebook</p>

                <p className="accent-text mt-3 text-2xl">✳</p>
              </div>
            </section>
          </aside>

          <section>
            <div className="pt-12">
              <p className="accent-text font-mono text-xs uppercase tracking-[0.3em]">
                – Welcome to my digital notebook
              </p>

              <h1 className="mt-6 font-serif text-[64px] leading-[0.88] tracking-[-0.04em] sm:text-[88px] xl:text-[110px]">
                Notes
                <br />
                In Between
              </h1>

              <p className="accent-text accent-border mt-8 border-l pl-5 font-mono text-xs uppercase tracking-[0.35em]">
                Thoughts, stories & everything in between
              </p>
            </div>

            <section id="journal" className="mt-12">
              <LatestEntry />

              <blockquote className="lavender-panel mt-6 px-8 py-7 text-center font-mono leading-8">
                “It’s not about having it all figured out.
                <br />
                It’s about noticing the <u>in between</u>.”
              </blockquote>
            </section>
          </section>

          <aside className="space-y-6 pt-4">
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="block">
              <div className="relative min-h-[340px]">
                <div className="absolute left-0 top-4 h-[300px] w-[250px] rotate-[-2deg] border border-black/20 bg-neutral-300 shadow-md" />

                <div className="paper absolute right-0 top-24 w-48 rotate-1 border border-black/10 p-6 font-mono text-sm leading-7 shadow-sm">
                  <p className="text-xl">＋</p>
                  <p className="mt-4">latest</p>
                  <p>on instagram</p>

                  <p className="mt-7 text-[10px]">@notesinbetween_</p>

                  <p className="mt-3 text-[10px] uppercase">View on Instagram →</p>
                </div>
              </div>
            </a>

            <RecentNotes />

            <section id="about" className="window-panel">
              <div className="flex items-center justify-between border-b border-black px-5 py-3 font-mono text-xs uppercase">
                <span>A Little Note</span>
                <span>– □ ×</span>
              </div>

              <div className="p-5 font-mono text-xs leading-6">
                <p>This is my space on the internet.</p>

                <p>Thanks for being here.</p>

                <p className="mt-4 font-serif text-2xl italic">x, Yulie</p>
              </div>
            </section>

            <section id="contact" className="window-panel">
              <div className="window-header px-5 py-3">
                <span>Contact</span>
                <span className="accent-text">✳</span>
              </div>

              <div className="p-5 font-mono text-xs leading-6">
                <p>Thoughts, questions or little notes are always welcome.</p>

                <a
                  href="mailto:hello@example.com"
                  className="accent-text accent-border mt-4 inline-block border-b pb-1 uppercase"
                >
                  Send a note →
                </a>
              </div>
            </section>
          </aside>
        </div>

        <footer className="mt-5 flex flex-col gap-3 border-t border-black pt-4 font-mono text-[10px] uppercase tracking-[0.12em] md:flex-row md:justify-between">
          <p>© 2026 Notes In Between</p>

          <p>
            Made with <span className="accent-text">♡</span> & coffee
          </p>

          <Link href="/#top" className="transition hover:text-[var(--color-accent)]">
            Top ↑
          </Link>
        </footer>
      </div>
    </SiteBackground>
  );
}
