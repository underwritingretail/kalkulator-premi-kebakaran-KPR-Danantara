import { EARTHQUAKE_POSTAL_REGIONS } from "./data/earthquakePostalRegions.js";

const postalZoneIndex = new Map();

for (const region of EARTHQUAKE_POSTAL_REGIONS) {
  const candidate = {
    key: `${region.province}|${region.region}`,
    province: region.province,
    region: region.region,
    zone: region.zone,
  };
  for (const postalCode of region.postalCodes) {
    const candidates = postalZoneIndex.get(postalCode) || [];
    candidates.push(candidate);
    postalZoneIndex.set(postalCode, candidates);
  }
}

export function formatAdministrativeRegion(region) {
  const [name, type] = String(region || "").split(",").map((part) => part.trim());
  if (!type) return name;
  return `${type} ${name}`;
}

export function resolveEarthquakePostalCode(value, selectedRegionKey = "") {
  const postalCode = String(value || "").replace(/\D/g, "").slice(0, 5);
  if (!postalCode) return { status: "empty", postalCode, candidates: [] };
  if (postalCode.length < 5) return { status: "incomplete", postalCode, candidates: [] };

  const candidates = postalZoneIndex.get(postalCode) || [];
  if (!candidates.length) return { status: "not-found", postalCode, candidates: [] };

  const selected = candidates.find((candidate) => candidate.key === selectedRegionKey);
  if (selected) {
    return {
      status: "resolved",
      postalCode,
      zone: selected.zone,
      location: selected,
      locationLabel: `${formatAdministrativeRegion(selected.region)}, ${selected.province}`,
      candidates,
    };
  }

  const zones = new Set(candidates.map((candidate) => candidate.zone));
  if (zones.size > 1) return { status: "ambiguous", postalCode, candidates };

  const locationLabel = candidates
    .map((candidate) => `${formatAdministrativeRegion(candidate.region)}, ${candidate.province}`)
    .join(" / ");
  return {
    status: "resolved",
    postalCode,
    zone: candidates[0].zone,
    location: candidates[0],
    locationLabel,
    candidates,
  };
}
