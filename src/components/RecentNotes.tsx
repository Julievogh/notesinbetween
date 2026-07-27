import Link from "next/link";

import { getSubstackPosts } from "@/lib/substack";

function formatShortDate(date?: string) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(date));
}

export default async function RecentNotes() {
  const posts = await getSubstackPosts();

  const recentPosts = posts.slice(0, 5);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <section className="border border-black bg-[#faf9f6]">
      <div className="flex items-center justify-between border-b border-black bg-[#efebf4] px-5 py-3 font-mono text-xs uppercase">
        <span>Recent Notes</span>
        <span className="text-[#8174b2]">✳</span>
      </div>

      <div className="px-5 py-3 font-mono text-sm">
        {recentPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/journal/${post.slug}`}
            className="flex items-center justify-between border-b border-black/20 py-4 transition hover:text-[#8174b2]"
          >
            <span className="text-xs">{formatShortDate(post.pubDate)}</span>

            <span className="flex-1 px-5">{post.title ?? "Untitled note"}</span>

            <span>＋</span>
          </Link>
        ))}
      </div>

      <div className="border-t border-black/20 px-5 py-4 font-mono text-xs uppercase">
        <Link href="/journal" className="text-[#8174b2] underline underline-offset-4">
          View all notes →
        </Link>
      </div>
    </section>
  );
}
