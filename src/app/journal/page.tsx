import Link from "next/link";

import SiteBackground from "@/components/SiteBackground";
import { getSubstackPosts } from "@/lib/substack";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(date?: string) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function createExcerpt(text?: string) {
  if (!text) return "";

  const cleanedText = text
    .replace(/Thanks for reading[\s\S]*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const maximumLength = 480;

  if (cleanedText.length <= maximumLength) {
    return cleanedText;
  }

  return `${cleanedText.slice(0, maximumLength).trim()}…`;
}

export default async function JournalPage() {
  const posts = await getSubstackPosts();

  return (
    <SiteBackground narrow>
      <header className="border-b border-black pb-12">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] sm:text-xs">
          <Link href="/" className="accent-text transition hover:opacity-50">
            ← Notes In Between
          </Link>

          <span>Journal archive</span>
        </div>

        <p className="accent-text mt-16 font-mono text-xs uppercase tracking-[0.3em]">
          Thoughts, stories & everything in between
        </p>

        <h1 className="mt-5 font-serif text-6xl leading-none tracking-[-0.05em] sm:text-8xl">Journal</h1>

        <p className="mt-8 max-w-xl font-mono text-sm leading-7">
          A collection of notes about life, honesty, home, creativity and whatever happens in between.
        </p>
      </header>

      {posts.length > 0 ? (
        <section className="py-4">
          {posts.map((post, index) => {
            const excerpt = createExcerpt(post.contentSnippet);

            return (
              <article
                key={post.slug}
                className="paper-card my-8 grid gap-8 p-6 sm:p-8 lg:grid-cols-[150px_minmax(0,1fr)_280px]"
              >
                <div className="accent-text font-mono text-[10px] uppercase tracking-[0.1em] sm:text-xs">
                  <time dateTime={post.pubDate}>{formatDate(post.pubDate)}</time>

                  <p className="text-muted mt-2">No. {String(posts.length - index).padStart(3, "0")}</p>
                </div>

                <div className="self-center">
                  <h2 className="max-w-2xl font-serif text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">
                    <Link href={`/journal/${post.slug}`} className="transition hover:text-[var(--color-accent)]">
                      {post.title ?? "Untitled note"}
                    </Link>
                  </h2>

                  {excerpt && <p className="text-muted mt-6 max-w-2xl font-mono text-sm leading-7">{excerpt}</p>}

                  <div className="mt-8 flex flex-wrap gap-6 font-mono text-[10px] uppercase tracking-[0.12em] sm:text-xs">
                    <Link
                      href={`/journal/${post.slug}`}
                      className="accent-text accent-border border-b pb-1 transition hover:opacity-50"
                    >
                      Continue reading →
                    </Link>

                    {post.link && (
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted transition hover:text-[var(--color-accent)]"
                      >
                        Read on Substack ↗
                      </a>
                    )}
                  </div>
                </div>

                <Link
                  href={`/journal/${post.slug}`}
                  aria-label={`Read ${post.title ?? "journal entry"}`}
                  className="group relative min-h-[260px] overflow-hidden border border-black/20 bg-[#dedbd2]"
                >
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title ?? "Journal entry image"}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-4 rotate-[-1deg] border border-black/20 bg-[#dedbd2]" />

                      <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-[1deg] border border-black/20 bg-neutral-300" />

                      <div className="absolute inset-0 flex items-center justify-center p-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
                        Notes in between
                      </div>
                    </>
                  )}

                  <div className="tape pointer-events-none absolute left-1/2 top-[-7px] z-10 h-8 w-24 -translate-x-1/2 rotate-2" />

                  <div className="paper absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center border border-black font-mono text-lg transition group-hover:translate-x-1">
                    →
                  </div>
                </Link>
              </article>
            );
          })}
        </section>
      ) : (
        <p className="py-16 font-mono text-sm">No journal entries yet.</p>
      )}

      <footer className="flex flex-wrap justify-between gap-4 border-t border-black py-6 font-mono text-[10px] uppercase tracking-[0.12em]">
        <p>© 2026 Notes In Between</p>

        <Link href="/" className="transition hover:text-[var(--color-accent)]">
          Back home ↑
        </Link>
      </footer>
    </SiteBackground>
  );
}
