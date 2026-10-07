export interface LyricLine {
  id: string;
  timeSec: number;
  text: string;
  note?: string;
}

export interface LyricSection {
  title: string;
  lines: LyricLine[];
}

export interface SongTrackData {
  title: string;
  composer: string;
  durationSec: number;
  genre: string;
  tempoBpm: number;
  scaleRoot: string;
  scaleType: 'minor' | 'major' | 'dorian';
  synthStyle: 'acoustic-guitar' | 'ambient-strings' | 'piano-elegy' | 'brass-chorale' | 'cinematic-folk';
  audioUrl?: string;
  chordProgression: string[];
}

/** Extra playable tracks beyond the veteran's featured main song. */
export interface VeteranSongEntry {
  id: string;
  song: SongTrackData;
  lyrics?: LyricSection[];
  songcardUrl?: string;
}

export interface Veteran {
  id: string;
  name: string;
  rank: string;
  branch: 'Army' | 'Navy' | 'Air Force' | 'Marine Corps' | 'Coast Guard' | 'Space Force';
  serviceEra: string;
  yearsOfService: string;
  hometown?: string;
  imageUrl: string;
  imageAlt: string;
  songcardUrl?: string;
  shortQuote: string;
  story: string;
  /** Featured main track (roster cards, song card, interactive lyrics, autoplay). */
  song: SongTrackData;
  lyrics: LyricSection[];
  /** Optional additional songs by this veteran (shown as secondary tracks). */
  additionalSongs?: VeteranSongEntry[];
  medals?: string[];
}

/** All playable tracks for radio / playlists: main song first, then additional. */
export function getVeteranSongs(veteran: Veteran): VeteranSongEntry[] {
  const primary: VeteranSongEntry = {
    id: `${veteran.id}-primary`,
    song: veteran.song,
    lyrics: veteran.lyrics,
    songcardUrl: veteran.songcardUrl,
  };
  return [primary, ...(veteran.additionalSongs ?? [])];
}
