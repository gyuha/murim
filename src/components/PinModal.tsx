import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { FACTION_KEYS } from '../data/murimData';
import type { FactionKey, NewPinInput } from '../types/murim';

interface PinModalProps {
  coords: [number, number] | null;
  onClose: () => void;
  onSubmit: (input: NewPinInput) => void;
}

export function PinModal({ coords, onClose, onSubmit }: PinModalProps) {
  const [name, setName] = useState('');
  const [hanja, setHanja] = useState('');
  const [faction, setFaction] = useState<FactionKey>('정파');
  const [region, setRegion] = useState('');
  const [arts, setArts] = useState('');

  useEffect(() => {
    if (coords) {
      setName('');
      setHanja('');
      setFaction('정파');
      setRegion('');
      setArts('');
    }
  }, [coords]);

  if (!coords) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit({
      name: trimmed,
      hanja: hanja.trim(),
      faction,
      region: region.trim(),
      arts: arts.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card-surface border rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-kr font-bold text-lg">새 무림 거점 추가</h2>
          <button
            type="button"
            onClick={onClose}
            className="opacity-60 hover:opacity-100 cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className="text-xs font-mono-code px-3 py-1.5 rounded-lg"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          선택 좌표: 경도 {coords[0]}°E, 위도 {coords[1]}°N
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="pin-name" className="block text-xs font-medium mb-1">
                문파·지명 (필수)
              </label>
              <input
                id="pin-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 혈교 본단"
                className="w-full panel-surface border rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="pin-hanja" className="block text-xs font-medium mb-1">
                한자명
              </label>
              <input
                id="pin-hanja"
                type="text"
                value={hanja}
                onChange={(e) => setHanja(e.target.value)}
                placeholder="예: 血敎"
                className="w-full panel-surface border rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="pin-faction" className="block text-xs font-medium mb-1">
                세력 구분
              </label>
              <select
                id="pin-faction"
                value={faction}
                onChange={(e) => setFaction(e.target.value as FactionKey)}
                className="w-full panel-surface border rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                {FACTION_KEYS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pin-region" className="block text-xs font-medium mb-1">
                지역명
              </label>
              <input
                id="pin-region"
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="예: 섬서성 진령산맥"
                className="w-full panel-surface border rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pin-arts" className="block text-xs font-medium mb-1">
              대표 무공 / 메모
            </label>
            <input
              id="pin-arts"
              type="text"
              value={arts}
              onChange={(e) => setArts(e.target.value)}
              placeholder="예: 혈마신공, 소설 2권 결전지"
              className="w-full panel-surface border rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="panel-surface border rounded-lg px-4 py-2 text-sm font-medium cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white cursor-pointer"
              style={{ background: 'var(--accent)' }}
            >
              지도에 추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
