const EARTHQUAKE_RATES = {
  dwelling: [0.76, 0.79, 1.04, 1.35, 1.6],
  commercial: {
    le9: [0.75, 0.76, 1, 1.43, 1.9],
    gt9: [1.12, 1.15, 1.22, 1.53, 2],
  },
};

export const DWELLING_OCCUPANCY_CODE_2976 = "rumah_tinggal";

export function isEarthquakeDwelling(occupancyKey) {
  return occupancyKey === DWELLING_OCCUPANCY_CODE_2976;
}

export function earthquakeRateFor({ occupancyKey, floorCount, zone }) {
  const zoneIndex = Number(zone) - 1;
  if (zoneIndex < 0 || zoneIndex > 4) return { rate: 0, floorBand: "" };

  if (isEarthquakeDwelling(occupancyKey)) {
    return { rate: EARTHQUAKE_RATES.dwelling[zoneIndex], floorBand: "dwelling" };
  }

  const floors = Number(floorCount);
  if (!Number.isInteger(floors) || floors < 1) return { rate: 0, floorBand: "" };
  const floorBand = floors <= 9 ? "le9" : "gt9";
  return { rate: EARTHQUAKE_RATES.commercial[floorBand][zoneIndex], floorBand };
}
