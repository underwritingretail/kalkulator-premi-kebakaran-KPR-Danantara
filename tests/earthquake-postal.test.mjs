import assert from "node:assert/strict";
import test from "node:test";
import { resolveEarthquakePostalCode } from "../src/earthquakePostal.js";

test("resolves postal codes to their OJK earthquake zone and city or regency", () => {
  const jakarta = resolveEarthquakePostalCode("10310");
  assert.equal(jakarta.status, "resolved");
  assert.equal(jakarta.zone, 4);
  assert.match(jakarta.locationLabel, /Kota Jakarta Pusat/);

  const bandung = resolveEarthquakePostalCode("40154");
  assert.equal(bandung.zone, 5);
  assert.match(bandung.locationLabel, /Kota Bandung/);

  const badung = resolveEarthquakePostalCode("80361");
  assert.equal(badung.zone, 4);
  assert.match(badung.locationLabel, /Kabupaten Badung/);
});

test("requires a region choice when one postal code spans different zones", () => {
  const unresolved = resolveEarthquakePostalCode("40191");
  assert.equal(unresolved.status, "ambiguous");
  assert.deepEqual(new Set(unresolved.candidates.map((item) => item.zone)), new Set([4, 5]));

  const selected = resolveEarthquakePostalCode("40191", unresolved.candidates[0].key);
  assert.equal(selected.status, "resolved");
  assert.equal(selected.zone, unresolved.candidates[0].zone);
});

test("rejects incomplete and unknown postal codes", () => {
  assert.equal(resolveEarthquakePostalCode("103").status, "incomplete");
  assert.equal(resolveEarthquakePostalCode("00000").status, "not-found");
});
