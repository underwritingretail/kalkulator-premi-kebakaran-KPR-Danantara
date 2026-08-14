# Design QA - Pemilihan Alamat Risiko dari Map

## Comparison target

- Source visual truth: `C:\Users\2849\AppData\Local\Temp\codex-clipboard-080a49b7-8507-4e1d-b926-eed95be89d8c.png` (1275 x 118 px), yaitu tampilan field Alamat Risiko sebelum penambahan aksi peta.
- Local implementation: `http://127.0.0.1:5173/` pada Codex in-app browser.
- Focused implementation evidence: `tmp/qa-risk-address-field.png` (809 x 84 px).
- Desktop modal evidence: `tmp/qa-risk-address-map-modal.png` (1280 x 720 px).
- Mobile modal evidence: `tmp/qa-risk-address-map-mobile.png` (390 x 844 px).
- Combined comparison evidence: `tmp/qa-map-comparison.png` (1280 x 1055 px).
- Desktop viewport: 1280 x 720 CSS px, device pixel ratio 1.
- Mobile viewport: 390 x 844 CSS px, device pixel ratio 1.
- Compared state: field berisi alamat hasil reverse geocoding; modal berada pada keadaan awal sebelum titik dipilih.
- Density normalization: semua bukti browser direkam pada DPR 1. Referensi adalah crop komponen, sehingga focused comparison menilai tipografi, warna, border, radius, ikon, dan ritme internal; perbedaan lebar berasal dari ruang yang sengaja dialokasikan untuk tombol baru.

## Full-view and focused evidence

Full-view desktop memperlihatkan modal peta di dalam halaman kalkulator sebenarnya, termasuk overlay, judul, peta, status alamat, dan tombol aksi. Focused comparison menyandingkan field lama dengan field baru dalam satu gambar. Field input mempertahankan gaya sebelumnya dan tombol `Pilih dari Map` memakai token warna, radius, tinggi, dan ikon yang konsisten.

Focused region cukup untuk menilai field karena referensi hanya berisi crop field Alamat Risiko. Modal dinilai melalui full-view desktop dan mobile karena tidak ada modal pada referensi lama.

## Required fidelity surfaces

### Fonts and typography

Passed. Font sistem, bobot label, ukuran input, hierarki judul modal, line-height, dan pembungkusan alamat konsisten dengan komponen formulir yang sudah ada. Teks tombol tetap terbaca pada desktop dan mobile.

### Spacing and layout rhythm

Passed. Tinggi input dan tombol sejajar pada desktop. Gap 10 px, radius 8 px, padding modal, dan jarak antarbagian mengikuti ritme form. Pada viewport 390 x 844, kontrol field berubah menjadi satu kolom dan semua aksi modal tetap terlihat tanpa terpotong.

### Colors and visual tokens

Passed. Tombol sekunder memakai biru muda yang sudah digunakan aplikasi, tombol utama memakai oranye, overlay memakai navy transparan, dan status alamat memakai latar netral/hijau sesuai keadaan.

### Image quality and asset fidelity

Passed. Peta memakai tile raster OpenStreetMap pada resolusi asli dan tetap tajam. Ikon berasal dari pustaka Lucide proyek; tidak ada emoji, placeholder, SVG buatan tangan, atau CSS art.

### Copy and content

Passed. Label `Alamat Risiko` tetap dipertahankan. Copy baru singkat dan langsung: `Pilih dari Map`, `Klik titik lokasi objek pertanggungan pada peta`, `Alamat terpilih`, dan `Gunakan Alamat`.

## Interaction and runtime checks

- Tombol `Pilih dari Map` membuka dialog.
- Klik pada peta menempatkan titik dan mengambil alamat dari OpenStreetMap Nominatim.
- Tombol `Gunakan Alamat` aktif setelah alamat tersedia.
- Konfirmasi menutup modal dan mengisi field Alamat Risiko dengan hasil yang sama.
- Field masih dapat diketik manual.
- Keadaan desktop dan mobile diperiksa; tombol tutup, batal, dan konfirmasi tetap tersedia.
- Tidak ada error browser selama render, pemilihan titik, reverse geocoding, atau konfirmasi.
- Production build berhasil.

## Findings

Tidak ada temuan P0, P1, atau P2. Ketergantungan pada koneksi internet/OpenStreetMap adalah batas operasional yang dapat diterima karena input manual tetap tersedia sebagai fallback.

## Comparison history

- Pass pertama: field baru mempertahankan gaya sumber dan modal mengikuti design system kalkulator.
- Tidak ada perbaikan visual P0/P1/P2 yang diperlukan setelah perbandingan gabungan.
- Uji responsif tambahan memastikan modal tetap utuh pada viewport 390 x 844.

## Implementation checklist

- [x] Field Alamat Risiko tetap editable.
- [x] Aksi Pilih dari Map tersedia di samping field pada desktop.
- [x] Modal OpenStreetMap dapat dibuka dan ditutup.
- [x] Klik peta menghasilkan alamat.
- [x] Alamat hanya diterapkan setelah konfirmasi.
- [x] Layout mobile tetap dapat digunakan.
- [x] Build dan browser verification berhasil tanpa error.

final result: passed
