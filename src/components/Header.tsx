import { BookOpen, Brush, Download, Layers, MapPinPlus, Moon, Sun } from 'lucide-react';
import { PRESET_OPTIONS } from '../data/murimData';
import type { MapStyle, PresetId, ThemeMode } from '../types/murim';

interface HeaderProps {
  mapStyle: MapStyle;
  onMapStyleChange: (style: MapStyle) => void;
  preset: PresetId;
  onPresetChange: (preset: PresetId) => void;
  addPinMode: boolean;
  onTogglePinMode: () => void;
  onOpenGlossary: () => void;
  onOpenExport: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function Header({
  mapStyle,
  onMapStyleChange,
  preset,
  onPresetChange,
  addPinMode,
  onTogglePinMode,
  onOpenGlossary,
  onOpenExport,
  theme,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="panel-surface border-b px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-serif-kr font-black text-sm"
          style={{ background: 'var(--accent)' }}
        >
          武
        </div>
        <div className="min-w-0">
          <h1 className="font-serif-kr font-bold text-base sm:text-lg leading-tight truncate">
            강호여지도{' '}
            <span className="text-xs font-normal opacity-70 hidden sm:inline">
              벡터 무림지도
            </span>
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div
          className="card-surface border rounded-lg p-0.5 flex items-center text-xs sm:text-sm font-medium"
          role="group"
          aria-label="지도 스타일 전환"
        >
          <button
            type="button"
            onClick={() => onMapStyleChange('vector')}
            className={`style-seg-btn px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer ${
              mapStyle === 'vector' ? 'active' : ''
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>벡터</span>
          </button>
          <button
            type="button"
            onClick={() => onMapStyleChange('sumie')}
            className={`style-seg-btn px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer ${
              mapStyle === 'sumie' ? 'active' : ''
            }`}
          >
            <Brush className="w-3.5 h-3.5" />
            <span>수묵화</span>
          </button>
        </div>

        <label className="sr-only" htmlFor="preset-select">
          세계관 프리셋
        </label>
        <select
          id="preset-select"
          value={preset}
          onChange={(e) => onPresetChange(e.target.value as PresetId)}
          className="card-surface border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium focus:outline-none cursor-pointer"
        >
          {PRESET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onOpenGlossary}
          className="card-surface border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium flex items-center gap-1.5 hover:opacity-85 transition cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>무림 사전</span>
        </button>

        <button
          type="button"
          onClick={onTogglePinMode}
          className="card-surface border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium flex items-center gap-1.5 hover:opacity-85 transition cursor-pointer"
          style={{
            borderColor: addPinMode ? 'var(--accent)' : 'var(--border)',
            color: addPinMode ? 'var(--accent)' : 'var(--text-main)',
          }}
        >
          <MapPinPlus className="w-4 h-4" />
          <span>핀 추가</span>
        </button>

        <button
          type="button"
          onClick={onOpenExport}
          className="card-surface border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium flex items-center gap-1.5 hover:opacity-85 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">GeoJSON</span>
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          className="card-surface border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium flex items-center gap-1.5 hover:opacity-85 transition cursor-pointer"
          title="테마 전환"
        >
          {theme === 'night' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
          <span className="hidden md:inline">
            {theme === 'night' ? '한지 수묵' : '야간 묵화'}
          </span>
        </button>
      </div>
    </header>
  );
}
