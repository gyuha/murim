import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, Search, X } from 'lucide-react';
import {
  GLOSSARY_BY_ID,
  GLOSSARY_CATEGORIES,
  GLOSSARY_CATEGORY_META,
  GLOSSARY_IMAGES,
  MURIM_GLOSSARY,
} from '../data/murimGlossary';
import type { GlossaryCategory } from '../types/glossary';
import { GlossaryText } from './GlossaryText';

interface GlossaryModalProps {
  open: boolean;
  selectedTermId: string | null;
  onSelectTerm: (termId: string | null) => void;
  onClose: () => void;
}

export function GlossaryModal({
  open,
  selectedTermId,
  onSelectTerm,
  onClose,
}: GlossaryModalProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | '전체'>('전체');

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MURIM_GLOSSARY.filter((entry) => {
      if (activeCategory !== '전체' && entry.category !== activeCategory) return false;
      if (!q) return true;
      return (
        entry.term.toLowerCase().includes(q) ||
        entry.hanja.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory]);

  if (!open) return null;

  const selectedEntry = selectedTermId ? GLOSSARY_BY_ID[selectedTermId] : null;
  const selectedCatMeta = selectedEntry
    ? GLOSSARY_CATEGORY_META[selectedEntry.category]
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/55 flex items-center justify-center p-3 sm:p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="무림 용어 사전"
    >
      <div
        className="card-surface border rounded-2xl w-full max-w-3xl h-[82vh] max-h-[680px] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="px-5 py-3.5 border-b flex items-center justify-between gap-3 shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
              style={{ background: 'var(--jade)' }}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif-kr font-bold text-base sm:text-lg leading-tight truncate">
                무림 용어 사전{' '}
                <span className="text-xs font-normal opacity-65">
                  ({MURIM_GLOSSARY.length}개 수록)
                </span>
              </h2>
              <p className="text-[11px] truncate" style={{ color: 'var(--text-mute)' }}>
                용어를 클릭하면 상세 해설과 연관 무림 용어를 바로 확인할 수 있습니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="opacity-60 hover:opacity-100 p-1 cursor-pointer"
            aria-label="사전 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div
          className="px-4 py-3 border-b space-y-2.5 shrink-0 panel-surface"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="무림 용어, 한자, 해설 검색..."
              className="w-full card-surface border rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(['전체', ...GLOSSARY_CATEGORIES] as const).map((cat) => {
              const isActive = activeCategory === cat;
              const catColor =
                cat === '전체' ? 'var(--accent)' : GLOSSARY_CATEGORY_META[cat].color;
              const catBg =
                cat === '전체' ? 'var(--accent-soft)' : GLOSSARY_CATEGORY_META[cat].bg;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold border transition cursor-pointer"
                  style={{
                    borderColor: isActive ? catColor : 'var(--border)',
                    background: isActive ? catBg : 'transparent',
                    color: isActive ? catColor : 'var(--text-mute)',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body: List + Detail Split View */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left: Term List */}
          <div
            className={`w-full md:w-[270px] border-r overflow-y-auto custom-scroll p-2.5 space-y-1 shrink-0 ${
              selectedEntry ? 'hidden md:block' : 'block'
            }`}
            style={{ borderColor: 'var(--border)' }}
          >
            {filteredEntries.length === 0 ? (
              <div className="p-6 text-center text-xs" style={{ color: 'var(--text-mute)' }}>
                검색 조건에 맞는 무림 용어가 없습니다.
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const isSelected = entry.id === selectedEntry?.id;
                const meta = GLOSSARY_CATEGORY_META[entry.category];
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => onSelectTerm(entry.id)}
                    className="w-full text-left px-3 py-2 rounded-lg border transition cursor-pointer"
                    style={{
                      borderColor: isSelected ? meta.color : 'transparent',
                      background: isSelected ? meta.bg : 'transparent',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="text-sm font-semibold truncate">{entry.term}</span>
                        <span
                          className="text-[11px] font-serif-kr shrink-0"
                          style={{ color: 'var(--text-mute)' }}
                        >
                          {entry.hanja}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0"
                        style={{ background: meta.bg, color: meta.color }}
                      >
                        {entry.category.split('·')[0]}
                      </span>
                    </div>
                    <p
                      className="text-[11px] truncate mt-0.5"
                      style={{ color: 'var(--text-mute)' }}
                    >
                      {entry.summary}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          {/* Right: Selected Term Detail */}
          <div
            className={`flex-1 overflow-y-auto custom-scroll p-5 ${
              selectedEntry ? 'block' : 'hidden md:flex md:items-center md:justify-center'
            }`}
          >
            {!selectedEntry || !selectedCatMeta ? (
              <div className="text-center max-w-xs space-y-2">
                <BookOpen
                  className="w-9 h-9 mx-auto opacity-30"
                  style={{ color: 'var(--text-mute)' }}
                />
                <p className="text-sm font-semibold">무림 용어를 선택해 주세요</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-mute)' }}>
                  왼쪽 목록에서 궁금한 용어를 클릭하면 한자 표기, 상세 해설, 관련 무림 용어를
                  확인할 수 있습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => onSelectTerm(null)}
                  className="md:hidden inline-flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  style={{ color: 'var(--accent)' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>용어 목록으로</span>
                </button>

                <div
                  className="pb-3.5 border-b space-y-2"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <h3 className="font-serif-kr font-black text-2xl leading-tight">
                        {selectedEntry.term}
                      </h3>
                      <span
                        className="font-serif-kr text-base"
                        style={{ color: 'var(--text-mute)' }}
                      >
                        {selectedEntry.hanja}
                      </span>
                    </div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: selectedCatMeta.bg,
                        color: selectedCatMeta.color,
                      }}
                    >
                      {selectedEntry.category}
                    </span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-sub)' }}>
                    {selectedEntry.summary}
                  </p>
                </div>

                {GLOSSARY_IMAGES[selectedEntry.id] && (
                  <figure
                    className="rounded-xl overflow-hidden border panel-surface"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <img
                      src={GLOSSARY_IMAGES[selectedEntry.id]}
                      alt={`${selectedEntry.term} (${selectedEntry.hanja}) 수묵 일러스트`}
                      width={640}
                      height={480}
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover block"
                    />
                  </figure>
                )}

                <div className="space-y-2">
                  <h4
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--text-mute)' }}
                  >
                    상세 해설
                  </h4>
                  <p
                    className="text-sm leading-7"
                    style={{ color: 'var(--text-main)' }}
                  >
                    <GlossaryText
                      text={selectedEntry.description}
                      onSelectTerm={onSelectTerm}
                      excludeTermId={selectedEntry.id}
                    />
                  </p>
                </div>

                {selectedEntry.relatedIds.length > 0 && (
                  <div
                    className="pt-3.5 border-t space-y-2"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <h4
                      className="text-xs font-semibold"
                      style={{ color: 'var(--text-mute)' }}
                    >
                      관련 무림 용어
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEntry.relatedIds.map((relId) => {
                        const rel = GLOSSARY_BY_ID[relId];
                        if (!rel) return null;
                        const relMeta = GLOSSARY_CATEGORY_META[rel.category];
                        return (
                          <button
                            key={rel.id}
                            type="button"
                            onClick={() => onSelectTerm(rel.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold border transition hover:opacity-85 cursor-pointer flex items-center gap-1"
                            style={{
                              borderColor: relMeta.color,
                              background: relMeta.bg,
                              color: relMeta.color,
                            }}
                          >
                            <span>{rel.term}</span>
                            <span className="opacity-70 font-serif-kr">{rel.hanja}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
