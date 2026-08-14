import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import { MapPin, Search, X } from "lucide-react";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [-6.2, 106.816666];
const DEFAULT_ZOOM = 12;
const DEVICE_ZOOM = 15;

export function RiskAddressMapPicker({ onClose, onSelect }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const requestControllerRef = useRef(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [mapError, setMapError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const placeMarker = (latlng) => {
    const map = mapRef.current;
    if (!map) return;
    if (markerRef.current) markerRef.current.setLatLng(latlng);
    else {
      markerRef.current = L.circleMarker(latlng, {
        radius: 8,
        color: "#ffffff",
        weight: 3,
        fillColor: "#0d7db6",
        fillOpacity: 1,
      }).addTo(map);
    }
  };

  const resolveAddress = async (latlng) => {
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setSelectedAddress("");
    setMapError("");
    setIsResolving(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1&accept-language=id`,
        { signal: controller.signal },
      );
      if (!response.ok) throw new Error("Alamat tidak dapat dimuat.");
      const result = await response.json();
      if (!result.display_name) throw new Error("Alamat tidak ditemukan pada titik tersebut.");
      setSelectedAddress(result.display_name);
    } catch (error) {
      if (error.name !== "AbortError") setMapError(error.message || "Alamat tidak dapat dimuat.");
    } finally {
      if (!controller.signal.aborted) setIsResolving(false);
    }
  };

  const selectPoint = async (latlng) => {
    placeMarker(latlng);
    await resolveAddress(latlng);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return undefined;

    const map = L.map(mapContainerRef.current, { zoomControl: true }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const handleMapClick = ({ latlng }) => selectPoint(latlng);
    map.on("click", handleMapClick);
    window.setTimeout(() => map.invalidateSize(), 0);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => map.setView([coords.latitude, coords.longitude], DEVICE_ZOOM),
        () => {},
        { enableHighAccuracy: false, timeout: 8_000, maximumAge: 300_000 },
      );
    }

    return () => {
      requestControllerRef.current?.abort();
      map.off("click", handleMapClick);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  const searchLocation = async (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=id&addressdetails=1&accept-language=id&q=${encodeURIComponent(query)}`,
      );
      if (!response.ok) throw new Error("Lokasi tidak dapat dicari.");
      const results = await response.json();
      if (!results.length) setSearchError("Lokasi tidak ditemukan. Coba gunakan kata kunci yang lebih lengkap.");
      else setSearchResults(results);
    } catch (error) {
      setSearchError(error.message || "Lokasi tidak dapat dicari.");
    } finally {
      setIsSearching(false);
    }
  };

  const chooseSearchResult = async (result) => {
    const latlng = L.latLng(Number(result.lat), Number(result.lon));
    mapRef.current?.setView(latlng, DEVICE_ZOOM);
    setSearchResults([]);
    await selectPoint(latlng);
  };

  return (
    <div className="map-picker-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="map-picker-modal" role="dialog" aria-modal="true" aria-labelledby="map-picker-title">
        <header className="map-picker-header">
          <div>
            <h2 id="map-picker-title">Pilih Alamat Risiko dari Map</h2>
            <p>Cari lokasi atau klik titik objek pertanggungan pada peta.</p>
          </div>
          <button className="map-picker-close" type="button" aria-label="Tutup peta" onClick={onClose}><X size={20} aria-hidden="true" /></button>
        </header>
        <form className="map-picker-search" onSubmit={searchLocation}>
          <Search size={18} aria-hidden="true" />
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Cari alamat, kelurahan, kecamatan, atau kota" aria-label="Cari lokasi" />
          <button type="submit" disabled={!searchQuery.trim() || isSearching}>{isSearching ? "Mencari..." : "Cari"}</button>
        </form>
        {searchResults.length ? <div className="map-picker-search-results" role="listbox" aria-label="Hasil pencarian lokasi">
          {searchResults.map((result) => <button type="button" role="option" key={result.place_id} onClick={() => chooseSearchResult(result)}>{result.display_name}</button>)}
        </div> : null}
        {searchError ? <p className="map-picker-search-error" role="status">{searchError}</p> : null}
        <div className="map-picker-canvas" ref={mapContainerRef} aria-label="Peta pemilihan alamat risiko" />
        <div className={`map-picker-selection ${selectedAddress ? "is-ready" : ""}`} aria-live="polite">
          <MapPin size={19} aria-hidden="true" />
          <div>
            <strong>Alamat terpilih</strong>
            <p>{isResolving ? "Mencari alamat..." : selectedAddress || mapError || "Belum ada lokasi yang dipilih."}</p>
          </div>
        </div>
        <footer className="map-picker-actions">
          <button className="button button--secondary" type="button" onClick={onClose}>Batal</button>
          <button className="button button--primary" type="button" disabled={!selectedAddress || isResolving} onClick={() => onSelect(selectedAddress)}><MapPin size={17} aria-hidden="true" />Gunakan Alamat</button>
        </footer>
      </section>
    </div>
  );
}
