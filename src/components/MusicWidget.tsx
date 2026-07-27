import Link from "next/link";
import { playlist } from "@/data/playlist";

export default function MusicWidget() {
  const currentSong = playlist[playlist.length - 1];

  if (!currentSong) {
    return null;
  }

  return (
    <section className="border border-black bg-[#faf9f6]">
      <div className="flex items-center justify-between border-b border-black bg-[#efebf4] px-4 py-2 font-mono text-xs uppercase">
        <span>Now Playing</span>
        <span>– □ ×</span>
      </div>

      <div className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8174b2]">I am listening to...</p>

        <div className="mt-4 border border-black bg-black p-1">
          <iframe
            className="aspect-video w-full"
            src={`https://www.youtube.com/embed/${currentSong.youtubeId}?rel=0`}
            title={`${currentSong.artist} – ${currentSong.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <h3 className="mt-4 font-mono text-lg">{currentSong.artist}</h3>

        <p className="font-serif text-2xl italic">{currentSong.title}</p>

        {currentSong.note && (
          <p className="mt-4 font-mono text-xs uppercase leading-relaxed text-neutral-500">{currentSong.note}</p>
        )}

        <Link
          href="/playlist"
          className="mt-5 inline-block border-b border-[#8174b2] pb-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-opacity hover:opacity-60"
        >
          Open the full playlist →
        </Link>
      </div>
    </section>
  );
}
