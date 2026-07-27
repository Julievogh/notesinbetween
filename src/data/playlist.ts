export type Song = {
  id: number;
  artist: string;
  title: string;
  youtubeId: string;
  addedAt: string;

  // A short line shown on the front page
  note?: string;

  // The longer personal story shown on the playlist page
  memory?: string;
};

export const playlist: Song[] = [
  {
    id: 1,
    artist: "Mazzy Star",
    title: "Fade Into You",
    youtubeId: "ImKY6TZEyrI",
    addedAt: "25/07/2026",
    note: "The first song in the archive",
    memory:
      "This was the first song I added to Notes In Between. It feels like longing without needing to explain itself — soft, distant and strangely comforting.",
  },

  {
    id: 2,
    artist: "The Cure",
    title: "Pictures of You",
    youtubeId: "UmFFTkjs-O0?si=OCzwehkxtRUhSCse",
    addedAt: "27/07/2026",
    note: "A song that always brings me back",
    memory: "For me, this song represents the memories that only exist in pictures now. Like him",
  },

  // Add your next song like this:
  /*
  {
    id: 2,
    artist: "The Cure",
    title: "Pictures of You",
    youtubeId: "YOUR_YOUTUBE_VIDEO_ID",
    addedAt: "27/07/2026",
    note: "A song that always brings me back",
    memory:
      "Write your personal memory here. It can be a place, a person, a specific year, or simply the feeling the song gives you.",
  },
  */
];
