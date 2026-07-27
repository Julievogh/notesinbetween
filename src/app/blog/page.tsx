import { getSubstackPosts } from "@/lib/substack";

export default async function BlogPage() {
  const posts = await getSubstackPosts();

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="font-serif text-5xl">Notes In Between</h1>

      <p className="mt-4 text-neutral-600">Thoughts, stories and little moments.</p>

      <section className="mt-12 space-y-8">
        {posts.map((post) => (
          <article key={post.link} className="border-b border-black pb-8">
            <h2 className="font-serif text-3xl">{post.title}</h2>

            <p className="mt-2 font-mono text-xs uppercase text-neutral-500">{post.pubDate}</p>

            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-mono text-sm underline"
            >
              Read entry →
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
