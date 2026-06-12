import glossaryData from "@content/glossary.json";

export type GlossaryTerm = {
  term: string;
  short: string;
  introducedIn: string;
  status?: string;
};

export const glossaryTerms = (glossaryData.terms as GlossaryTerm[])
  .slice()
  .sort((a, b) => a.term.localeCompare(b.term));

// Index by full name plus any parenthetical abbreviation, lowercased.
const index = new Map<string, GlossaryTerm>();
for (const t of glossaryTerms) {
  index.set(t.term.toLowerCase(), t);
  const match = t.term.match(/\(([^)]+)\)/);
  if (match) {
    index.set(match[1].toLowerCase(), t);
    index.set(t.term.replace(/\s*\([^)]*\)/, "").trim().toLowerCase(), t);
  }
}

/** Look up a glossary term by name or abbreviation (case-insensitive). */
export function findTerm(name: string): GlossaryTerm | undefined {
  return index.get(name.trim().toLowerCase());
}
