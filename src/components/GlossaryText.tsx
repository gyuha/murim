import { Fragment } from 'react';
import { GLOSSARY_MATCH_REGEX, resolveGlossaryId } from '../data/murimGlossary';

interface GlossaryTextProps {
  text: string;
  onSelectTerm: (termId: string) => void;
  excludeTermId?: string;
}

export function GlossaryText({ text, onSelectTerm, excludeTermId }: GlossaryTextProps) {
  if (!text) return null;

  const parts = text.split(GLOSSARY_MATCH_REGEX);

  return (
    <>
      {parts.map((part, idx) => {
        const termId = resolveGlossaryId(part);
        if (!termId || termId === excludeTermId) {
          return <Fragment key={idx}>{part}</Fragment>;
        }
        return (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectTerm(termId);
            }}
            title={`'${part}' 무림 사전 보기`}
            className="inline font-medium underline decoration-dotted underline-offset-2 transition-colors cursor-pointer hover:opacity-80"
            style={{
              color: 'var(--accent)',
              textDecorationColor: 'var(--accent)',
            }}
          >
            {part}
          </button>
        );
      })}
    </>
  );
}
