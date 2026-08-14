"""Generate the local postal-code to OJK earthquake-zone reference data."""

from __future__ import annotations

import difflib
import json
import re
import unicodedata
import urllib.request
from pathlib import Path

import pdfplumber


ROOT = Path(__file__).resolve().parents[1]
OJK_PDF = ROOT / "tmp" / "earthquake-postal" / "ojk-zona-gempa.pdf"
OUTPUT = ROOT / "src" / "data" / "earthquakePostalRegions.js"
POSTAL_SOURCE = (
    "https://raw.githubusercontent.com/erlange/"
    "Kodepos-Wilayah-Indonesia/master/json/kodepos.simple.json"
)


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    value = value.upper().replace("\n", " ")
    value = re.sub(r"\b(KABUPATEN|KAB\.?|KOTA ADMINISTRASI|KOTA)\b", "", value)
    value = re.sub(r"[^A-Z0-9]+", " ", value)
    return " ".join(value.split())


def region_type(value: str) -> str:
    lowered = value.strip().lower()
    return "city" if re.search(r"\bkota\b", lowered) or lowered.endswith(", kota") else "regency"


def extract_ojk_zones() -> list[dict]:
    rows = []
    with pdfplumber.open(OJK_PDF) as pdf:
        for page in pdf.pages[6:18]:
            for table in page.extract_tables():
                for row in table:
                    if len(row) < 4 or not str(row[0] or "").isdigit():
                        continue
                    rows.append(
                        {
                            "number": int(row[0]),
                            "province": " ".join((row[1] or "").split()),
                            "region": " ".join((row[2] or "").split()),
                            "zone": int(row[3]),
                        }
                    )
    if len(rows) != 511:
        raise RuntimeError(f"Expected 511 OJK region rows, received {len(rows)}")
    return rows


def load_postal_regions() -> list[dict]:
    with urllib.request.urlopen(POSTAL_SOURCE) as response:
        data = json.load(response)

    regions = []
    for province, cities in data.items():
        for region, districts in cities.items():
            postal_codes = sorted(
                {
                    str(postal_code)
                    for villages in districts.values()
                    for postal_code in villages.values()
                    if str(postal_code).isdigit() and len(str(postal_code)) == 5
                }
            )
            regions.append(
                {
                    "province": province,
                    "region": region,
                    "type": region_type(region),
                    "normalized": normalize(region),
                    "postalCodes": postal_codes,
                }
            )
    return regions


def attach_zones(postal_regions: list[dict], ojk_rows: list[dict]) -> None:
    used = set()
    for ojk in ojk_rows:
        candidates = []
        for index, region in enumerate(postal_regions):
            if region["type"] != region_type(ojk["region"]):
                continue
            score = difflib.SequenceMatcher(None, normalize(ojk["region"]), region["normalized"]).ratio()
            candidates.append((score, index, region))
        score, index, region = max(candidates, key=lambda item: item[0])
        if score < 0.72:
            # The OJK table uses the former name Kabupaten Selayar.
            if normalize(ojk["region"]) == "SELAYAR":
                region = next(item for item in postal_regions if item["normalized"] == "KEPULAUAN SELAYAR")
                index = postal_regions.index(region)
            else:
                raise RuntimeError(f"Unmatched OJK region: {ojk}")
        if index in used:
            raise RuntimeError(f"Duplicate postal region match for {ojk}")
        region["zone"] = ojk["zone"]
        used.add(index)

    # These three regencies were created from the listed parent regions. The
    # 2017 OJK table does not list them separately, so they inherit the parent
    # region's earthquake zone.
    inherited = {
        "MUNA BARAT": 2,
        "BUTON TENGAH": 3,
        "BUTON SELATAN": 3,
    }
    for region in postal_regions:
        if "zone" not in region:
            if region["normalized"] not in inherited:
                raise RuntimeError(f"Postal region has no OJK zone: {region['region']}")
            region["zone"] = inherited[region["normalized"]]


def write_module(regions: list[dict]) -> None:
    compact = [
        {
            "province": region["province"],
            "region": region["region"],
            "zone": region["zone"],
            "postalCodes": region["postalCodes"],
        }
        for region in sorted(regions, key=lambda item: (item["province"], item["region"]))
    ]
    payload = json.dumps(compact, ensure_ascii=False, separators=(",", ":"))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        "// Generated from OJK SEOJK 6/2017 Table III.D and the Indonesian postal-code dataset.\n"
        "// Do not edit by hand; run scripts/generate-earthquake-postal-data.py.\n"
        f"export const EARTHQUAKE_POSTAL_REGIONS = {payload};\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    postal_regions = load_postal_regions()
    attach_zones(postal_regions, extract_ojk_zones())
    write_module(postal_regions)
    print(
        f"Generated {OUTPUT.relative_to(ROOT)} with {len(postal_regions)} regions and "
        f"{len({code for region in postal_regions for code in region['postalCodes']})} unique postal codes."
    )
