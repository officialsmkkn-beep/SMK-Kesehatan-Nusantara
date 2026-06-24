/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const SCHEMA_SQL = `-- Database: db_tpa_smk
-- Dibuat untuk: SMK Kesehatan Nusantara
-- Sistem Tes Potensi Akademik (TPA)

CREATE DATABASE IF NOT EXISTS db_tpa_smk;
USE db_tpa_smk;

-- 1. Tabel Users (Kredensial Login untuk Admin, Panitia, dan Siswa)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL, -- NISN untuk siswa, username untuk admin/panitia
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('ADMIN', 'PANITIA', 'SISWA') NOT NULL,
    password VARCHAR(255) NOT NULL, -- Disimpan dengan password_hash()
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Calon Siswa (Profil Calon Siswa & Pilihan Jurusan)
CREATE TABLE IF NOT EXISTS calon_siswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nisn VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    pilihan_1 ENUM('Layanan Kesehatan', 'Teknik Farmasi', 'Teknologi Laboratorium Medik') NOT NULL,
    pilihan_2 ENUM('Layanan Kesehatan', 'Teknik Farmasi', 'Teknologi Laboratorium Medik') NOT NULL,
    telepon VARCHAR(20) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
    status_tes ENUM('Belum Tes', 'Sedang Tes', 'Selesai Tes') DEFAULT 'Belum Tes',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Bank Soal (Soal untuk masing-masing Jurusan)
CREATE TABLE IF NOT EXISTS bank_soal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jurusan ENUM('Layanan Kesehatan', 'Teknik Farmasi', 'Teknologi Laboratorium Medik') NOT NULL,
    pertanyaan TEXT NOT NULL,
    opsi_a VARCHAR(255) NOT NULL,
    opsi_b VARCHAR(255) NOT NULL,
    opsi_c VARCHAR(255) NOT NULL,
    opsi_d VARCHAR(255) NOT NULL,
    jawaban_benar ENUM('A', 'B', 'C', 'D') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Hasil Tes (Skor ujian dan Rekomendasi Jurusan)
CREATE TABLE IF NOT EXISTS hasil_tes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calon_siswa_id INT NOT NULL,
    skor_pilihan_1 INT NOT NULL, -- Persentase (0-100)
    benar_pilihan_1 INT NOT NULL, -- Jumlah jawaban benar
    total_pilihan_1 INT NOT NULL, -- Jumlah soal pil 1
    skor_pilihan_2 INT NOT NULL, -- Persentase (0-100)
    benar_pilihan_2 INT NOT NULL, -- Jumlah jawaban benar
    total_pilihan_2 INT NOT NULL, -- Jumlah soal pil 2
    rekomendasi_jurusan VARCHAR(100) NOT NULL, -- Jurusan dengan skor tertinggi
    tanggal_tes TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (calon_siswa_id) REFERENCES calon_siswa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Akun Default (Password hash untuk 'admin', 'panitia', 'siswa')
-- Catatan: Secara nyata gunakan password_hash() di PHP. Di bawah ini adalah hash dari kata sandi default.
INSERT INTO users (username, nama, email, role, password) VALUES
('admin', 'Administrator Utama', 'admin@smk-kesehatan.sch.id', 'ADMIN', '$2y$10$C8H5o4fB3mXpCegWszrFHe2Mv7NnS44f6fBszHfeNWe6K8K59XN5y'), -- password: admin
('panitia', 'Panitia PMB', 'panitia@smk-kesehatan.sch.id', 'PANITIA', '$2y$10$N2u/M8F1fP4bQ5mXseT6EuDREqFWe4WnS44f6fBszHfeNWe6K8K59XN5y'), -- password: panitia
('202604', 'Dewi Lestari', 'dewilestari@gmail.com', 'SISWA', '$2y$10$gBskM4gB4mXpCeGWszrFHe2Mv7NnS44f6fBszHfeNWe6K8K59XN5y'); -- password: siswa

-- Get last inserted id for student user
INSERT INTO calon_siswa (user_id, nisn, nama, email, pilihan_1, pilihan_2, telepon, tanggal_lahir, jenis_kelamin, status_tes) VALUES
(LAST_INSERT_ID(), '202604', 'Dewi Lestari', 'dewilestari@gmail.com', 'Layanan Kesehatan', 'Teknik Farmasi', '084567890123', '2011-02-14', 'Perempuan', 'Belum Tes');

-- Seed Data Bank Soal
INSERT INTO bank_soal (jurusan, pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban_benar) VALUES
('Layanan Kesehatan', 'Berapakah suhu tubuh normal manusia dewasa dalam keadaan istirahat?', '34,5 °C - 35,5 °C', '36,5 °C - 37,5 °C', '38,0 °C - 39,0 °C', '39,5 °C - 40,5 °C', 'B'),
('Layanan Kesehatan', 'Peralatan medis yang digunakan untuk mendengar suara jantung adalah...', 'Termometer', 'Tensimeter', 'Stetoskop', 'Oksimeter', 'C'),
('Teknik Farmasi', 'Singkatan dari bahasa Latin "t.i.d" dalam resep dokter memiliki arti...', 'Satu kali sehari', 'Dua kali sehari', 'Tiga kali sehari', 'Empat kali sehari', 'C'),
('Teknik Farmasi', 'Manakah dari obat berikut ini yang termasuk golongan analgesik-antipiretik?', 'Amoksisilin', 'Parasetamol', 'Antasida', 'Loperamid', 'B'),
('Teknologi Laboratorium Medik', 'Jenis sel darah yang berfungsi utama untuk mengikat oksigen adalah...', 'Leukosit', 'Eritrosit', 'Trombosit', 'Plasma darah', 'B'),
('Teknologi Laboratorium Medik', 'Alat laboratorium untuk memisahkan komponen sampel cair disebut...', 'Mikroskop', 'Sentrifus', 'Autoklaf', 'Inkubator', 'B');
`;

