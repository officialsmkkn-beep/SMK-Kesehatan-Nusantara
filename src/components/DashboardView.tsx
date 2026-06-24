/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Role, SiswaProfile, TestResult, Question, AppSettings, MajorType } from '../types';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Award, 
  HeartPulse, 
  Pill, 
  Activity, 
  ArrowRight, 
  Play, 
  Info, 
  AlertTriangle,
  Building
} from 'lucide-react';

interface DashboardViewProps {
  role: Role;
  siswaProfiles: SiswaProfile[];
  testResults: TestResult[];
  questions: Question[];
  currentSiswa: SiswaProfile | null;
  onStartTest: () => void;
  settings: AppSettings;
}

export default function DashboardView({
  role,
  siswaProfiles,
  testResults,
  questions,
  currentSiswa,
  onStartTest,
  settings,
}: DashboardViewProps) {
  
  // Calculate statistics for Admin & Panitia
  const totalSiswa = siswaProfiles.length;
  const selesaiTes = siswaProfiles.filter(s => s.status === 'Selesai Tes').length;
  const belumTes = siswaProfiles.filter(s => s.status === 'Belum Tes').length;
  
  const avgScore = testResults.length > 0 
    ? Math.round(testResults.reduce((sum, r) => sum + (r.choice1Score + r.choice2Score) / 2, 0) / testResults.length)
    : 0;

  // Calculate major distributions (Choices 1 and 2 combined)
  const getMajorInterestCount = (major: MajorType) => {
    return siswaProfiles.filter(s => s.choice1 === major || s.choice2 === major).length;
  };

  const getMajorRecommendationCount = (major: MajorType) => {
    return testResults.filter(r => r.recommendedMajor === major).length;
  };

  const majors: MajorType[] = [
    'Layanan Kesehatan',
    'Teknik Farmasi',
    'Teknologi Laboratorium Medik'
  ];

  const studentResult = currentSiswa 
    ? testResults.find(r => r.siswaId === currentSiswa.id) 
    : null;

  if (role === 'SISWA' && currentSiswa) {
    return (
      <div className="space-y-6" id="dashboard-siswa-root">
        {/* Banner Selamat Datang */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 p-8 text-white shadow-lg">
          <div className="absolute right-0 top-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-white/10 blur-xl"></div>
          <div className="relative z-10 space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/30 px-3 py-1 text-xs font-semibold tracking-wider text-teal-100 backdrop-blur-md">
              <Building size={12} />
              SMK Kesehatan Nusantara
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Selamat Datang, {currentSiswa.name}!
            </h1>
            <p className="max-w-2xl text-teal-100 text-sm md:text-base">
              Anda terdaftar sebagai Calon Siswa Baru. Harap menyelesaikan Tes Potensi Akademik (TPA) online untuk menentukan kecocokan jurusan Anda.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Status Card */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Status Tes TPA</h3>
            <div className="flex items-center gap-3">
              {currentSiswa.status === 'Selesai Tes' ? (
                <>
                  <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-gray-900">Selesai Evaluasi</span>
                    <p className="text-xs text-gray-500">Hasil tes sudah terbit</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-amber-50 p-2 text-amber-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-gray-900">Belum Mengikuti Tes</span>
                    <p className="text-xs text-gray-500">Wajib mengikuti ujian</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Choice 1 */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Pilihan Jurusan 1</h3>
              <span className="text-lg font-bold text-gray-900 flex items-center gap-2 mt-2">
                {currentSiswa.choice1 === 'Layanan Kesehatan' && <HeartPulse className="text-rose-500" size={20} />}
                {currentSiswa.choice1 === 'Teknik Farmasi' && <Pill className="text-purple-500" size={20} />}
                {currentSiswa.choice1 === 'Teknologi Laboratorium Medik' && <Activity className="text-teal-500" size={20} />}
                {currentSiswa.choice1}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Prioritas Utama Pilihan Calon Siswa</p>
          </div>

          {/* Choice 2 */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Pilihan Jurusan 2</h3>
              <span className="text-lg font-bold text-gray-900 flex items-center gap-2 mt-2">
                {currentSiswa.choice2 === 'Layanan Kesehatan' && <HeartPulse className="text-rose-500" size={20} />}
                {currentSiswa.choice2 === 'Teknik Farmasi' && <Pill className="text-purple-500" size={20} />}
                {currentSiswa.choice2 === 'Teknologi Laboratorium Medik' && <Activity className="text-teal-500" size={20} />}
                {currentSiswa.choice2}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Prioritas Cadangan Pilihan Calon Siswa</p>
          </div>
        </div>

        {/* Instruksi Tes */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="text-teal-600" size={22} />
            Petunjuk & Tata Tertib Tes Potensi Akademik
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">1</span>
                Tes terdiri dari soal-soal kompetensi dasar yang mewakili <strong>kedua jurusan yang Anda pilih</strong> ({currentSiswa.choice1} & {currentSiswa.choice2}).
              </p>
              <p className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">2</span>
                Setiap bagian jurusan berisi soal-soal teoritis dasar dan keahlian untuk mendeteksi tingkat ketertarikan serta bakat alami Anda.
              </p>
              <p className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">3</span>
                Waktu pengerjaan tes dibatasi selama <strong>{settings.testDurationMinutes} menit</strong>. Timer berjalan otomatis begitu tes dimulai.
              </p>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">4</span>
                Sistem akan secara otomatis <strong>menganalisis dan merekomendasikan</strong> jurusan terbaik di antara kedua pilihan tersebut berdasarkan skor pencapaian tertinggi.
              </p>
              <p className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">5</span>
                Pastikan koneksi internet stabil dan selesaikan tes dalam satu sesi pengerjaan (jawaban tidak boleh dikosongkan).
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg text-xs font-medium">
              <AlertTriangle size={16} />
              <span>Tes hanya dapat dilakukan satu kali saja. Kerjakan dengan jujur!</span>
            </div>

            {currentSiswa.status === 'Belum Tes' ? (
              <button
                onClick={onStartTest}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-teal-600/15 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
                id="btn-start-test-siswa"
              >
                <Play size={16} fill="currentColor" />
                Mulai Tes TPA Sekarang
                <ArrowRight size={16} />
              </button>
            ) : (
              <div className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 size={18} />
                Anda telah menyelesaikan tes. Lihat menu &quot;Hasil Tes&quot;
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Admin & Panitia dashboard
  return (
    <div className="space-y-8" id="dashboard-admin-root">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Analitik</h1>
        <p className="text-gray-500 text-sm">Selamat bekerja, {role === 'ADMIN' ? 'Administrator' : 'Panitia PMB'}. Pantau perkembangan seleksi hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Siswa */}
        <div className="rounded-xl border border-gray-150 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Calon Siswa</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalSiswa}</h3>
            </div>
            <div className="rounded-lg bg-teal-50 p-3 text-teal-600">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Jumlah siswa baru terdaftar</p>
        </div>

        {/* Selesai Tes */}
        <div className="rounded-xl border border-gray-150 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selesai Tes</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{selesaiTes}</h3>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-3 font-medium flex items-center gap-1">
            {totalSiswa > 0 ? Math.round((selesaiTes / totalSiswa) * 100) : 0}% partisipasi
          </p>
        </div>

        {/* Belum Tes */}
        <div className="rounded-xl border border-gray-150 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Belum Tes</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{belumTes}</h3>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Menunggu jadwal pengerjaan</p>
        </div>

        {/* Rata-rata Skor */}
        <div className="rounded-xl border border-gray-150 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rata-rata Skor TPA</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{avgScore}%</h3>
            </div>
            <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
              <Award size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Nilai rata-rata seluruh pendaftar</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart 1: Minat Pilihan Jurusan */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">Minat Pilihan Calon Siswa (Pilihan 1 & 2)</h3>
          <div className="space-y-4">
            {majors.map((major) => {
              const count = getMajorInterestCount(major);
              const totalChoices = totalSiswa * 2;
              const percentage = totalChoices > 0 ? Math.round((count / totalChoices) * 100) : 0;
              return (
                <div key={major} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-gray-700 flex items-center gap-1.5">
                      {major === 'Layanan Kesehatan' && <HeartPulse size={14} className="text-rose-500" />}
                      {major === 'Teknik Farmasi' && <Pill size={14} className="text-purple-500" />}
                      {major === 'Teknologi Laboratorium Medik' && <Activity size={14} className="text-teal-500" />}
                      {major}
                    </span>
                    <span className="text-gray-900 font-bold">{count} Pilihan ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        major === 'Layanan Kesehatan' ? 'bg-rose-500' :
                        major === 'Teknik Farmasi' ? 'bg-purple-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 text-center text-[11px] text-gray-400">
            *Dihitung dari total preferensi jurusan ke-1 dan ke-2 semua siswa
          </div>
        </div>

        {/* Chart 2: Distribusi Rekomendasi Jurusan Otomatis */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">Hasil Rekomendasi Jurusan Otomatis (TPA)</h3>
          <div className="space-y-4">
            {majors.map((major) => {
              const count = getMajorRecommendationCount(major);
              const percentage = selesaiTes > 0 ? Math.round((count / selesaiTes) * 100) : 0;
              return (
                <div key={major} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-gray-700 flex items-center gap-1.5">
                      {major === 'Layanan Kesehatan' && <HeartPulse size={14} className="text-rose-500" />}
                      {major === 'Teknik Farmasi' && <Pill size={14} className="text-purple-500" />}
                      {major === 'Teknologi Laboratorium Medik' && <Activity size={14} className="text-teal-500" />}
                      {major}
                    </span>
                    <span className="text-gray-900 font-bold">{count} Siswa ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        major === 'Layanan Kesehatan' ? 'bg-rose-600' :
                        major === 'Teknik Farmasi' ? 'bg-purple-600' : 'bg-teal-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 text-center text-[11px] text-gray-400">
            *Hasil kecocokan dinamis berdasarkan skor tertinggi dalam Tes Potensi Akademik
          </div>
        </div>
      </div>

      {/* Recent candidates snapshot */}
      <div className="rounded-xl border border-gray-150 bg-white overflow-hidden shadow-sm">
        <div className="border-b border-gray-150 bg-gray-50/55 px-5 py-4">
          <h3 className="text-sm font-bold text-gray-800">Daftar Aktivitas Calon Siswa Terakhir</h3>
        </div>
        <div className="divide-y divide-gray-100 overflow-x-auto">
          {siswaProfiles.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">Tidak ada data calon siswa.</div>
          ) : (
            <table className="w-full text-left text-xs text-gray-500">
              <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">NISN</th>
                  <th className="px-5 py-3">Nama Lengkap</th>
                  <th className="px-5 py-3">Pilihan 1</th>
                  <th className="px-5 py-3">Pilihan 2</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {siswaProfiles.map((siswa) => (
                  <tr key={siswa.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono font-medium text-gray-700">{siswa.nisn}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900">{siswa.name}</td>
                    <td className="px-5 py-3">{siswa.choice1}</td>
                    <td className="px-5 py-3">{siswa.choice2}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        siswa.status === 'Selesai Tes' ? 'bg-emerald-50 text-emerald-700' :
                        siswa.status === 'Sedang Tes' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {siswa.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
