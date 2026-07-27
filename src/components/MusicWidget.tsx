import { playlist } from "@/data/playlist";

export default function MusicWidget() {
  const currentSong = playlist[0];

  return (
    <section className="border border-black bg-[#faf9f6]">
      <div className="flex items-center justify-between border-b border-black bg-[#efebf4] px-4 py-2 font-mono text-xs uppercase">
        <span>Now Playing</span>
        <span>– □ ×</span>
      </div>

      <div className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8174b2]">I am listening to...</p>

        {/* YouTube player */}
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

        <p className="mt-4 font-mono text-xs uppercase text-neutral-500">{currentSong.note}</p>
      </div>
    </section>
  );
}
