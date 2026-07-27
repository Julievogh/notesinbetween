import Link from "next/link";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";

import ArticlePhoto from "@/components/ArticlePhoto";
import SiteBackground from "@/components/SiteBackground";
import { getSubstackPostBySlug, getSubstackPosts } from "@/lib/substack";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type JournalPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date?: string) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function removeFirstHeading(html: string) {
  return html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>/i, "");
}

function cleanArticleHtml(html: string) {
  const withoutFirstHeading = removeFirstHeading(html);

  return sanitizeHtml(withoutFirstHeading, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "figure", "figcaption"],

    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,

      img: ["src", "alt", "title", "width", "height", "loading"],

      a: ["href", "target", "rel"],

      div: ["class"],

      figure: ["class"],

      figcaption: ["class"],
    },

    allowedSchemes: ["http", "https", "mailto"],

    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),

      img: sanitizeHtml.simpleTransform("img", {
        loading: "lazy",
      }),
    },

    exclusiveFilter(frame) {
      const className = frame.attribs?.class ?? "";

      return className.includes("subscription-widget") || className.includes("subscription-widget-wrap-editor");
    },
  });
}

export default async function JournalPostPage({ params }: JournalPostPageProps) {
  const { slug } = await params;

  const [post, allPosts] = await Promise.all([getSubstackPostBySlug(slug), getSubstackPosts()]);

  if (!post) {
    notFound();
  }

  const rawContent = post["content:encoded"] ?? post.content ?? "";

  const articleHtml = cleanArticleHtml(rawContent);

  const currentIndex = allPosts.findIndex((item) => item.slug === slug);

  const noteNumber = currentIndex >= 0 ? allPosts.length - currentIndex : allPosts.length;

  const otherPosts = allPosts.filter((item) => item.slug !== slug).slice(0, 4);

  return (
    <SiteBackground>
      <header className="mb-6 flex items-center justify-between border-b border-black pb-4 font-mono text-[10px] uppercase tracking-[0.14em] sm:text-xs">
        <Link href="/journal" className="accent-text transition hover:opacity-50">
          ← Journal
        </Link>

        <Link href="/" className="transition hover:text-[var(--color-accent)]">
          Notes In Between
        </Link>
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-[240px_minmax(0,760px)_280px] xl:justify-center">
        <aside className="order-2 xl:order-1">
          <div className="space-y-5 xl:sticky xl:top-6">
            <section className="window-panel">
              <div className="window-header">
                <span>Navigation</span>
                <span>– □ ×</span>
              </div>

              <nav className="font-mono text-xs uppercase tracking-[0.08em]">
                <Link
                  href="/"
                  className="flex justify-between border-b border-black/20 px-4 py-4 transition hover:bg-[var(--color-lavender)]"
                >
                  <span>Home</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/journal"
                  className="accent-text flex justify-between border-b border-black/20 px-4 py-4 transition hover:bg-[var(--color-lavender)]"
                >
                  <span>Journal</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/#about"
                  className="flex justify-between px-4 py-4 transition hover:bg-[var(--color-lavender)]"
                >
                  <span>About</span>
                  <span>→</span>
                </Link>
              </nav>
            </section>

            {otherPosts.length > 0 && (
              <section className="window-panel">
                <div className="flex items-center justify-between border-b border-black px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em]">
                  <span>Other Notes</span>
                  <span>✳</span>
                </div>

                <div>
                  {otherPosts.map((otherPost) => (
                    <Link
                      key={otherPost.slug}
                      href={`/journal/${otherPost.slug}`}
                      className="block border-b border-black/20 px-4 py-4 transition last:border-b-0 hover:bg-[var(--color-lavender)]"
                    >
                      <p className="font-serif text-xl leading-tight">{otherPost.title ?? "Untitled note"}</p>

                      <p className="accent-text mt-2 font-mono text-[9px] uppercase tracking-[0.1em]">
                        {formatDate(otherPost.pubDate)}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>

        <article className="order-1 xl:order-2">
          <div className="paper paper-shadow relative rotate-[-0.2deg] border border-black/15 px-6 py-12 sm:px-12 sm:py-16 lg:px-20">
            <div className="tape absolute left-1/2 top-[-13px] h-10 w-32 -translate-x-1/2 rotate-1 shadow-sm" />

            <header className="border-b border-black pb-10 text-center">
              <p className="accent-text font-mono text-[10px] uppercase tracking-[0.25em]">
                Journal entry · No. {String(noteNumber).padStart(3, "0")}
              </p>

              <h1 className="mx-auto mt-7 max-w-2xl font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {post.title ?? "Untitled note"}
              </h1>

              <time
                dateTime={post.pubDate}
                className="text-muted mt-7 block font-mono text-[10px] uppercase tracking-[0.16em]"
              >
                {formatDate(post.pubDate)}
              </time>
            </header>

            {post.image && (
              <div className="my-12">
                <ArticlePhoto
                  src={post.image}
                  alt={post.title ?? "Journal entry image"}
                  caption="A little moment in between"
                />
              </div>
            )}

            {articleHtml ? (
              <div
                className="article-content"
                dangerouslySetInnerHTML={{
                  __html: articleHtml,
                }}
              />
            ) : (
              <p className="py-16 text-center font-mono text-sm">This note could not be loaded.</p>
            )}

            <footer className="mt-16 border-t border-black pt-10">
              <p className="font-serif text-3xl italic">x, Yulie</p>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-5 font-mono text-[10px] uppercase tracking-[0.14em]">
                <Link href="/journal" className="accent-text transition hover:opacity-50">
                  ← Back to Journal
                </Link>

                {post.link && (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-[var(--color-accent)]"
                  >
                    Read on Substack ↗
                  </a>
                )}
              </div>
            </footer>
          </div>
        </article>

        <aside className="order-3">
          <div className="space-y-5 xl:sticky xl:top-6">
            {post.image && (
              <section className="paper rotate-[0.7deg] p-3 pb-8 shadow-md">
                <img src={post.image} alt="" className="aspect-square w-full object-cover" />

                <p className="text-muted mt-5 text-center font-mono text-[9px] uppercase tracking-[0.15em]">
                  {formatDate(post.pubDate)}
                </p>
              </section>
            )}

            <section className="window-panel">
              <div className="window-header">About this note</div>

              <div className="p-5 font-mono text-xs leading-6">
                <p>A note written somewhere between figuring things out and learning to leave them unfinished.</p>

                {post.link && (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accent-text accent-border mt-5 inline-block border-b pb-1 uppercase"
                  >
                    Open on Substack →
                  </a>
                )}
              </div>
            </section>

            <blockquote className="lavender-panel border border-black p-6 text-center font-serif text-xl italic leading-8">
              “It’s about noticing the in between.”
            </blockquote>
          </div>
        </aside>
      </div>

      <footer className="mt-8 flex flex-wrap justify-between gap-4 border-t border-black py-5 font-mono text-[10px] uppercase tracking-[0.12em]">
        <p>© 2026 Notes In Between</p>

        <Link href="/journal" className="transition hover:text-[var(--color-accent)]">
          More notes ↑
        </Link>
      </footer>
    </SiteBackground>
  );
}
