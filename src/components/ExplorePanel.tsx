import { Search } from 'lucide-react';
import { FACTION_KEYS, FACTION_META } from '../data/murimData';
import { resolveGlossaryId } from '../data/murimGlossary';
import type { FactionKey, MurimLocation } from '../types/murim';
import { GlossaryText } from './GlossaryText';

interface ExplorePanelProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFactions: Set<FactionKey>;
  onToggleFaction: (faction: FactionKey) => void;
  selectedLocation: MurimLocation | undefined;
  filteredLocations: MurimLocation[];
  selectedId: string;
  onSelectAndFocus: (loc: MurimLocation) => void;
  onSetOrigin: (loc: MurimLocation) => void;
  onSetDest: (loc: MurimLocation) => void;
  onDeletePin: (id: string) => void;
  onOpenGlossaryTerm: (termId: string) => void;
}

export function ExplorePanel({
  searchQuery,
  onSearchChange,
  activeFactions,
  onToggleFaction,
  selectedLocation,
  filteredLocations,
  selectedId,
  onSelectAndFocus,
  onSetOrigin,
  onSetDest,
  onDeletePin,
  onOpenGlossaryTerm,
}: ExplorePanelProps) {
  const selectedMeta = selectedLocation
    ? FACTION_META[selectedLocation.faction] || FACTION_META['정파']
    : null;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Search & Faction Filters */}
      <div className="p-3.5 border-b space-y-3" style={{ borderColor: 'var(--border)' }}>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="문파, 한자명, 지역, 무공 검색..."
            className="w-full card-surface border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FACTION_KEYS.map((key) => {
            const meta = FACTION_META[key];
            const active = activeFactions.has(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => onToggleFaction(key)}
                className="px-2.5 py-1 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer"
                style={{
                  borderColor: active ? meta.color : 'var(--border)',
                  background: active ? meta.bg : 'transparent',
                  color: active ? meta.color : 'var(--text-mute)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: meta.color }}
                />
                <span>{key}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Faction Detail Card */}
      <div className="p-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
        {!selectedLocation || !selectedMeta ? (
          <p className="text-xs" style={{ color: 'var(--text-mute)' }}>
            지도에서 문파 마커를 클릭하면 상세 지리 정보와 대표 무공을 확인할 수 있습니다.
          </p>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-serif-kr font-bold text-lg leading-tight">
                    {selectedLocation.name}
                  </h2>
                  <span
                    className="text-xs font-serif-kr"
                    style={{ color: 'var(--text-mute)' }}
                  >
                    {selectedLocation.hanja}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-mute)' }}>
                  {selectedLocation.region}
                </p>
              </div>
              {(() => {
                const badgeLabel = selectedLocation.group || selectedLocation.faction;
                const badgeTermId =
                  resolveGlossaryId(badgeLabel) || resolveGlossaryId(selectedLocation.faction);
                return badgeTermId ? (
                  <button
                    type="button"
                    onClick={() => onOpenGlossaryTerm(badgeTermId)}
                    title={`'${badgeLabel}' 무림 사전 보기`}
                    className="px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer hover:opacity-80 underline decoration-dotted underline-offset-2"
                    style={{ background: selectedMeta.bg, color: selectedMeta.color }}
                  >
                    {badgeLabel}
                  </button>
                ) : (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold shrink-0"
                    style={{ background: selectedMeta.bg, color: selectedMeta.color }}
                  >
                    {badgeLabel}
                  </span>
                );
              })()}
            </div>

            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>
              <GlossaryText
                text={selectedLocation.desc}
                onSelectTerm={onOpenGlossaryTerm}
              />
            </p>

            <div
              className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t"
              style={{ borderColor: 'var(--border)' }}
            >
              <span style={{ color: 'var(--text-sub)' }}>
                <strong>대표 무공:</strong>{' '}
                <GlossaryText
                  text={selectedLocation.arts}
                  onSelectTerm={onOpenGlossaryTerm}
                />
              </span>
              <span className="font-mono-code" style={{ color: 'var(--text-mute)' }}>
                {selectedLocation.coords[0].toFixed(2)}°E,{' '}
                {selectedLocation.coords[1].toFixed(2)}°N
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onSetOrigin(selectedLocation)}
                className="flex-1 card-surface border rounded-lg py-1.5 text-xs font-semibold hover:opacity-85 cursor-pointer"
              >
                출발지로 설정
              </button>
              <button
                type="button"
                onClick={() => onSetDest(selectedLocation)}
                className="flex-1 card-surface border rounded-lg py-1.5 text-xs font-semibold hover:opacity-85 cursor-pointer"
              >
                도착지로 설정
              </button>
              {selectedLocation.isCustom && (
                <button
                  type="button"
                  onClick={() => onDeletePin(selectedLocation.id)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
                  style={{ background: 'var(--accent)' }}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto custom-scroll p-2.5 space-y-1.5 max-h-[300px] lg:max-h-none">
        {filteredLocations.length === 0 ? (
          <div className="p-6 text-center text-xs" style={{ color: 'var(--text-mute)' }}>
            조건에 맞는 무림 거점이 없습니다.
          </div>
        ) : (
          filteredLocations.map((loc) => {
            const meta = FACTION_META[loc.faction] || FACTION_META['정파'];
            const isSelected = loc.id === selectedId;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => onSelectAndFocus(loc)}
                className="w-full text-left px-3 py-2 rounded-lg border transition flex items-center justify-between gap-2 cursor-pointer"
                style={{
                  borderColor: isSelected ? meta.color : 'transparent',
                  background: isSelected ? meta.bg : 'transparent',
                }}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: meta.color }}
                    />
                    <span className="text-sm font-semibold truncate">{loc.name}</span>
                    <span className="text-xs opacity-60 truncate">{loc.hanja}</span>
                  </div>
                  <p
                    className="text-xs truncate pl-3.5"
                    style={{ color: 'var(--text-mute)' }}
                  >
                    {loc.region}
                  </p>
                </div>
                <span
                  className="text-[11px] font-medium shrink-0 px-2 py-0.5 rounded"
                  style={{ background: meta.bg, color: meta.color }}
                >
                  {loc.faction}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
