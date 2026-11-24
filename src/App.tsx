import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExplorePanel } from './components/ExplorePanel';
import { ExportModal } from './components/ExportModal';
import { GlossaryModal } from './components/GlossaryModal';
import { Header } from './components/Header';
import { MurimMap, type MurimMapHandle } from './components/MurimMap';
import { PinModal } from './components/PinModal';
import { RoutePanel } from './components/RoutePanel';
import { Toast } from './components/Toast';
import { BASE_LOCATIONS, FACTION_KEYS, STORAGE_KEY } from './data/murimData';
import type {
  FactionKey,
  MapStyle,
  MurimLocation,
  NewPinInput,
  PresetId,
  RouteState,
  SidebarTab,
  ThemeMode,
} from './types/murim';
import { buildGeoJSON } from './utils/geo';

function loadSavedPins(): MurimLocation[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const mapRef = useRef<MurimMapHandle | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [preset, setPreset] = useState<PresetId>('all');
  const [activeFactions, setActiveFactions] = useState<Set<FactionKey>>(
    () => new Set(FACTION_KEYS),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState('huashan');
  const [route, setRoute] = useState<RouteState>({ fromId: 'huashan', toId: 'tang' });
  const [activeTab, setActiveTab] = useState<SidebarTab>('explore');
  const [addPinMode, setAddPinMode] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<[number, number] | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [glossaryTermId, setGlossaryTermId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('hanji');

  const openGlossary = useCallback((termId: string | null = null) => {
    setGlossaryTermId(termId);
    setGlossaryOpen(true);
  }, []);
  const [mapStyle, setMapStyle] = useState<MapStyle>('vector');
  const [customPins, setCustomPins] = useState<MurimLocation[]>(loadSavedPins);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 2400);
  }, []);

  useEffect(() => {
    return () => clearTimeout(toastTimerRef.current);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('theme-night', theme === 'night');
  }, [theme]);

  const allLocations = useMemo(
    () => [...BASE_LOCATIONS, ...customPins],
    [customPins],
  );

  const filteredLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allLocations.filter((loc) => {
      if (!loc.isCustom && !loc.presets.includes(preset)) return false;
      if (!activeFactions.has(loc.faction)) return false;
      if (!q) return true;
      return (
        loc.name.toLowerCase().includes(q) ||
        (loc.hanja && loc.hanja.toLowerCase().includes(q)) ||
        loc.region.toLowerCase().includes(q) ||
        loc.arts.toLowerCase().includes(q)
      );
    });
  }, [allLocations, preset, activeFactions, searchQuery]);

  const selectedLocation = useMemo(
    () => allLocations.find((l) => l.id === selectedId),
    [allLocations, selectedId],
  );

  const geojsonString = useMemo(
    () => (exportOpen ? buildGeoJSON(filteredLocations) : ''),
    [exportOpen, filteredLocations],
  );

  const handleMapStyleChange = (next: MapStyle) => {
    if (next === mapStyle) return;
    setMapStyle(next);
    showToast(
      next === 'sumie'
        ? '수묵화 고지도 스타일로 전환했습니다.'
        : '현대 벡터 지도 스타일로 전환했습니다.',
    );
  };

  const handlePresetChange = (next: PresetId) => {
    setPreset(next);
    showToast('세계관 프리셋을 전환했습니다.');
  };

  const handleToggleFaction = (faction: FactionKey) => {
    setActiveFactions((prev) => {
      if (prev.has(faction)) {
        if (prev.size === 1) {
          showToast('최소 1개 이상의 세력을 선택해 주세요.');
          return prev;
        }
        const next = new Set(prev);
        next.delete(faction);
        return next;
      }
      const next = new Set(prev);
      next.add(faction);
      return next;
    });
  };

  const handleSelectAndFocus = (loc: MurimLocation) => {
    setSelectedId(loc.id);
    mapRef.current?.focusLocation(loc);
  };

  const handleSetOrigin = (loc: MurimLocation) => {
    setRoute((prev) => ({ ...prev, fromId: loc.id }));
    setActiveTab('route');
    showToast(`${loc.name}을(를) 출발지로 설정했습니다.`);
  };

  const handleSetDest = (loc: MurimLocation) => {
    setRoute((prev) => ({ ...prev, toId: loc.id }));
    setActiveTab('route');
    showToast(`${loc.name}을(를) 도착지로 설정했습니다.`);
  };

  const handleDeletePin = (id: string) => {
    setCustomPins((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage quota errors
      }
      return next;
    });
    setSelectedId(BASE_LOCATIONS[0].id);
    showToast('사용자 핀을 삭제했습니다.');
  };

  const handleAddPinSubmit = (input: NewPinInput) => {
    if (!pendingCoords) return;
    const newPin: MurimLocation = {
      id: `custom_${Date.now()}`,
      name: input.name,
      hanja: input.hanja,
      faction: input.faction,
      group: '사용자 추가',
      region: input.region || '사용자 지정 위치',
      coords: pendingCoords,
      arts: input.arts || '미지정',
      presets: ['all', 'hwasan', 'jungwon'],
      desc: '사용자가 지도에서 직접 지정한 커스텀 무림 거점입니다.',
      isCustom: true,
    };

    setCustomPins((prev) => {
      const next = [...prev, newPin];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage quota errors
      }
      return next;
    });
    setActiveFactions((prev) => {
      const next = new Set(prev);
      next.add(newPin.faction);
      return next;
    });
    setSelectedId(newPin.id);
    setPendingCoords(null);
    setAddPinMode(false);
    showToast(`'${newPin.name}' 거점을 추가했습니다.`);
  };

  return (
    <>
      <Header
        mapStyle={mapStyle}
        onMapStyleChange={handleMapStyleChange}
        preset={preset}
        onPresetChange={handlePresetChange}
        addPinMode={addPinMode}
        onTogglePinMode={() => setAddPinMode((v) => !v)}
        onOpenGlossary={() => openGlossary(null)}
        onOpenExport={() => setExportOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'hanji' ? 'night' : 'hanji'))}
      />

      <main className="flex-1 flex flex-col lg:flex-row min-h-0">
        <MurimMap
          ref={mapRef}
          allLocations={allLocations}
          filteredLocations={filteredLocations}
          selectedId={selectedId}
          route={route}
          mapStyle={mapStyle}
          addPinMode={addPinMode}
          onSelectLocation={setSelectedId}
          onPickPinCoords={setPendingCoords}
          onCancelPinMode={() => setAddPinMode(false)}
        />

        <aside className="panel-surface border-t lg:border-t-0 lg:border-l w-full lg:w-[370px] xl:w-[400px] flex flex-col lg:max-h-[calc(100vh-57px)] shrink-0">
          {/* Tabs */}
          <div className="grid grid-cols-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`py-3 text-sm border-b-2 transition cursor-pointer ${
                activeTab === 'explore'
                  ? 'font-semibold'
                  : 'font-medium opacity-70 hover:opacity-100'
              }`}
              style={{
                borderColor: activeTab === 'explore' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'explore' ? 'var(--accent)' : 'var(--text-main)',
              }}
            >
              문파·지명 탐색
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('route')}
              className={`py-3 text-sm border-b-2 transition cursor-pointer ${
                activeTab === 'route'
                  ? 'font-semibold'
                  : 'font-medium opacity-70 hover:opacity-100'
              }`}
              style={{
                borderColor: activeTab === 'route' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'route' ? 'var(--accent)' : 'var(--text-main)',
              }}
            >
              거리·경공 계산
            </button>
          </div>

          {activeTab === 'explore' ? (
            <ExplorePanel
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFactions={activeFactions}
              onToggleFaction={handleToggleFaction}
              selectedLocation={selectedLocation}
              filteredLocations={filteredLocations}
              selectedId={selectedId}
              onSelectAndFocus={handleSelectAndFocus}
              onSetOrigin={handleSetOrigin}
              onSetDest={handleSetDest}
              onDeletePin={handleDeletePin}
              onOpenGlossaryTerm={(termId) => openGlossary(termId)}
            />
          ) : (
            <RoutePanel
              allLocations={allLocations}
              route={route}
              onChangeFrom={(id) => setRoute((prev) => ({ ...prev, fromId: id }))}
              onChangeTo={(id) => setRoute((prev) => ({ ...prev, toId: id }))}
              onSwap={() =>
                setRoute((prev) => ({ fromId: prev.toId, toId: prev.fromId }))
              }
              onClear={() => {
                setRoute({ fromId: '', toId: '' });
                showToast('표시된 경로를 지웠습니다.');
              }}
              onOpenGlossaryTerm={(termId) => openGlossary(termId)}
            />
          )}
        </aside>
      </main>

      <GlossaryModal
        open={glossaryOpen}
        selectedTermId={glossaryTermId}
        onSelectTerm={setGlossaryTermId}
        onClose={() => setGlossaryOpen(false)}
      />

      <PinModal
        coords={pendingCoords}
        onClose={() => setPendingCoords(null)}
        onSubmit={handleAddPinSubmit}
      />

      <ExportModal
        open={exportOpen}
        geojson={geojsonString}
        onClose={() => setExportOpen(false)}
        onToast={showToast}
      />

      <Toast message={toastMessage} />
    </>
  );
}
