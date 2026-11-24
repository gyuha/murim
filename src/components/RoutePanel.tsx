import { ArrowUpDown } from 'lucide-react';
import { TRAVEL_MODES } from '../data/murimData';
import type { MurimLocation, RouteState } from '../types/murim';
import { haversineKm } from '../utils/geo';
import { GlossaryText } from './GlossaryText';

interface RoutePanelProps {
  allLocations: MurimLocation[];
  route: RouteState;
  onChangeFrom: (id: string) => void;
  onChangeTo: (id: string) => void;
  onSwap: () => void;
  onClear: () => void;
  onOpenGlossaryTerm: (termId: string) => void;
}

export function RoutePanel({
  allLocations,
  route,
  onChangeFrom,
  onChangeTo,
  onSwap,
  onClear,
  onOpenGlossaryTerm,
}: RoutePanelProps) {
  const fromLoc = allLocations.find((l) => l.id === route.fromId);
  const toLoc = allLocations.find((l) => l.id === route.toId);

  const straightKm =
    fromLoc && toLoc && fromLoc.id !== toLoc.id
      ? haversineKm(fromLoc.coords, toLoc.coords)
      : null;
  const roadKm = straightKm !== null ? straightKm * 1.25 : null;
  const ri = roadKm !== null ? Math.round(roadKm / 0.4) : null;

  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-4">
      <div className="space-y-2.5">
        <div>
          <label
            htmlFor="route-from"
            className="block text-xs font-semibold mb-1"
            style={{ color: 'var(--text-mute)' }}
          >
            출발 거점
          </label>
          <select
            id="route-from"
            value={route.fromId}
            onChange={(e) => onChangeFrom(e.target.value)}
            className="w-full card-surface border rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">-- 출발 거점 선택 --</option>
            {allLocations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.region})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onSwap}
            className="card-surface border rounded-lg px-3 py-1 text-xs font-medium flex items-center gap-1 hover:opacity-85 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>출발·도착 바꾸기</span>
          </button>
          <button
            type="button"
            onClick={onClear}
            className="card-surface border rounded-lg px-3 py-1 text-xs font-medium opacity-80 hover:opacity-100 cursor-pointer"
          >
            경로 지우기
          </button>
        </div>

        <div>
          <label
            htmlFor="route-to"
            className="block text-xs font-semibold mb-1"
            style={{ color: 'var(--text-mute)' }}
          >
            도착 거점
          </label>
          <select
            id="route-to"
            value={route.toId}
            onChange={(e) => onChangeTo(e.target.value)}
            className="w-full card-surface border rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">-- 도착 거점 선택 --</option>
            {allLocations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.region})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card-surface border rounded-xl p-4 space-y-3">
        {!fromLoc || !toLoc ? (
          <p className="text-xs" style={{ color: 'var(--text-mute)' }}>
            출발지와 도착지를 선택하면 실제 거리와 이동 일수를 계산합니다.
          </p>
        ) : fromLoc.id === toLoc.id ? (
          <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
            서로 다른 두 거점을 선택해 주세요.
          </p>
        ) : (
          roadKm !== null &&
          straightKm !== null &&
          ri !== null && (
            <>
              <div
                className="flex items-baseline justify-between border-b pb-3"
                style={{ borderColor: 'var(--border)' }}
              >
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-mute)' }}>
                    예상 노정 거리 (우회 1.25×)
                  </p>
                  <p className="text-2xl font-bold font-mono-code mt-0.5">
                    {Math.round(roadKm).toLocaleString()}{' '}
                    <span className="text-sm font-normal">km</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                    약 {ri.toLocaleString()}{' '}
                    <GlossaryText text="리(里)" onSelectTerm={onOpenGlossaryTerm} />
                  </p>
                  <p
                    className="text-[11px] font-mono-code"
                    style={{ color: 'var(--text-mute)' }}
                  >
                    직선 {Math.round(straightKm).toLocaleString()} km
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {TRAVEL_MODES.map((m) => {
                  const days = Math.max(0.5, roadKm / m.speed);
                  return (
                    <div key={m.label} className="panel-surface border rounded-lg p-2.5">
                      <p className="text-[11px]" style={{ color: 'var(--text-mute)' }}>
                        <GlossaryText text={m.label} onSelectTerm={onOpenGlossaryTerm} />
                      </p>
                      <p className="text-base font-bold font-mono-code mt-0.5">
                        {days < 10 ? days.toFixed(1) : Math.round(days)}일
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )
        )}
      </div>

      <div
        className="text-xs leading-relaxed p-3 rounded-lg border"
        style={{ borderColor: 'var(--border)', color: 'var(--text-mute)' }}
      >
        <GlossaryText
          text="대권 직선거리(Haversine)를 기준으로 산악·관도 우회 계수(1.25×)를 반영한 추정치입니다. 1리(里)는 약 0.4km로 환산했습니다."
          onSelectTerm={onOpenGlossaryTerm}
        />
      </div>
    </div>
  );
}
