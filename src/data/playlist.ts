export type Song = {
  id: number;
  artist: string;
  title: string;
  youtubeId: string;
  addedAt: string;
  note?: string;
};

export const playlist = [
  {
    artist: "Mazzy Star",
    title: "Fade Into You",
    note: "the first song in the archive",
    youtubeId: "ImKY6TZEyrI",
  },
];
