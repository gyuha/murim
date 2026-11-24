export type FactionKey = '정파' | '세가' | '사파' | '마교' | '새외';

export type PresetId = 'all' | 'hwasan' | 'jungwon';

export type MapStyle = 'vector' | 'sumie';

export type ThemeMode = 'hanji' | 'night';

export type SidebarTab = 'explore' | 'route';

export interface FactionMeta {
  label: string;
  color: string;
  bg: string;
}

export interface MurimLocation {
  id: string;
  name: string;
  hanja: string;
  faction: FactionKey;
  group: string;
  region: string;
  coords: [number, number];
  arts: string;
  presets: PresetId[];
  desc: string;
  isCustom?: boolean;
}

export interface RouteState {
  fromId: string;
  toId: string;
}

export interface NewPinInput {
  name: string;
  hanja: string;
  faction: FactionKey;
  region: string;
  arts: string;
}
