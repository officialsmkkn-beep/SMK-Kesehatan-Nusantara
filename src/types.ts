/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'ADMIN' | 'PANITIA' | 'SISWA';

export type MajorType = 'Layanan Kesehatan' | 'Teknik Farmasi' | 'Teknologi Laboratorium Medik';

export interface User {
  id: string;
  username: string; // For Siswa this is their NISN, for Admin/Panitia it is their username
  name: string;
  email: string;
  role: Role;
  password?: string;
}

export interface SiswaProfile {
  id: string;
  userId: string;
  name: string;
  nisn: string;
  email: string;
  choice1: MajorType;
  choice2: MajorType;
  phone: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  status: 'Belum Tes' | 'Sedang Tes' | 'Selesai Tes';
  photoUrl?: string;
}

export interface Question {
  id: string;
  major: MajorType;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export interface TestResult {
  id: string;
  siswaId: string;
  nisn: string;
  name: string;
  choice1: MajorType;
  choice1Score: number; // percentage (0 - 100)
  choice1Correct: number;
  choice1Total: number;
  choice2: MajorType;
  choice2Score: number; // percentage (0 - 100)
  choice2Correct: number;
  choice2Total: number;
  recommendedMajor: MajorType;
  dateCompleted: string;
  status: 'Lulus Seleksi' | 'Cadangan' | 'Dipertimbangkan';
}

export interface AppSettings {
  schoolName: string;
  passingGrade: number; // default e.g. 60
  testDurationMinutes: number; // e.g. 45
  isOpen: boolean;
  schoolAddress?: string;
  schoolWebsite?: string;
  schoolPrincipalName?: string;
  schoolPrincipalNip?: string;
  schoolYear?: string;
  schoolLogoUrl?: string;
}
