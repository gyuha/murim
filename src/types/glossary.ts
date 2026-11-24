export type GlossaryCategory = '세력·조직' | '무공·경지' | '지리·강호' | '인물·호칭';

export interface GlossaryEntry {
  id: string;
  term: string;
  hanja: string;
  category: GlossaryCategory;
  summary: string;
  description: string;
  relatedIds: string[];
  aliases?: string[];
}
