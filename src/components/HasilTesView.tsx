/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Role, TestResult, SiswaProfile, MajorType } from '../types';
import { 
  Award, 
  Search, 
  HeartPulse, 
  Pill, 
  Activity, 
  CheckCircle2, 
  Printer, 
  Info, 
  TrendingUp, 
  ShieldAlert, 
  BookOpenCheck,
  Building,
  UserCheck,
  ChevronRight,
  Sparkles,
  QrCode
} from 'lucide-react';

interface HasilTesViewProps {
  role: Role;
  testResults: TestResult[];
  siswaProfiles: SiswaProfile[];
  currentSiswa: SiswaProfile | null;
}

export default function HasilTesView({
  role,
  testResults,
  siswaProfiles,
  currentSiswa,
}: HasilTesViewProps) {
  const isSiswa = role === 'SISWA';
  const isAdminOrPanitia = role === 'ADMIN' || role === 'PANITIA';

  // Filters for Admin/Panitia
  const [searchTerm, setSearchTerm] = useState('');
  const [majorFilter, setMajorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Detailed Modal view for Admin/Panitia
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  // Filter test results
  const filteredResults = testResults.filter(res => {
    const matchesSearch = 
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      res.nisn.includes(searchTerm);
    
    const matchesMajor = majorFilter === 'ALL' || res.recommendedMajor === majorFilter;
    const matchesStatus = statusFilter === 'ALL' || res.status === statusFilter;

    return matchesSearch && matchesMajor && matchesStatus;
  });

  // Get current student's test result
  const studentResult = isSiswa && currentSiswa 
    ? testResults.find(r => r.siswaId === currentSiswa.id) 
    : null;

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Helper to render major icon
  const renderMajorIcon = (major: MajorType, size = 16) => {
    switch (major) {
      case 'Layanan Kesehatan':
        return <HeartPulse className="text-rose-500" size={size} />;
      case 'Teknik Farmasi':
        return <Pill className="text-purple-500" size={size} />;
      case 'Teknologi Laboratorium Medik':
        return <Activity className="text-teal-500" size={size} />;
    }
  };

  // Student Result Screen
  if (isSiswa) {
    if (!currentSiswa) return null;

    if (!studentResult) {
      return (
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-8 text-center space-y-4 max-w-2xl mx-auto" id="no-result-siswa">
          <ShieldAlert size={48} className="text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Hasil Tes Belum Tersedia</h2>
          <p className="text-sm text-gray-600">
            Anda belum mengikuti Tes Potensi Akademik (TPA). Silakan masuk ke halaman <strong>Dashboard</strong> lalu klik tombol <strong>Mulai Tes TPA Sekarang</strong> untuk memulai pengerjaan soal.
          </p>
        </div>
      );
    }

    // Recommendation logic text
    const hasEqualScores = studentResult.choice1Score === studentResult.choice2Score;
    const isChoice1Better = studentResult.choice1Score > studentResult.choice2Score;
    const recommendedLabel = studentResult.recommendedMajor;
    const alternativeMajor = recommendedLabel === studentResult.choice1 ? studentResult.choice2 : studentResult.choice1;
    const higherScore = recommendedLabel === studentResult.choice1 ? studentResult.choice1Score : studentResult.choice2Score;
    const lowerScore = recommendedLabel === studentResult.choice1 ? studentResult.choice2Score : studentResult.choice1Score;

    return (
      <div className="space-y-8" id="result-siswa-container">
        {/* Banner congrats */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white shadow-lg print:hidden">
          <div className="absolute right-0 top-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-white/10 blur-xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-100 border border-emerald-500/10">
                <Sparkles size={12} />
                Ujian Selesai Dievaluasi
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                Selamat! Hasil Tes TPA Anda Telah Terbit
              </h1>
              <p className="max-w-xl text-emerald-100 text-sm">
                Sistem telah menganalisis skor kognitif medis Anda secara otomatis untuk memberikan keputusan rekomendasi jurusan yang paling sesuai untuk studi Anda.
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 self-start md:self-center bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-sm"
              id="btn-print-certificate"
            >
              <Printer size={15} />
              Cetak Bukti Hasil Tes
            </button>
          </div>
        </div>

        {/* Visual score comparison cards */}
        <div className="grid gap-6 md:grid-cols-2 print:hidden">
          {/* Choice 1 score */}
          <div className="rounded-xl border border-gray-150 bg-white p-6 shadow-sm flex items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Skor Pilihan 1 (Utama)</span>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                {renderMajorIcon(studentResult.choice1, 18)}
                {studentResult.choice1}
              </h3>
              <p className="text-xs text-gray-500">
                Benar {studentResult.choice1Correct} dari {studentResult.choice1Total} soal
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <svg className="h-20 w-20 transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="#f3f4f6" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="40" 
                  cy="40" 
                  r="34" 
                  stroke={studentResult.choice1Score >= 60 ? '#10b981' : '#f59e0b'} 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - studentResult.choice1Score / 100)}
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-gray-900">{studentResult.choice1Score}%</span>
            </div>
          </div>

          {/* Choice 2 score */}
          <div className="rounded-xl border border-gray-150 bg-white p-6 shadow-sm flex items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Skor Pilihan 2 (Cadangan)</span>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                {renderMajorIcon(studentResult.choice2, 18)}
                {studentResult.choice2}
              </h3>
              <p className="text-xs text-gray-500">
                Benar {studentResult.choice2Correct} dari {studentResult.choice2Total} soal
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <svg className="h-20 w-20 transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="#f3f4f6" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="40" 
                  cy="40" 
                  r="34" 
                  stroke={studentResult.choice2Score >= 60 ? '#10b981' : '#f59e0b'} 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - studentResult.choice2Score / 100)}
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-gray-900">{studentResult.choice2Score}%</span>
            </div>
          </div>
        </div>

        {/* Algorithm Recommendation Box */}
        <div className="rounded-2xl border border-teal-150 bg-teal-50/20 p-6 md:p-8 shadow-sm space-y-4 print:hidden">
          <div className="flex items-center gap-2 text-teal-800">
            <TrendingUp size={22} />
            <h2 className="text-lg font-extrabold">Analisis Rekomendasi Jurusan Otomatis</h2>
          </div>
          <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
            <p>
              Berdasarkan akumulasi nilai pengerjaan soal uji kompetensi dasar pada kedua bidang jurusan, Anda dinyatakan <strong className="text-emerald-700">paling cocok dan memiliki minat/bakat alami yang lebih dominan</strong> untuk masuk ke jurusan:
            </p>
            
            {/* Recommend Banner */}
            <div className="rounded-xl border border-teal-200 bg-white p-4 flex items-center gap-4 max-w-xl shadow-sm">
              <div className="rounded-full bg-teal-50 p-3 text-teal-600 shrink-0">
                {renderMajorIcon(recommendedLabel, 26)}
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase block tracking-wider">Hasil Rekomendasi Program Studi</span>
                <span className="text-lg font-extrabold text-teal-900">{recommendedLabel}</span>
              </div>
            </div>

            <div className="bg-white/65 p-4 rounded-xl border border-gray-150 text-xs text-gray-600 space-y-2 mt-4 max-w-3xl">
              <p className="font-bold text-gray-800">Bagaimana algoritma sistem menentukan ini?</p>
              {hasEqualScores ? (
                <p>
                  Sistem mendeteksi bahwa Anda memperoleh <strong className="text-gray-800">skor yang setara ({higherScore}%)</strong> pada materi {studentResult.choice1} dan {studentResult.choice2}. Berdasarkan kebijakan akademik SMK Kesehatan Nusantara, jika skor setara, sistem otomatis merekomendasikan pilihan pertama Anda, yaitu <strong>{studentResult.choice1}</strong>, sebagai keputusan seleksi utama.
                </p>
              ) : (
                <p>
                  Skor Anda pada materi <strong>{recommendedLabel}</strong> adalah <strong className="text-teal-700">{higherScore}%</strong>, lebih tinggi dibandingkan nilai Anda pada materi <strong>{alternativeMajor}</strong> yaitu <strong className="text-gray-800">{lowerScore}%</strong>. Selisih keunggulan sebesar <strong className="text-teal-700">{higherScore - lowerScore}%</strong> membuktikan kesiapan kognitif, ketertarikan, dan adaptabilitas pemahaman yang lebih kuat di bidang {recommendedLabel}.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Printable Official Certificate */}
        <div className="bg-white border-8 border-double border-gray-300 p-8 md:p-12 shadow-md rounded-xl max-w-3xl mx-auto space-y-8 relative print:border-0 print:shadow-none print:p-0">
          
          {/* Header Kop Surat */}
          <div className="text-center border-b-4 border-double border-gray-800 pb-4 flex flex-col items-center justify-center space-y-1">
            <span className="text-xs tracking-widest font-bold text-gray-500 uppercase">YAYASAN PENDIDIKAN NUSANTARA JAYA</span>
            <h2 className="text-2xl font-extrabold text-teal-950 tracking-wide">SMK KESEHATAN NUSANTARA</h2>
            <p className="text-xs text-gray-600">Izin Operasional No: 421.3/2809-Bid.Keh/2018 - Terakreditasi A</p>
            <p className="text-[10px] text-gray-500 font-mono italic">Jl. Kesehatan Raya No. 45, Kompleks Nusantara Medik, Jakarta - Telp: (021) 829103</p>
          </div>

          {/* Title */}
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-gray-900 tracking-wide uppercase underline">SURAT KETERANGAN HASIL TES POTENSI AKADEMIK</h3>
            <p className="text-xs text-gray-500 font-mono">Nomor: SKHTPA/PMB-2026/{studentResult.nisn}</p>
          </div>

          {/* Student details body */}
          <div className="space-y-4 text-xs text-gray-800">
            <p className="leading-relaxed">
              Kepala Panitia Penerimaan Mahasiswa/Siswa Baru (PMB) SMK Kesehatan Nusantara dengan ini menerangkan bahwa calon siswa yang tertera di bawah ini telah menyelesaikan ujian seleksi kognitif terkomputerisasi:
            </p>

            {/* Table Details */}
            <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-200 py-4 font-medium max-w-xl mx-auto">
              <span className="text-gray-500">Nama Lengkap</span>
              <span className="col-span-2 text-gray-900 font-bold">: {studentResult.name}</span>

              <span className="text-gray-500">NISN (Username)</span>
              <span className="col-span-2 text-gray-900 font-mono font-bold">: {studentResult.nisn}</span>

              <span className="text-gray-500">Pilihan Jurusan 1</span>
              <span className="col-span-2 text-gray-800">: {studentResult.choice1} (Skor: {studentResult.choice1Score}%)</span>

              <span className="text-gray-500">Pilihan Jurusan 2</span>
              <span className="col-span-2 text-gray-800">: {studentResult.choice2} (Skor: {studentResult.choice2Score}%)</span>

              <span className="text-teal-900 font-bold">Rekomendasi Jurusan</span>
              <span className="col-span-2 text-teal-700 font-extrabold uppercase bg-teal-50 px-2 py-0.5 rounded inline-block w-fit border border-teal-100">
                : {studentResult.recommendedMajor}
              </span>
            </div>

            <p className="leading-relaxed">
              Berdasarkan hasil analisis sistem TPA otomatis, calon siswa bersangkutan dinilai memenuhi kompetensi prasyarat dasar kognitif dan direkomendasikan secara definitif untuk menempati program keahlian <strong>{studentResult.recommendedMajor}</strong> demi keselarasan potensi akademik dan kelancaran proses pembelajaran di masa depan.
            </p>
          </div>

          {/* Signatures and QR Code */}
          <div className="pt-6 flex justify-between items-end text-xs">
            {/* QR Code Validation */}
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-2 bg-gray-50">
              <QrCode size={48} className="text-gray-700" />
              <div className="text-[9px] text-gray-400 space-y-0.5">
                <span className="font-bold text-gray-600 block">SISTEM VALIDASI PMB</span>
                <span>Penerimaan Siswa Baru 2026</span>
                <span className="font-mono">ID-CERT-{studentResult.id}</span>
              </div>
            </div>

            {/* Signature Area */}
            <div className="text-center space-y-12">
              <div className="space-y-0.5">
                <p className="text-gray-600 text-[11px]">Jakarta, {studentResult.dateCompleted.split(' ')[0]}</p>
                <p className="font-bold text-gray-800">Kepala Panitia PMB,</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-gray-900 underline">Sri Wahyuni, S.Kep.</p>
                <p className="text-gray-500 text-[10px] font-mono">NIP. 19820412 201103 2 004</p>
              </div>
            </div>
          </div>

          {/* Document Seal Banner */}
          <div className="text-center border-t border-gray-200 pt-3 text-[9px] text-gray-400 font-mono flex items-center justify-center gap-1.5">
            <Building size={10} />
            <span>Dokumen ini diterbitkan secara sah oleh Sistem TPA Elektronik SMK Kesehatan Nusantara</span>
          </div>
        </div>
      </div>
    );
  }

  // Admin & Panitia Results Panel
  return (
    <div className="space-y-6" id="results-admin-root">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Evaluasi Hasil Tes TPA</h1>
        <p className="text-gray-500 text-sm">Lihat rekomendasi program studi otomatis berdasarkan capaian skor tes calon siswa.</p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-150 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama calon siswa atau NISN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="ALL">Semua Jurusan Rekomendasi</option>
            <option value="Layanan Kesehatan">Layanan Kesehatan</option>
            <option value="Teknik Farmasi">Teknik Farmasi</option>
            <option value="Teknologi Laboratorium Medik">Teknologi Laboratorium Medik</option>
          </select>
        </div>

        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="ALL">Semua Keputusan</option>
            <option value="Lulus Seleksi">Lulus Seleksi</option>
            <option value="Cadangan">Cadangan</option>
            <option value="Dipertimbangkan">Dipertimbangkan</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-xl border border-gray-150 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {filteredResults.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-400">
              Tidak ada riwayat hasil tes yang cocok dengan kriteria pencarian.
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Nama / NISN</th>
                  <th className="px-6 py-4">Nilai Pilihan 1</th>
                  <th className="px-6 py-4">Nilai Pilihan 2</th>
                  <th className="px-6 py-4">Rekomendasi Otomatis</th>
                  <th className="px-6 py-4">Tanggal Tes</th>
                  <th className="px-6 py-4">Keputusan</th>
                  <th className="px-6 py-4 text-center">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredResults.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50/70 transition">
                    {/* Name & ID */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{res.name}</div>
                        <div className="font-mono text-[11px] text-gray-400 mt-0.5">NISN: {res.nisn}</div>
                      </div>
                    </td>

                    {/* Choice 1 Score */}
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <div className="font-semibold text-gray-800 flex items-center gap-1">
                          {renderMajorIcon(res.choice1, 12)}
                          <span className="truncate max-w-[120px]">{res.choice1}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`font-bold font-mono px-1.5 py-0.5 rounded text-[10px] ${
                            res.choice1Score >= 60 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {res.choice1Score}%
                          </span>
                          <span className="text-gray-400">({res.choice1Correct}/{res.choice1Total} Benar)</span>
                        </div>
                      </div>
                    </td>

                    {/* Choice 2 Score */}
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <div className="font-semibold text-gray-800 flex items-center gap-1">
                          {renderMajorIcon(res.choice2, 12)}
                          <span className="truncate max-w-[120px]">{res.choice2}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`font-bold font-mono px-1.5 py-0.5 rounded text-[10px] ${
                            res.choice2Score >= 60 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {res.choice2Score}%
                          </span>
                          <span className="text-gray-400">({res.choice2Correct}/{res.choice2Total} Benar)</span>
                        </div>
                      </div>
                    </td>

                    {/* Recommendation */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-100 rounded-lg px-2.5 py-1 text-xs font-bold text-teal-800 uppercase tracking-wide">
                        {renderMajorIcon(res.recommendedMajor, 14)}
                        {res.recommendedMajor}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                      {res.dateCompleted}
                    </td>

                    {/* Decision tag */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        res.status === 'Lulus Seleksi' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        res.status === 'Cadangan' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {res.status}
                      </span>
                    </td>

                    {/* View Details Button */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedResult(res)}
                        className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition inline-flex items-center"
                        title="Lihat Detail Nilai"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Popover Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="border-b border-gray-150 px-6 py-4 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{selectedResult.name}</h3>
                <p className="text-[11px] font-mono text-gray-400">ID CERTIFICATE: CERT-{selectedResult.id}</p>
              </div>
              <button 
                onClick={() => setSelectedResult(null)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              
              {/* Compare Bar */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-teal-600" />
                  Perbandingan Nilai Tes Jurusan
                </h4>

                {/* Choice 1 block */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-700 flex items-center gap-1">
                      {renderMajorIcon(selectedResult.choice1, 12)}
                      {selectedResult.choice1} (Pilihan 1)
                    </span>
                    <span className="text-gray-900 font-bold">{selectedResult.choice1Score}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${selectedResult.choice1Score}%` }}></div>
                  </div>
                </div>

                {/* Choice 2 block */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-700 flex items-center gap-1">
                      {renderMajorIcon(selectedResult.choice2, 12)}
                      {selectedResult.choice2} (Pilihan 2)
                    </span>
                    <span className="text-gray-900 font-bold">{selectedResult.choice2Score}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${selectedResult.choice2Score}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Recommendation Rule Explanation */}
              <div className="bg-teal-50 border border-teal-150 rounded-xl p-4 space-y-2 text-xs">
                <h5 className="font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  Keputusan Kepantasan
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  Berdasarkan algoritma evaluasi otomatis, nilai tertinggi dicapai pada jurusan <strong>{selectedResult.recommendedMajor}</strong> dengan skor kognitif <strong>{selectedResult.recommendedMajor === selectedResult.choice1 ? selectedResult.choice1Score : selectedResult.choice2Score}%</strong>. Calon siswa dinyatakan paling kompeten untuk masuk ke jurusan tersebut.
                </p>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-gray-100 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setSelectedResult(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-150 transition"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    // Open browser print window
                    window.print();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition flex items-center gap-1.5"
                >
                  <Printer size={13} />
                  Cetak Dokumen
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icon wrapper workaround for modal header
interface XProps {
  size?: number;
  className?: string;
}

function X({ size = 16, className = '' }: XProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
