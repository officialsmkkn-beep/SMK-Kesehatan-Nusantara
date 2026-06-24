/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, SiswaProfile, Question, TestResult, AppSettings } from './types';

export const INITIAL_SETTINGS: AppSettings = {
  schoolName: 'SMK Kesehatan Nusantara',
  passingGrade: 60,
  testDurationMinutes: 40,
  isOpen: true,
  schoolAddress: 'Jl. Raya Nusantara No. 123, Jakarta Pusat',
  schoolWebsite: 'www.smk-kesehatan-nusantara.sch.id',
  schoolPrincipalName: 'Dr. apt. Rian H., M.Si',
  schoolPrincipalNip: '19880402 201503 1 002',
  schoolYear: '2026/2027',
  schoolLogoUrl: '',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    username: 'admin',
    name: 'Administrator TPA',
    email: 'admin@smk-kesehatan.sch.id',
    role: 'ADMIN',
    password: 'admin',
  },
  {
    id: 'u-panitia',
    username: 'panitia',
    name: 'Sri Wahyuni, S.Kep.',
    email: 'panitia@smk-kesehatan.sch.id',
    role: 'PANITIA',
    password: 'panitia',
  },
  {
    id: 'u-siswa-1',
    username: '202601',
    name: 'Ahmad Farhan',
    email: 'ahmadfarhan@gmail.com',
    role: 'SISWA',
    password: 'siswa',
  },
  {
    id: 'u-siswa-2',
    username: '202602',
    name: 'Siti Aminah',
    email: 'sitiaminah@gmail.com',
    role: 'SISWA',
    password: 'siswa',
  },
  {
    id: 'u-siswa-3',
    username: '202603',
    name: 'Rian Hidayat',
    email: 'rianhidayat@gmail.com',
    role: 'SISWA',
    password: 'siswa',
  },
  {
    id: 'u-siswa-4',
    username: '202604',
    name: 'Dewi Lestari',
    email: 'dewilestari@gmail.com',
    role: 'SISWA',
    password: 'siswa',
  }
];

