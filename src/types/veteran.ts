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
  song: SongTrackData;
  lyrics: LyricSection[];
  medals?: string[];
}
