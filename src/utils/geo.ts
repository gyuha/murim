import type { MurimLocation } from '../types/murim';

export function haversineKm(c1: [number, number], c2: [number, number]): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(c2[1] - c1[1]);
  const dLon = toRad(c2[0] - c1[0]);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(c1[1])) * Math.cos(toRad(c2[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function buildGeoJSON(locations: MurimLocation[]): string {
  return JSON.stringify(
    {
      type: 'FeatureCollection',
      features: locations.map((loc) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: loc.coords },
        properties: {
          id: loc.id,
          name_ko: loc.name,
          name_hanja: loc.hanja || '',
          faction: loc.faction,
          group: loc.group || loc.faction,
          region: loc.region,
          signature_arts: loc.arts,
          description: loc.desc,
        },
      })),
    },
    null,
    2,
  );
}
