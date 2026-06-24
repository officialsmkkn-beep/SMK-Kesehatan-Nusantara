/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppSettings } from '../types';
import { 
  Settings, 
  RefreshCw, 
  AlertTriangle, 
  Check, 
  Sliders, 
  ShieldAlert, 
  Info,
  CalendarCheck2,
  Hourglass,
  Building,
  Upload
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetData: () => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  onResetData,
}: SettingsViewProps) {
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [passingGrade, setPassingGrade] = useState(settings.passingGrade);
  const [testDurationMinutes, setTestDurationMinutes] = useState(settings.testDurationMinutes);
  const [isOpen, setIsOpen] = useState(settings.isOpen);

  // School Identity states
  const [schoolAddress, setSchoolAddress] = useState(settings.schoolAddress || '');
  const [schoolWebsite, setSchoolWebsite] = useState(settings.schoolWebsite || '');
  const [schoolPrincipalName, setSchoolPrincipalName] = useState(settings.schoolPrincipalName || '');
  const [schoolPrincipalNip, setSchoolPrincipalNip] = useState(settings.schoolPrincipalNip || '');
  const [schoolYear, setSchoolYear] = useState(settings.schoolYear || '2026/2027');
  const [schoolLogoUrl, setSchoolLogoUrl] = useState(settings.schoolLogoUrl || '');

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      schoolName,
      passingGrade,
      testDurationMinutes,
      isOpen,
      schoolAddress,
      schoolWebsite,
      schoolPrincipalName,
      schoolPrincipalNip,
      schoolYear,
      schoolLogoUrl,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang database kembali ke draf awal (Seeded Data)? Semua calon siswa baru yang Anda buat dan hasil tes baru akan terhapus.')) {
      onResetData();
      alert('Sistem berhasil disetel ulang ke draf bawaan!');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6" id="settings-root">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pengaturan Sistem</h1>
        <p className="text-gray-500 text-sm">Konfigurasi parameter pendaftaran, batas kelulusan TPA, dan draf simulasi sistem.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Core Settings Form */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-150 p-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-5">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-3">
              <Sliders size={16} className="text-teal-600" />
              Parameter Utama Penerimaan
            </h3>

            {saved && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-xs flex items-center gap-2">
                <Check size={16} />
                <span>Pengaturan berhasil disimpan! Perubahan diterapkan ke seluruh portal.</span>
              </div>
            )}

            {/* School Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lembaga / Sekolah</label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Passing Grade */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Passing Grade Kelulusan (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={passingGrade}
                    onChange={(e) => setPassingGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">%</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Batas nilai minimum rekomendasi lulus seleksi.</p>
              </div>

              {/* Test Duration */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Durasi Waktu Ujian TPA</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    required
                    min={1}
                    value={testDurationMinutes}
                    onChange={(e) => setTestDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <span className="absolute right-3 text-xs text-gray-400 font-bold">Menit</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Batas waktu pengerjaan soal siswa.</p>
              </div>
            </div>

            {/* Identitas Sekolah */}
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-3 pt-2">
              <Building size={16} className="text-teal-600" />
              Identitas & Profil Lembaga
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Alamat Sekolah */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Sekolah</label>
                <input
                  type="text"
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  placeholder="Contoh: Jl. Raya Nusantara No. 123, Jakarta Pusat"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Website Sekolah */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Website Sekolah / Email</label>
                <input
                  type="text"
                  value={schoolWebsite}
                  onChange={(e) => setSchoolWebsite(e.target.value)}
                  placeholder="Contoh: www.smk-kesehatan-nusantara.sch.id"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Tahun Pelajaran */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tahun Pelajaran</label>
                <input
                  type="text"
                  value={schoolYear}
                  onChange={(e) => setSchoolYear(e.target.value)}
                  placeholder="Contoh: 2026/2027"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Nama Kepala Sekolah / Ketua Panitia */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Ketua Panitia / Kepala Sekolah</label>
                <input
                  type="text"
                  value={schoolPrincipalName}
                  onChange={(e) => setSchoolPrincipalName(e.target.value)}
                  placeholder="Contoh: Dr. apt. Rian H., M.Si"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* NIP Kepala Sekolah / Ketua Panitia */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">NIP Ketua Panitia / Kepala Sekolah</label>
                <input
                  type="text"
                  value={schoolPrincipalNip}
                  onChange={(e) => setSchoolPrincipalNip(e.target.value)}
                  placeholder="Contoh: 19880402 201503 1 002"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Logo Sekolah */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Logo Sekolah</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="h-16 w-16 rounded-xl bg-white border border-gray-250 flex items-center justify-center font-bold overflow-hidden shadow-inner shrink-0">
                    {schoolLogoUrl ? (
                      <img src={schoolLogoUrl} alt="Logo Sekolah" className="h-full w-full object-contain p-1" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold text-center leading-tight">BELUM ADA LOGO</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1 w-full text-center sm:text-left">
                    <p className="text-[10px] text-gray-500">Akan dicetak di bagian atas Kartu Peserta TPA.</p>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <label className="bg-white border border-gray-200 hover:border-teal-500 hover:text-teal-600 px-3 py-1.5 rounded-lg shadow-sm text-[11px] font-bold text-gray-700 cursor-pointer transition flex items-center gap-1">
                        <Upload size={12} />
                        Unggah Gambar Logo...
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  setSchoolLogoUrl(ev.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      {schoolLogoUrl && (
                        <button
                          type="button"
                          onClick={() => setSchoolLogoUrl('')}
                          className="bg-white border border-rose-250 hover:border-rose-500 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg shadow-sm text-[11px] font-bold transition"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Close Session toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-150">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-gray-800 block">Sesi Ujian TPA Calon Siswa Baru</span>
                <span className="text-[11px] text-gray-500">Jika ditutup, calon siswa tidak dapat melaksanakan ujian.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isOpen} 
                  onChange={(e) => setIsOpen(e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition"
            >
              Simpan Konfigurasi
            </button>
          </form>
        </div>

        {/* Database & System Tools sidebar */}
        <div className="space-y-6">
          
          {/* Reset Box */}
          <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-3">
              <ShieldAlert size={16} />
              Zona Berbahaya
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Jika Anda sedang melakukan pengujian sistem dan ingin mengembalikan semua data ke draf awal (termasuk soal default dan siswa contoh), Anda dapat menggunakan tombol di bawah ini.
            </p>
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 font-bold px-4 py-2.5 rounded-xl text-xs transition active:scale-95"
            >
              <RefreshCw size={13} />
              Setel Ulang Simulasi Database
            </button>
          </div>

          {/* Algorithm Info */}
          <div className="bg-teal-50/20 border border-teal-150 rounded-xl p-5 space-y-3 text-xs leading-relaxed">
            <h4 className="font-bold text-teal-900 uppercase flex items-center gap-1">
              <Info size={14} />
              Kebijakan Seleksi Otomatis
            </h4>
            <p className="text-gray-700">
              Sistem TPA SMK Kesehatan Nusantara diatur secara otomatis:
            </p>
            <ul className="list-disc pl-4 text-gray-600 space-y-1.5">
              <li>Masing-masing calon siswa hanya diuji pada 2 paket jurusan yang mereka pilih secara khusus.</li>
              <li>Sistem akan menyatukan soal-soal jurusan Pilihan 1 dan Pilihan 2 ke dalam satu lembar jawaban ujian siswa.</li>
              <li>Hasil tes langsung dianalisis seketika saat dikirimkan. Jurusan dengan perolehan persentase tertinggi otomatis terpilih sebagai program studi rekomendasi definitif.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
