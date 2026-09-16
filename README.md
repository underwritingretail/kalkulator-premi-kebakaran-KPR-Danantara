# Kalkulator Premi Kebakaran KPR Danantara

Microsite mandiri untuk simulasi premi asuransi kebakaran. Tampilan memakai arah visual navy-oranye yang selaras dengan Asuransi Jasindo, tetapi aplikasinya tidak bergantung pada proyek Web Automation.

## Fitur

- Validasi data pemegang polis, tertanggung, risiko, periode, okupasi, kelas konstruksi, dan nilai pertanggungan.
- Tarif dasar untuk enam okupasi serta pilihan tarif OJK untuk konstruksi Kelas 2 dan 3.
- Perluasan Banjir, Gempa, RSMD, dan RSMDCC dengan field tarif kondisional.
- Ringkasan premi, detail penutupan, reset form, dan cetak/simpan sebagai PDF melalui dialog cetak browser.
- Layout responsif untuk desktop dan mobile.

## Menjalankan lokal

```bash
pnpm install
pnpm dev
```

## Menjalankan dengan Docker

Paket Docker menghasilkan build statis Vite dan menyajikannya melalui Nginx pada
port `8080`. Tidak ada variabel lingkungan atau database yang diperlukan.

```bash
docker compose up --build -d
```

Buka `http://localhost:8080`. Untuk menghentikannya:

```bash
docker compose down
```

Jika tim TI memakai proses build sendiri:

```bash
docker build -t kalkulator-premi-kebakaran:latest .
docker run --rm -p 8080:8080 kalkulator-premi-kebakaran:latest
```

Endpoint pemeriksaan kesehatan tersedia di `http://localhost:8080/health`.

## Image dari GitHub Container Registry

Setiap perubahan pada branch `main` membangun dan menerbitkan image Docker melalui
GitHub Actions. Setelah workflow selesai, image terbaru dapat dijalankan oleh tim TI:

```bash
docker pull ghcr.io/underwritingretail/kalkulator-premi-kebakaran:latest
docker run -d --name kalkulator-premi --restart unless-stopped -p 8080:8080 ghcr.io/underwritingretail/kalkulator-premi-kebakaran:latest
```

Untuk repository atau package privat, tim TI perlu login terlebih dahulu dengan
akun GitHub yang diberi akses package:

```bash
docker login ghcr.io
```

## Pemeriksaan

```bash
pnpm run build
pnpm run test:sites
```

## Catatan

Perhitungan pada microsite bersifat simulasi indikatif. Pengikatan dan premi akhir mengikuti proses underwriting serta ketentuan yang berlaku.
