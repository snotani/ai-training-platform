// Public-launch categorization. Region is a self-selected, globally meaningful
// grouping (replaces the old internal "department"). Stored on the profile as a
// stable slug; the display name is resolved from this list.

export type Region = { id: string; name: string };

export const REGIONS: Region[] = [
  { id: "north-america", name: "North America" },
  { id: "latin-america", name: "Latin America" },
  { id: "europe", name: "Europe" },
  { id: "africa", name: "Africa" },
  { id: "middle-east", name: "Middle East" },
  { id: "asia", name: "Asia" },
  { id: "oceania", name: "Oceania" },
];

const REGION_NAME = new Map(REGIONS.map((r) => [r.id, r.name]));

/** Resolve a region slug to its display name (null/unknown -> null). */
export function regionName(id: string | null | undefined): string | null {
  if (!id) return null;
  return REGION_NAME.get(id) ?? null;
}