export const INITIAL_SISWA_PROFILES: SiswaProfile[] = [
  {
    id: 's-1',
    userId: 'u-siswa-1',
    name: 'Ahmad Farhan',
    nisn: '202601',
    email: 'ahmadfarhan@gmail.com',
    choice1: 'Teknik Farmasi',
    choice2: 'Layanan Kesehatan',
    phone: '081234567890',
    birthDate: '2010-05-12',
    gender: 'Laki-laki',
    status: 'Selesai Tes',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 's-2',
    userId: 'u-siswa-2',
    name: 'Siti Aminah',
    nisn: '202602',
    email: 'sitiaminah@gmail.com',
    choice1: 'Layanan Kesehatan',
    choice2: 'Teknologi Laboratorium Medik',
    phone: '082345678901',
    birthDate: '2010-08-22',
    gender: 'Perempuan',
    status: 'Selesai Tes',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 's-3',
    userId: 'u-siswa-3',
    name: 'Rian Hidayat',
    nisn: '202603',
    email: 'rianhidayat@gmail.com',
    choice1: 'Teknologi Laboratorium Medik',
    choice2: 'Teknik Farmasi',
    phone: '083456789012',
    birthDate: '2010-11-03',
    gender: 'Laki-laki',
    status: 'Selesai Tes',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 's-4',
    userId: 'u-siswa-4',
    name: 'Dewi Lestari',
    email: 'dewilestari@gmail.com',
    nisn: '202604',
    choice1: 'Layanan Kesehatan',
    choice2: 'Teknik Farmasi',
    phone: '084567890123',
    birthDate: '2011-02-14',
    gender: 'Perempuan',
    status: 'Belum Tes',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // === LAYANAN KESEHATAN ===
  {
    id: 'q-lk-1',
    major: 'Layanan Kesehatan',
    questionText: 'Berapakah suhu tubuh normal manusia dewasa dalam keadaan istirahat?',
    optionA: '34,5 °C - 35,5 °C',
    optionB: '36,5 °C - 37,5 °C',
    optionC: '38,0 °C - 39,0 °C',
    optionD: '39,5 °C - 40,5 °C',
    correctAnswer: 'B'
  },
  {
    id: 'q-lk-2',
    major: 'Layanan Kesehatan',
    questionText: 'Tindakan pencegahan penularan penyakit dengan cara mencuci tangan, memakai masker, dan menjaga jarak disebut sebagai tindakan...',
    optionA: 'Kuratif (Pengobatan)',
    optionB: 'Rehabilitatif (Pemulihan)',
    optionC: 'Preventif (Pencegahan)',
    optionD: 'Promotif (Peningkatan)',
    correctAnswer: 'C'
  },
  {
    id: 'q-lk-3',
    major: 'Layanan Kesehatan',
    questionText: 'Peralatan medis yang digunakan untuk mendengar suara jantung, paru-paru, dan aliran darah di dalam tubuh adalah...',
    optionA: 'Termometer',
    optionB: 'Tensimeter',
    optionC: 'Stetoskop',
    optionD: 'Oksimeter',
    correctAnswer: 'C'
  },
  {
    id: 'q-lk-4',
    major: 'Layanan Kesehatan',
    questionText: 'Manakah dari berikut ini yang merupakan contoh etika berkomunikasi yang baik antara perawat/asisten keperawatan dengan pasien?',
    optionA: 'Berbicara dengan nada tinggi agar pasien mendengar',
    optionB: 'Mendengarkan dengan empati dan menjelaskan dengan bahasa yang mudah dipahami',
    optionC: 'Meninggalkan pasien sebelum dia selesai berbicara',
    optionD: 'Mengabaikan keluhan pasien jika keluhan dirasa sepele',
    correctAnswer: 'B'
  },
  {
    id: 'q-lk-5',
    major: 'Layanan Kesehatan',
    questionText: 'Denyut nadi normal pada orang dewasa yang sehat saat beristirahat berkisar antara...',
    optionA: '30 - 50 kali per menit',
    optionB: '60 - 100 kali per menit',
    optionC: '110 - 140 kali per menit',
    optionD: '150 - 180 kali per menit',
    correctAnswer: 'B'
  },
  {
    id: 'q-lk-6',
    major: 'Layanan Kesehatan',
    questionText: 'Pertolongan pertama pada luka bakar ringan (derajat satu) yang tepat di rumah adalah...',
    optionA: 'Mengolesinya dengan mentega atau pasta gigi',
    optionB: 'Mengalirinya dengan air mengalir biasa selama 10-20 menit',
    optionC: 'Memecahkan lepuhan kulit sesegera mungkin',
    optionD: 'Menempelkan es batu secara langsung pada luka',
    correctAnswer: 'B'
  },

  // === TEKNIK FARMASI ===
  {
    id: 'q-tf-1',
    major: 'Teknik Farmasi',
    questionText: 'Singkatan dari bahasa Latin "t.d.d" atau "t.i.d" dalam resep dokter memiliki arti...',
    optionA: 'Satu kali sehari',
    optionB: 'Dua kali sehari',
    optionC: 'Tiga kali sehari',
    optionD: 'Empat kali sehari',
    correctAnswer: 'C'
  },
  {
    id: 'q-tf-2',
    major: 'Teknik Farmasi',
    questionText: 'Manakah dari obat berikut ini yang termasuk dalam golongan obat analgesik-antipiretik yang digunakan untuk meredakan nyeri dan menurunkan demam?',
    optionA: 'Amoksisilin',
    optionB: 'Parasetamol',
    optionC: 'Antasida',
    optionD: 'Loperamid',
    correctAnswer: 'B'
  },
  {
    id: 'q-tf-3',
    major: 'Teknik Farmasi',
    questionText: 'Obat yang hanya boleh dibeli dengan resep dokter di apotek ditandai dengan lingkaran merah dengan huruf kapital warna hitam di dalamnya, yaitu huruf...',
    optionA: 'W',
    optionB: 'K',
    optionC: 'B',
    optionD: 'P',
    correctAnswer: 'B'
  },
  {
    id: 'q-tf-4',
    major: 'Teknik Farmasi',
    questionText: 'Alat ukur volume zat cair yang sering digunakan dalam praktikum pembuatan sediaan obat cair di laboratorium farmasi adalah...',
    optionA: 'Gelas ukur',
    optionB: 'Mortir dan stamper',
    optionC: 'Sudip',
    optionD: 'Cawan penguap',
    correctAnswer: 'A'
  },
  {
    id: 'q-tf-5',
    major: 'Teknik Farmasi',
    questionText: 'Sediaan obat padat berupa bubuk halus yang dibagi dalam bobot yang kurang lebih sama, dibungkus menggunakan kertas perkamen disebut...',
    optionA: 'Kapsul',
    optionB: 'Tablet',
    optionC: 'Pulveres (Puyer)',
    optionD: 'Pil',
    correctAnswer: 'C'
  },
  {
    id: 'q-tf-6',
    major: 'Teknik Farmasi',
    questionText: 'Tujuan utama dari pelapisan tablet (coating) dalam pembuatan sediaan obat adalah...',
    optionA: 'Menghindari rasa pahit, melindungi obat dari asam lambung, dan meningkatkan estetika',
    optionB: 'Menambah berat badan pasien',
    optionC: 'Mempercepat kerusakan obat agar cepat terserap',
    optionD: 'Membuat tablet menjadi tidak bisa larut selamanya',
    correctAnswer: 'A'
  },

  // === TEKNOLOGI LABORATORIUM MEDIK ===
  {
    id: 'q-tlm-1',
    major: 'Teknologi Laboratorium Medik',
    questionText: 'Jenis sel darah yang berfungsi utama untuk mengikat oksigen dari paru-paru dan mengedarkannya ke seluruh tubuh adalah...',
    optionA: 'Leukosit (Sel darah putih)',
    optionB: 'Eritrosit (Sel darah merah)',
    optionC: 'Trombosit (Keping darah)',
    optionD: 'Plasma darah',
    correctAnswer: 'B'
  },
  {
    id: 'q-tlm-2',
    major: 'Teknologi Laboratorium Medik',
    questionText: 'Alat laboratorium yang digunakan untuk memisahkan komponen sampel cair berdasarkan perbedaan massa jenis dengan cara diputar pada kecepatan tinggi disebut...',
    optionA: 'Mikroskop',
    optionB: 'Sentrifus',
    optionC: 'Autoklaf',
    optionD: 'Inkubator',
    correctAnswer: 'B'
  },
  {
    id: 'q-tlm-3',
    major: 'Teknologi Laboratorium Medik',
    questionText: 'Manakah dari reagen berikut yang digunakan untuk melakukan pemeriksaan kadar glukosa dalam urin secara kualitatif di laboratorium medik?',
    optionA: 'Reagen Benedict',
    optionB: 'Reagen Biuret',
    optionC: 'Reagen Lugol',
    optionD: 'Alkohol 70%',
    correctAnswer: 'A'
  },
  {
    id: 'q-tlm-4',
    major: 'Teknologi Laboratorium Medik',
    questionText: 'Untuk melihat struktur bakteri atau sel darah dengan perbesaran yang sangat detail, tenaga laboratorium menggunakan alat...',
    optionA: 'Spektrofotometer',
    optionB: 'Mikroskop',
    optionC: 'Pipet volume',
    optionD: 'Hemositometer',
    correctAnswer: 'B'
  },
  {
    id: 'q-tlm-5',
    major: 'Teknologi Laboratorium Medik',
    questionText: 'Tindakan pengambilan darah vena untuk keperluan pemeriksaan laboratorium dikenal dengan istilah...',
    optionA: 'Flebotomi',
    optionB: 'Biopsi',
    optionC: 'Hemodialisis',
    optionD: 'Kateterisasi',
    correctAnswer: 'A'
  },
  {
    id: 'q-tlm-6',
    major: 'Teknologi Laboratorium Medik',
    questionText: 'APD (Alat Pelindung Diri) wajib yang harus digunakan saat berada di laboratorium medik untuk menghindari kontaminasi bahan biologis berbahaya adalah...',
    optionA: 'Baju kasual dan sandal',
    optionB: 'Jas laboratorium, sarung tangan, masker, dan sepatu tertutup',
    optionC: 'Jaket kulit dan kacamata hitam',
    optionD: 'Topi proyek dan sarung tangan kain biasa',
    correctAnswer: 'B'
  }
];

export const INITIAL_TEST_RESULTS: TestResult[] = [
  {
    id: 'r-1',
    siswaId: 's-1',
    nisn: '202601',
    name: 'Ahmad Farhan',
    choice1: 'Teknik Farmasi',
    choice1Correct: 5,
    choice1Total: 6,
    choice1Score: 83,
    choice2: 'Layanan Kesehatan',
    choice2Correct: 3,
    choice2Total: 6,
    choice2Score: 50,
    recommendedMajor: 'Teknik Farmasi',
    dateCompleted: '2026-06-21 09:15',
    status: 'Lulus Seleksi'
  },
  {
    id: 'r-2',
    siswaId: 's-2',
    nisn: '202602',
    name: 'Siti Aminah',
    choice1: 'Layanan Kesehatan',
    choice1Correct: 5,
    choice1Total: 6,
    choice1Score: 83,
    choice2: 'Teknologi Laboratorium Medik',
    choice2Correct: 6,
    choice2Total: 6,
    choice2Score: 100,
    recommendedMajor: 'Teknologi Laboratorium Medik',
    dateCompleted: '2026-06-22 14:30',
    status: 'Lulus Seleksi'
  },
  {
    id: 'r-3',
    siswaId: 's-3',
    nisn: '202603',
    name: 'Rian Hidayat',
    choice1: 'Teknologi Laboratorium Medik',
    choice1Correct: 2,
    choice1Total: 6,
    choice1Score: 33,
    choice2: 'Teknik Farmasi',
    choice2Correct: 4,
    choice2Total: 6,
    choice2Score: 67,
    recommendedMajor: 'Teknik Farmasi',
    dateCompleted: '2026-06-23 11:05',
    status: 'Cadangan'
  }
];