export const CONFIG_PHP = `<?php
// config.php - Konfigurasi Koneksi Database MySQL (PDO)
// Untuk: SMK Kesehatan Nusantara

$host = 'localhost';
$db   = 'db_tpa_smk';
$user = 'root';
$pass = ''; // default kosong di XAMPP
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\\PDOException $e) {
     throw new \\PDOException($e->getMessage(), (int)$e->getCode());
}
?>
`;

export const LOGIN_PHP = `<?php
// login.php - Proses Autentikasi Pengguna
require_once 'config.php';
session_start();

$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (!empty($username) && !empty($password)) {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ?');
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['nama'] = $user['nama'];
            $_SESSION['role'] = $user['role'];

            if ($user['role'] == 'SISWA') {
                // Ambil data profil calon siswa
                $stmtSiswa = $pdo->prepare('SELECT * FROM calon_siswa WHERE user_id = ?');
                $stmtSiswa->execute([$user['id']]);
                $siswa = $stmtSiswa->fetch();
                $_SESSION['siswa_id'] = $siswa['id'];
                $_SESSION['pilihan_1'] = $siswa['pilihan_1'];
                $_SESSION['pilihan_2'] = $siswa['pilihan_2'];
                header('Location: siswa_dashboard.php');
            } else {
                header('Location: admin_dashboard.php');
            }
            exit;
        } else {
            $error = 'Username atau Password salah!';
        }
    } else {
        $error = 'Harap isi semua kolom!';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Login - TPA SMK Kesehatan Nusantara</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-teal-700">SMK Kesehatan Nusantara</h2>
            <p class="text-gray-500 text-sm">Portal Tes Potensi Akademik (TPA)</p>
        </div>
        <?php if ($error): ?>
            <div class="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>
        <form action="" method="POST" class="space-y-4">
            <div>
                <label class="block text-gray-700 text-sm font-semibold mb-1">Username / NISN</label>
                <input type="text" name="username" required class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
            </div>
            <div>
                <label class="block text-gray-700 text-sm font-semibold mb-1">Password</label>
                <input type="password" name="password" required class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
            </div>
            <button type="submit" class="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition duration-200">Masuk</button>
        </form>
    </div>
</body>
</html>
`;

