import Link from "next/link";

import { getSubstackPosts } from "@/lib/substack";

function formatDate(date?: string) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function createExcerpt(text?: string) {
  if (!text) return "";

  const cleanedText = text
    .replace(/Yulie Sølva/gi, "")
    .replace(/Thanks for reading[\s\S]*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleanedText.length <= 260) {
    return cleanedText;
  }

  return `${cleanedText.slice(0, 260).trim()}…`;
}

export default async function LatestEntry() {
  const posts = await getSubstackPosts();
  const latestPost = posts[0];

  if (!latestPost) {
    return null;
  }

  const excerpt = createExcerpt(latestPost.contentSnippet);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase">
        <p>Latest entry</p>

        <Link href="/journal" className="underline-offset-4 hover:underline">
          View all →
        </Link>
      </div>

      <article className="border border-black bg-[#faf9f6] p-6">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <div className="flex justify-between gap-4 font-mono text-xs text-[#8174b2]">
              <time dateTime={latestPost.pubDate}>{formatDate(latestPost.pubDate)}</time>

              <span>No. 001</span>
            </div>

            <h2 className="mt-8 font-serif text-4xl leading-tight">{latestPost.title ?? "Untitled note"}</h2>

            {excerpt && <p className="mt-5 max-w-xl font-mono text-sm leading-7">{excerpt}</p>}

            <div className="mt-8 flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-wider">
              <Link
                href={`/journal/${latestPost.slug}`}
                className="border-b border-[#8174b2] pb-1 text-[#8174b2] transition hover:opacity-60"
              >
                Continue reading here →
              </Link>

              {latestPost.link && (
                <a
                  href={latestPost.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 transition hover:text-[#8174b2]"
                >
                  Read on Substack ↗
                </a>
              )}
            </div>
          </div>

          {latestPost.image ? (
            <Link
              href={`/journal/${latestPost.slug}`}
              className="group relative min-h-64 overflow-hidden border border-black/20 bg-[#dedbd2]"
            >
              <img
                src={latestPost.image}
                alt={latestPost.title ?? "Journal entry image"}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />

              <div className="pointer-events-none absolute left-1/2 top-[-7px] z-10 h-8 w-24 -translate-x-1/2 rotate-2 bg-[#d8cbb6]/75" />
            </Link>
          ) : (
            <Link
              href={`/journal/${latestPost.slug}`}
              aria-label={`Read ${latestPost.title ?? "journal entry"}`}
              className="relative min-h-64"
            >
              <div className="absolute inset-4 rotate-[-1deg] border border-black/20 bg-[#dedbd2]" />

              <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-[1deg] border border-black/20 bg-neutral-300" />

              <div className="absolute left-1/2 top-[-8px] z-10 h-8 w-24 -translate-x-1/2 rotate-2 bg-[#d8cbb6]/70" />

              <div className="absolute inset-0 flex items-center justify-center p-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
                Notes in between
              </div>
            </Link>
          )}
        </div>
      </article>
    </section>
  );
}
