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

## Pemeriksaan

```bash
pnpm run build
pnpm run test:sites
```

## Catatan

Perhitungan pada microsite bersifat simulasi indikatif. Pengikatan dan premi akhir mengikuti proses underwriting serta ketentuan yang berlaku.