export const SIMPAN_HASIL_PHP = `<?php
// simpan_hasil.php - Evaluasi Otomatis & Rekomendasi Jurusan
require_once 'config.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] != 'POST' || !isset($_SESSION['siswa_id'])) {
    header('Location: login.php');
    exit;
}

$siswa_id = $_SESSION['siswa_id'];
$pilihan_1 = $_SESSION['pilihan_1'];
$purlan_2 = $_SESSION['pilihan_2'];

// Ambil semua soal dari Pilihan 1 & Pilihan 2
$stmtSoal1 = $pdo->prepare('SELECT id, jawaban_benar FROM bank_soal WHERE jurusan = ?');
$stmtSoal1->execute([$pilihan_1]);
$soal1 = $stmtSoal1->fetchAll();

$stmtSoal2 = $pdo->prepare('SELECT id, jawaban_benar FROM bank_soal WHERE jurusan = ?');
$stmtSoal2->execute([$purlan_2]);
$soal2 = $stmtSoal2->fetchAll();

$benar_1 = 0;
$total_1 = count($soal1);
$benar_2 = 0;
$total_2 = count($soal2);

// Grading Pilihan 1
foreach ($soal1 as $s) {
    $jawaban_user = $_POST['jawaban_' . $s['id']] ?? '';
    if ($jawaban_user === $s['jawaban_benar']) {
        $benar_1++;
    }
}

// Grading Pilihan 2
foreach ($soal2 as $s) {
    $jawaban_user = $_POST['jawaban_' . $s['id']] ?? '';
    if ($jawaban_user === $s['jawaban_benar']) {
        $benar_2++;
    }
}

// Hitung persentase skor
$skor_1 = ($total_1 > 0) ? round(($benar_1 / $total_1) * 100) : 0;
$skor_2 = ($total_2 > 0) ? round(($benar_2 / $total_2) * 100) : 0;

// REKOMENDASI OTOMATIS: Pilih skor tertinggi di antara pilihan 1 dan pilihan 2.
// Jika skor sama, prioritas diberikan ke Pilihan Pertama (Pilihan 1).
if ($skor_1 >= $skor_2) {
    $rekomendasi = $pilihan_1;
} else {
    $rekomendasi = $purlan_2;
}

// Simpan Hasil Tes ke Database
$stmtInsert = $pdo->prepare('INSERT INTO hasil_tes (calon_siswa_id, skor_pilihan_1, benar_pilihan_1, total_pilihan_1, skor_pilihan_2, benar_pilihan_2, total_pilihan_2, rekomendasi_jurusan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
$stmtInsert->execute([$siswa_id, $skor_1, $benar_1, $total_1, $skor_2, $benar_2, $total_2, $rekomendasi]);

// Update status tes calon siswa
$stmtUpdate = $pdo->prepare("UPDATE calon_siswa SET status_tes = 'Selesai Tes' WHERE id = ?");
$stmtUpdate->execute([$siswa_id]);

// Redirect ke halaman hasil
header('Location: siswa_hasil.php');
exit;
?>
`;

export const ADMIN_INPUT_SISWA_PHP = `<?php
// admin_input_siswa.php - Admin menginput Calon Siswa Baru beserta Pilihan Jurusan
require_once 'config.php';
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] != 'ADMIN') {
    header('Location: login.php');
    exit;
}

$msg = '';
$err = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nisn = trim($_POST['nisn']);
    $nama = trim($_POST['nama']);
    $email = trim($_POST['email']);
    $telepon = trim($_POST['telepon']);
    $pilihan_1 = $_POST['pilihan_1'];
    $pilihan_2 = $_POST['pilihan_2'];
    $tanggal_lahir = $_POST['tanggal_lahir'];
    $jenis_kelamin = $_POST['jenis_kelamin'];
    $password_plain = trim($_POST['password']);

    if ($pilihan_1 === $pilihan_2) {
        $err = 'Error: Pilihan Jurusan 1 dan 2 harus berbeda!';
    } else {
        try {
            $pdo->beginTransaction();

            // 1. Enkripsi Password
            $password_hash = password_hash($password_plain, PASSWORD_BCRYPT);

            // 2. Insert ke tabel users
            $stmtUser = $pdo->prepare('INSERT INTO users (username, nama, email, role, password) VALUES (?, ?, ?, "SISWA", ?)');
            $stmtUser->execute([$nisn, $nama, $email, $password_hash]);
            $user_id = $pdo->lastInsertId();

            // 3. Insert ke tabel calon_siswa
            $stmtSiswa = $pdo->prepare('INSERT INTO calon_siswa (user_id, nisn, nama, email, pilihan_1, pilihan_2, telepon, tanggal_lahir, jenis_kelamin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $stmtSiswa->execute([$user_id, $nisn, $nama, $email, $pilihan_1, $pilihan_2, $telepon, $tanggal_lahir, $jenis_kelamin]);

            $pdo->commit();
            $msg = 'Siswa baru berhasil didaftarkan dan akun telah dibuat!';
        } catch (Exception $e) {
            $pdo->rollBack();
            $err = 'Error: ' . $e->getMessage();
        }
    }
}
?>
`;
