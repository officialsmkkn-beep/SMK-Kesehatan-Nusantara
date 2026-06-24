/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SCHEMA_SQL, CONFIG_PHP, LOGIN_PHP, SIMPAN_HASIL_PHP, ADMIN_INPUT_SISWA_PHP } from '../php_code';
import { 
  Database, 
  FileCode, 
  BookOpen, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Info,
  Server,
  KeyRound,
  FileInput
} from 'lucide-react';

export default function PhpMysqlGuideView() {
  // Tab control
  const [activeTab, setActiveTab] = useState<'GUIDE' | 'SQL' | 'CONFIG' | 'LOGIN' | 'GRADING' | 'INPUT'>('GUIDE');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActiveCode = () => {
    switch (activeTab) {
      case 'SQL': return SCHEMA_SQL;
      case 'CONFIG': return CONFIG_PHP;
      case 'LOGIN': return LOGIN_PHP;
      case 'GRADING': return SIMPAN_HASIL_PHP;
      case 'INPUT': return ADMIN_INPUT_SISWA_PHP;
      default: return '';
    }
  };

  const getActiveFileName = () => {
    switch (activeTab) {
      case 'SQL': return 'database.sql';
      case 'CONFIG': return 'config.php';
      case 'LOGIN': return 'login.php';
      case 'GRADING': return 'simpan_hasil.php';
      case 'INPUT': return 'admin_input_siswa.php';
      default: return '';
    }
  };

  return (
    <div className="space-y-6" id="php-mysql-guide-root">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Server className="text-teal-600" size={24} />
            Panduan & Source Code PHP + MySQL
          </h1>
          <p className="text-gray-500 text-sm">Fasilitas ekspor dan instalasi mandiri untuk dijalankan di Localhost XAMPP / Laragon.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 items-start">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-1 bg-gray-50 p-2 rounded-xl border border-gray-150">
          <button
            onClick={() => setActiveTab('GUIDE')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold text-left transition-all ${
              activeTab === 'GUIDE'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <BookOpen size={16} />
            Petunjuk Penggunaan
          </button>

          <span className="text-[10px] font-bold text-gray-400 uppercase px-4 pt-4 pb-1">MySQL Database</span>
          <button
            onClick={() => setActiveTab('SQL')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold text-left transition-all ${
              activeTab === 'SQL'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Database size={16} />
            database.sql
          </button>

          <span className="text-[10px] font-bold text-gray-400 uppercase px-4 pt-4 pb-1">PHP Source Files</span>
          <button
            onClick={() => setActiveTab('CONFIG')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-mono text-left transition-all ${
              activeTab === 'CONFIG'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FileCode size={16} />
            config.php
          </button>

          <button
            onClick={() => setActiveTab('LOGIN')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-mono text-left transition-all ${
              activeTab === 'LOGIN'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FileCode size={16} />
            login.php
          </button>

          <button
            onClick={() => setActiveTab('GRADING')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-mono text-left transition-all ${
              activeTab === 'GRADING'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FileCode size={16} />
            simpan_hasil.php
          </button>

          <button
            onClick={() => setActiveTab('INPUT')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-mono text-left transition-all ${
              activeTab === 'INPUT'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FileCode size={16} />
            admin_input_siswa.php
          </button>
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-3">
          {activeTab === 'GUIDE' ? (
            /* Setup Guide */
            <div className="bg-white rounded-xl border border-gray-150 p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Petunjuk Instalasi & Penggunaan (PHP-MySQL)</h2>
                <p className="text-gray-500 text-sm">Ikuti langkah-langkah di bawah ini untuk menjalankan program Tes Potensi Akademik di komputer lokal Anda.</p>
              </div>

              {/* Step list */}
              <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 font-extrabold border border-teal-100">
                    1
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <Server size={16} className="text-gray-400" />
                      Siapkan Web Server Lokal (XAMPP / Laragon)
                    </h3>
                    <p className="text-gray-600">
                      Instal aplikasi web server lokal seperti <strong>XAMPP</strong> atau <strong>Laragon</strong> yang sudah menyertakan modul PHP (minimal versi 7.4 atau lebih baru) dan database MySQL. Aktifkan service <strong>Apache</strong> dan <strong>MySQL</strong> pada control panel server lokal Anda.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 font-extrabold border border-teal-100">
                    2
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <Database size={16} className="text-gray-400" />
                      Buat Database dan Impor database.sql
                    </h3>
                    <p className="text-gray-600">
                      Buka browser, lalu akses halaman <strong>phpMyAdmin</strong> Anda di URL: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-teal-700 font-mono text-xs">http://localhost/phpmyadmin</code>. Buat database baru bernama <code className="bg-gray-100 px-1.5 py-0.5 rounded text-teal-700 font-mono text-xs">db_tpa_smk</code>. Selanjutnya, masuk ke tab <strong>Import</strong>, pilih file <code className="bg-gray-100 px-1.5 py-0.5 rounded text-teal-700 font-mono text-xs">database.sql</code> (salin dari tab sidebar database.sql aplikasi ini) dan jalankan proses impor.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 font-extrabold border border-teal-100">
                    3
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <FileCode size={16} className="text-gray-400" />
                      Salin File PHP ke Direktori htdocs
                    </h3>
                    <p className="text-gray-600">
                      Buat folder baru bernama <code className="bg-gray-100 px-1.5 py-0.5 rounded text-teal-700 font-mono text-xs">tpa-smk</code> di dalam folder root server Anda (misal <code className="bg-gray-100 px-1.5 py-0.5 rounded text-teal-700 font-mono text-xs">C:/xampp/htdocs/tpa-smk/</code>). Buat file baru dengan nama masing-masing di htdocs tersebut, lalu salin seluruh isi source code PHP dari sidebar menu aplikasi ini:
                    </p>
                    <ul className="list-disc pl-5 mt-1 text-xs text-gray-500 space-y-1">
                      <li><strong>config.php</strong>: Berisi pengaturan kredensial koneksi database MySQL menggunakan PDO.</li>
                      <li><strong>login.php</strong>: Halaman login multi-role dengan keamanan enkripsi/verifikasi session.</li>
                      <li><strong>simpan_hasil.php</strong>: Kode pemrosesan otomatis (algoritma penskoran & rekomendasi dinamis).</li>
                      <li><strong>admin_input_siswa.php</strong>: Menu admin untuk mendaftarkan calon siswa dan menerbitkan akun secara otomatis.</li>
                    </ul>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 font-extrabold border border-teal-100">
                    4
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <KeyRound size={16} className="text-gray-400" />
                      Kredensial Akun Pengujian Default
                    </h3>
                    <p className="text-gray-600">
                      Anda dapat melakukan login pengujian menggunakan akun-akun bawaan hasil instalasi SQL berikut:
                    </p>
                    <div className="mt-2 grid gap-3 sm:grid-cols-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-150">
                      <div>
                        <span className="font-bold text-teal-800 block">ADMIN:</span>
                        <span>Username: <strong>admin</strong></span><br />
                        <span>Password: <strong>admin</strong></span>
                      </div>
                      <div>
                        <span className="font-bold text-purple-800 block">PANITIA:</span>
                        <span>Username: <strong>panitia</strong></span><br />
                        <span>Password: <strong>panitia</strong></span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-800 block">SISWA TEST (Dewi):</span>
                        <span>Username: <strong>202604</strong></span><br />
                        <span>Password: <strong>siswa</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 font-extrabold border border-teal-100">
                    5
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <FileInput size={16} className="text-gray-400" />
                      Cara Menginput Data Soal Tes Ujian
                    </h3>
                    <p className="text-gray-600">
                      Untuk menambahkan soal ujian secara dinamis, Admin dapat masuk ke database phpMyAdmin di tabel <code className="bg-gray-100 px-1.5 py-0.5 rounded text-teal-700 font-mono text-xs">bank_soal</code> lalu memasukkan rekor data. Pastikan kolom <code className="bg-gray-100 px-1.5 py-0.5 rounded text-teal-700 font-mono text-xs">jurusan</code> bernilai persis sama dengan salah satu dari 3 pilihan berikut:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-rose-50 border border-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-lg text-[10px]">Layanan Kesehatan</span>
                      <span className="bg-purple-50 border border-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded-lg text-[10px]">Teknik Farmasi</span>
                      <span className="bg-teal-50 border border-teal-100 text-teal-700 font-bold px-2.5 py-1 rounded-lg text-[10px]">Teknologi Laboratorium Medik</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Siswa akan diuji otomatis sesuai dengan pilihan kedua jurusan yang diinputkan oleh Admin. Sistem akan menarik bank soal dari kedua pilihan tersebut secara acak demi akurasi hasil penilaian.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* Code Editor Container */
            <div className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm flex flex-col h-[70vh]">
              {/* Code Editor Header */}
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-150 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-teal-600" />
                  <span className="text-xs font-bold text-gray-700 font-mono">{getActiveFileName()}</span>
                </div>
                <button
                  onClick={() => handleCopy(getActiveCode())}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-3 py-1.5 rounded-lg text-xs transition active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="text-gray-500" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Pre Box */}
              <div className="flex-1 overflow-auto bg-gray-900 p-5 font-mono text-xs text-gray-100 select-all leading-relaxed whitespace-pre scrollbar-thin">
                {getActiveCode()}
              </div>

              {/* Status Info Footer */}
              <div className="bg-gray-50 px-5 py-2.5 border-t border-gray-150 text-[10px] text-gray-400 font-mono flex items-center justify-between">
                <span>FORMAT: {activeTab === 'SQL' ? 'SQL SCRIPT' : 'PHP OBJECT-ORIENTED (PDO)'}</span>
                <span>YANG DAPAT DIOPERASIKAN DI LOCALHOST</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
