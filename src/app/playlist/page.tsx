import Link from "next/link";
import { playlist } from "@/data/playlist";

export const metadata = {
  title: "Playlist | Notes In Between",
  description: "A personal archive of songs, memories and moments from Notes In Between.",
};

export default function PlaylistPage() {
  return (
    <main className="min-h-screen px-5 py-8 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-black pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              ← Notes In Between
            </Link>

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8174b2]">Musical memory archive</p>
          </div>

          <div className="mt-14 max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8174b2]">Songs I have kept</p>

            <h1 className="mt-5 font-serif text-6xl leading-[0.9] tracking-tight sm:text-7xl md:text-8xl">
              The Playlist
            </h1>

            <p className="mt-7 max-w-2xl font-mono text-sm leading-7">
              A collection of songs that found me at particular moments. Some belong to people, some to places, and some
              to versions of myself that no longer exist.
            </p>
          </div>
        </header>

        <section className="py-10">
          <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
            <span>Archive</span>
            <span>
              {playlist.length} {playlist.length === 1 ? "song" : "songs"}
            </span>
          </div>

          <div className="space-y-8">
            {[...playlist].reverse().map((song, index) => (
              <article key={song.id} className="border border-black bg-[#faf9f6]">
                <div className="flex items-center justify-between border-b border-black bg-[#efebf4] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em]">
                  <span>Track {String(index + 1).padStart(2, "0")}</span>

                  <span>{song.addedAt}</span>
                </div>

                <div className="grid gap-0 lg:grid-cols-[minmax(280px,0.9fr)_1.25fr]">
                  <div className="border-b border-black p-4 lg:border-b-0 lg:border-r">
                    <div className="border border-black bg-black p-1">
                      <iframe
                        className="aspect-video w-full"
                        src={`https://www.youtube.com/embed/${song.youtubeId}?rel=0`}
                        title={`${song.artist} – ${song.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-6 md:p-8">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8174b2]">{song.artist}</p>

                      <h2 className="mt-3 font-serif text-4xl italic leading-tight md:text-5xl">{song.title}</h2>

                      {song.note && (
                        <p className="mt-5 font-mono text-xs uppercase leading-6 text-neutral-500">{song.note}</p>
                      )}

                      {song.memory && (
                        <div className="mt-8 border-l border-[#8174b2] pl-5">
                          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8174b2]">
                            The memory
                          </p>

                          <p className="max-w-2xl font-serif text-xl leading-8">{song.memory}</p>
                        </div>
                      )}
                    </div>

                    <a
                      href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-10 w-fit border-b border-black pb-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-opacity hover:opacity-50"
                    >
                      Listen on YouTube ↗
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-black py-8 font-mono text-[10px] uppercase tracking-[0.14em]">
          <span>Notes In Between</span>

          <Link href="/" className="transition-opacity hover:opacity-50">
            Return home →
          </Link>
        </footer>
      </div>
    </main>
  );
}
