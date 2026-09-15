import assert from "node:assert/strict";
import test from "node:test";
import { earthquakeRateFor, isEarthquakeDwelling } from "../src/earthquakeRate.js";

test("only Rumah Tinggal occupation code 2976 is treated as dwelling", () => {
  assert.equal(isEarthquakeDwelling("rumah_tinggal"), true);
  assert.equal(isEarthquakeDwelling("apartemen_6"), false);
  assert.equal(isEarthquakeDwelling("apartemen_6_18"), false);
  assert.equal(isEarthquakeDwelling("apartemen_18"), false);
  assert.equal(isEarthquakeDwelling("apartemen_24_plus"), false);
  assert.equal(isEarthquakeDwelling("ruko"), false);
  assert.equal(isEarthquakeDwelling("rukan"), false);
});

test("non-dwelling earthquake rate is selected from the number of floors", () => {
  assert.deepEqual(earthquakeRateFor({ occupancyKey: "apartemen_6", floorCount: 9, zone: 4 }), {
    rate: 1.43,
    floorBand: "le9",
  });
  assert.deepEqual(earthquakeRateFor({ occupancyKey: "apartemen_18", floorCount: 10, zone: 4 }), {
    rate: 1.53,
    floorBand: "gt9",
  });
});

test("Rumah Tinggal rate does not require a floor count", () => {
  assert.deepEqual(earthquakeRateFor({ occupancyKey: "rumah_tinggal", floorCount: "", zone: 5 }), {
    rate: 1.6,
    floorBand: "dwelling",
  });
});
