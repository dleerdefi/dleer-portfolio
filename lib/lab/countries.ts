// Country names come from the browser's Intl.DisplayNames: no data file, no fetch.

let names: Intl.DisplayNames | null | undefined;

export function countryName(cc: string | null): string {
  if (cc === null) return 'unknown country';
  if (names === undefined) {
    try {
      names = new Intl.DisplayNames(['en'], { type: 'region' });
    } catch {
      names = null;
    }
  }
  try {
    return names?.of(cc) ?? cc;
  } catch {
    return cc;
  }
}
