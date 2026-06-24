/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { Role, SiswaProfile, MajorType, AppSettings } from '../types';
import { 
  UserPlus, 
  Trash2, 
  Edit3, 
  Search, 
  X, 
  AlertTriangle, 
  Check, 
  Lock, 
  Phone, 
  Mail, 
  Calendar,
  HeartPulse,
  Pill,
  Activity,
  User,
  Info,
  Upload,
  Download,
  FileText,
  Printer
} from 'lucide-react';

interface SiswaListViewProps {
  role: Role;
  siswaProfiles: SiswaProfile[];
  onAddSiswa: (siswaData: Omit<SiswaProfile, 'id' | 'userId' | 'status'>, passwordPlain: string) => boolean;
  onEditSiswa: (id: string, updatedData: Partial<SiswaProfile>) => void;
  onDeleteSiswa: (id: string) => void;
  settings: AppSettings;
}

export default function SiswaListView({
  role,
  siswaProfiles,
  onAddSiswa,
  onEditSiswa,
  onDeleteSiswa,
  settings,
}: SiswaListViewProps) {
  const isAdmin = role === 'ADMIN';

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [majorFilter, setMajorFilter] = useState<string>('ALL');

  // State for form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [nisn, setNisn] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [choice1, setChoice1] = useState<MajorType>('Layanan Kesehatan');
  const [choice2, setChoice2] = useState<MajorType>('Teknik Farmasi');
  const [birthDate, setBirthDate] = useState('2010-01-01');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [password, setPassword] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Selected student for detail popup modal
  const [selectedSiswaForDetail, setSelectedSiswaForDetail] = useState<SiswaProfile | null>(null);

  // Bulk PDF generation state & handlers
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const loadImage = (url: string): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!url) {
        resolve(null);
        return;
      }
      if (url.startsWith('data:')) {
        resolve(url);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg'));
            return;
          }
        } catch (e) {
          console.error('Failed to convert image to base64', e);
        }
        resolve(null);
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = url;
    });
  };

  const handleDownloadBulkCards = async () => {
    if (filteredSiswa.length === 0) {
      alert('Tidak ada data calon siswa untuk diunduh.');
      return;
    }

    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Pre-load all photo images
      const photos: Record<string, string | null> = {};
      for (const siswa of filteredSiswa) {
        if (siswa.photoUrl) {
          try {
            const base64 = await loadImage(siswa.photoUrl);
            photos[siswa.id] = base64;
          } catch (e) {
            console.error(`Gagal memuat foto untuk siswa ${siswa.name}`, e);
            photos[siswa.id] = null;
          }
        } else {
          photos[siswa.id] = null;
        }
      }

      // Pre-load school logo if it exists
      let logoBase64: string | null = null;
      if (settings.schoolLogoUrl) {
        try {
          logoBase64 = await loadImage(settings.schoolLogoUrl);
        } catch (e) {
          console.error('Gagal memuat logo sekolah', e);
        }
      }

      for (let i = 0; i < filteredSiswa.length; i++) {
        const siswa = filteredSiswa[i];
        const isTop = i % 2 === 0;
        
        // Add page for every odd element starting from 1 (0-indexed)
        if (i > 0 && isTop) {
          doc.addPage();
        }

        const x = 15;
        const y = isTop ? 15 : 150;
        const w = 180;
        const h = 125; // elegant height for A4 split

        // Draw card boundary box (dashed border for cut guidance)
        doc.setLineWidth(0.4);
        doc.setDrawColor(13, 148, 136); // teal color
        doc.setLineDashPattern([4, 3], 0);
        doc.rect(x, y, w, h);
        doc.setLineDashPattern([], 0); // reset to solid

        // Draw header background (soft light teal tint)
        doc.setFillColor(240, 253, 250);
        doc.rect(x + 0.5, y + 0.5, w - 1, 23, 'F');

        // Draw logo
        const x_logo = x + 8;
        const y_logo = y + 5;
        const logo_size = 14;
        if (logoBase64) {
          try {
            doc.addImage(logoBase64, 'JPEG', x_logo, y_logo, logo_size, logo_size);
          } catch (e) {
            // Draw default logo
            doc.setFillColor(13, 148, 136);
            doc.rect(x_logo, y_logo, logo_size, logo_size, 'F');
          }
        } else {
          // Draw default elegant logo
          doc.setFillColor(13, 148, 136);
          doc.rect(x_logo, y_logo, logo_size, logo_size, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(8);
          doc.text('PPDB', x_logo + logo_size / 2, y_logo + logo_size / 2 + 2, { align: 'center' });
        }

        // Header Text
        doc.setTextColor(15, 23, 42); // dark slate
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text('PANITIA PENERIMAAN SISWA BARU', x + 25, y + 8);
        
        doc.setFontSize(13);
        doc.text(settings.schoolName, x + 25, y + 14);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139); // cool gray
        doc.text(settings.schoolAddress || 'Layanan Kesehatan • Teknik Farmasi • Teknologi Lab Medik', x + 25, y + 19);

        // Academic Year
        doc.setTextColor(13, 148, 136); // teal
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('TAHUN AJARAN ' + settings.schoolYear, x + w - 45, y + 10);

        // Header bottom divider line
        doc.setLineWidth(0.7);
        doc.setDrawColor(13, 148, 136);
        doc.line(x, y + 24, x + w, y + 24);

        // Card Title Badge
        doc.setFillColor(240, 253, 250);
        doc.setDrawColor(204, 251, 241);
        doc.setLineWidth(0.3);
        doc.rect(x + w / 2 - 50, y + 28, 100, 7, 'DF');

        doc.setTextColor(13, 148, 136);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text('KARTU PESERTA TES POTENSI AKADEMIK (TPA)', x + w / 2, y + 33, { align: 'center' });

        // Photo Area
        const x_photo = x + 10;
        const y_photo = y + 42;
        const p_w = 30;
        const p_h = 40;

        doc.setDrawColor(203, 213, 225); // gray-300
        doc.setLineWidth(0.3);
        doc.rect(x_photo, y_photo, p_w, p_h);

        const photoBase64 = photos[siswa.id];
        if (photoBase64) {
          try {
            doc.addImage(photoBase64, 'JPEG', x_photo + 0.5, y_photo + 0.5, p_w - 1, p_h - 1);
          } catch (e) {
            // fallback
            doc.setTextColor(148, 163, 184);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(7);
            doc.text('FOTO 3X4', x_photo + p_w / 2, y_photo + p_h / 2, { align: 'center' });
          }
        } else {
          doc.setTextColor(148, 163, 184);
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('FOTO 3X4', x_photo + p_w / 2, y_photo + p_h / 2, { align: 'center' });
        }

        // Student Info Column
        const x_info = x + 48;
        const y_info = y + 45;
        doc.setTextColor(15, 23, 42);

        const infoFields = [
          ['NISN (Username)', ': ' + siswa.nisn],
          ['NAMA CALON SISWA', ': ' + siswa.name.toUpperCase()],
          ['JENIS KELAMIN', ': ' + siswa.gender],
          ['TANGGAL LAHIR', ': ' + siswa.birthDate],
          ['PILIHAN JURUSAN I', ': ' + siswa.choice1],
          ['PILIHAN JURUSAN II', ': ' + siswa.choice2],
          ['STATUS AKUN', ': AKUN AKTIF'],
        ];

        infoFields.forEach((field, fIdx) => {
          const rowY = y_info + (fIdx * 5.8);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.text(field[0], x_info, rowY);
          
          doc.setFont('Helvetica', 'normal');
          if (field[0].includes('NAMA') || field[0].includes('NISN')) {
            doc.setFont('Helvetica', 'bold');
          }
          doc.text(field[1], x_info + 35, rowY);
        });

        // Instructions Section (Left Bottom)
        const y_bottom = y + 88;
        doc.setTextColor(71, 85, 105);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text('Petunjuk Pelaksanaan Ujian:', x + 10, y_bottom);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.text('1. Ujian menggunakan sistem CBT komputer sekolah.', x + 10, y_bottom + 4.5);
        doc.text('2. Gunakan NISN sebagai username dan password akun.', x + 10, y_bottom + 8.5);
        doc.text('3. Pastikan hadir 15 menit sebelum ujian dimulai.', x + 10, y_bottom + 12.5);

        // Signature Section (Right Bottom)
        const x_sig = x + w - 45;
        doc.setTextColor(15, 23, 42);
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text('Ketua Panitia PPDB,', x_sig, y_bottom, { align: 'center' });

        // Signature space
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(settings.schoolPrincipalName || 'Dr. apt. Rian H., M.Si', x_sig, y_bottom + 14, { align: 'center' });
        
        if (settings.schoolPrincipalNip) {
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(100, 116, 139);
          doc.text('NIP. ' + settings.schoolPrincipalNip, x_sig, y_bottom + 18, { align: 'center' });
        }

        // Draw a decorative line separator between top and bottom cards on A4
        if (isTop && i < filteredSiswa.length - 1) {
          doc.setLineWidth(0.2);
          doc.setDrawColor(203, 213, 225);
          doc.setLineDashPattern([2, 5], 0);
          doc.line(5, 141, 205, 141);
          doc.setLineDashPattern([], 0);
        }
      }

      doc.save(`KARTU_PESERTA_MASAL_${settings.schoolName.replace(/\s+/g, '_').toUpperCase()}_${settings.schoolYear.replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error('Gagal mengunduh kartu masal:', error);
      alert('Terjadi kesalahan saat membuat file PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Form error
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // === STATE FOR IMPORT FACILITY ===
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importMethod, setImportMethod] = useState<'paste' | 'file'>('paste');
  const [rawPasteText, setRawPasteText] = useState('');
  const [importResults, setImportResults] = useState<any[]>([]);
  const [defaultPassword, setDefaultPassword] = useState('siswa123');
  const [isImportSuccess, setIsImportSuccess] = useState(false);
  const [importFeedback, setImportFeedback] = useState('');

  // Helper helper to intelligent normalize messy major input strings to proper MajorType enums
  const normalizeMajor = (val: string): MajorType | null => {
    const clean = val.trim().toLowerCase();
    if (clean.includes('layanan') || clean.includes('sehat') || clean.includes('perawat') || clean.includes('health') || clean.includes('lk')) {
      return 'Layanan Kesehatan';
    }
    if (clean.includes('farmasi') || clean.includes('obat') || clean.includes('pharm') || clean.includes('tf')) {
      return 'Teknik Farmasi';
    }
    if (clean.includes('laboratorium') || clean.includes('medik') || clean.includes('lab') || clean.includes('tlm')) {
      return 'Teknologi Laboratorium Medik';
    }
    return null;
  };

  // Plain-text CSV/TSV custom robust parser
  const parseCSVText = (text: string) => {
    if (!text.trim()) return [];
    
    const lines = text.split(/\r?\n/);
    if (lines.length === 0) return [];

    const firstLine = lines[0];
    const isTabSeparated = firstLine.includes('\t');
    const delimiter = isTabSeparated ? '\t' : ',';

    const headers = firstLine.split(delimiter).map(h => h.trim().toLowerCase());
    
    const results = [];
    
    // Check if the first line is header by verifying common keywords
    let startIndex = 1;
    const isFirstLineHeader = headers.some(h => 
      h.includes('nisn') || 
      h.includes('nama') || 
      h.includes('email') || 
      h.includes('pilihan') || 
      h.includes('jurusan')
    );
    
    if (!isFirstLineHeader) {
      startIndex = 0; // First line is data itself
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      let columns: string[] = [];
      if (line.includes('"')) {
        const regex = new RegExp(`\\s*${delimiter === ',' ? ',' : '\\t'}\\s*(?=(?:[^\\"]*\\"[^\\"]*\\")*[^\\"]*$)`, 'g');
        columns = line.split(regex).map(col => col.replace(/^"|"$/g, '').trim());
      } else {
        columns = line.split(delimiter).map(col => col.trim());
      }

      if (columns.length === 0 || (columns.length === 1 && !columns[0])) continue;

      let nisnVal = '';
      let nameVal = '';
      let emailVal = '';
      let phoneVal = '';
      let birthDateVal = '2010-01-01';
      let genderVal: 'Laki-laki' | 'Perempuan' = 'Laki-laki';
      let choice1Val = '';
      let choice2Val = '';
      let passwordVal = '';
      let photoUrlVal = '';

      if (isFirstLineHeader) {
        headers.forEach((h, idx) => {
          const val = columns[idx] || '';
          if (h.includes('nisn')) nisnVal = val;
          else if (h.includes('nama') || h.includes('name')) nameVal = val;
          else if (h.includes('email')) emailVal = val;
          else if (h.includes('telp') || h.includes('telepon') || h.includes('hp') || h.includes('phone')) phoneVal = val;
          else if (h.includes('lahir') || h.includes('tanggal') || h.includes('birth')) birthDateVal = val;
          else if (h.includes('kelamin') || h.includes('gender') || h.includes('sex') || h.includes('jk')) {
            if (val.toLowerCase().startsWith('p') || val.toLowerCase() === 'female' || val.toLowerCase() === 'perempuan' || val.toLowerCase() === 'w') {
              genderVal = 'Perempuan';
            } else {
              genderVal = 'Laki-laki';
            }
          }
          else if (h.includes('pilihan 1') || h.includes('pilihan1') || h.includes('choice1') || h.includes('jurusan 1') || h.includes('pil1')) choice1Val = val;
          else if (h.includes('pilihan 2') || h.includes('pilihan2') || h.includes('choice2') || h.includes('jurusan 2') || h.includes('pil2')) choice2Val = val;
          else if (h.includes('pass') || h.includes('sandi')) passwordVal = val;
          else if (h.includes('foto') || h.includes('photo') || h.includes('gambar') || h.includes('image')) photoUrlVal = val;
        });
      } else {
        // Fallback default index position mapping
        nisnVal = columns[0] || '';
        nameVal = columns[1] || '';
        emailVal = columns[2] || '';
        phoneVal = columns[3] || '';
        birthDateVal = columns[4] || '2010-01-01';
        
        const g = columns[5] || '';
        if (g.toLowerCase().startsWith('p') || g.toLowerCase() === 'female' || g.toLowerCase() === 'perempuan' || g.toLowerCase() === 'w') {
          genderVal = 'Perempuan';
        } else {
          genderVal = 'Laki-laki';
        }

        choice1Val = columns[6] || '';
        choice2Val = columns[7] || '';
        passwordVal = columns[8] || '';
        photoUrlVal = columns[9] || '';
      }

      results.push({
        rawLine: line,
        nisn: nisnVal.replace(/\D/g, ''),
        name: nameVal,
        email: emailVal,
        phone: phoneVal.replace(/\D/g, ''),
        birthDate: birthDateVal,
        gender: genderVal,
        choice1: choice1Val,
        choice2: choice2Val,
        password: passwordVal,
        photoUrl: photoUrlVal,
      });
    }

    return results;
  };

  // Run validation effect
  React.useEffect(() => {
    if (!rawPasteText.trim()) {
      setImportResults([]);
      return;
    }

    const parsed = parseCSVText(rawPasteText);
    const validated = parsed.map(item => {
      const errors: string[] = [];
      
      // Validate NISN
      if (!item.nisn) {
        errors.push('NISN kosong');
      } else if (item.nisn.length < 5 || item.nisn.length > 12) {
        errors.push('NISN harus 5-12 digit');
      } else {
        const isDuplicateDb = siswaProfiles.some(s => s.nisn === item.nisn);
        if (isDuplicateDb) {
          errors.push('NISN sudah terdaftar di database');
        }
      }

      // Validate Name
      if (!item.name) {
        errors.push('Nama kosong');
      }

      // Validate Email
      if (!item.email) {
        errors.push('Email kosong');
      } else if (!item.email.includes('@')) {
        errors.push('Email tidak valid (harus mengandung @)');
      }

      // Validate Phone
      if (!item.phone) {
        errors.push('No HP kosong');
      }

      // Validate choice 1 & 2
      const finalChoice1 = normalizeMajor(item.choice1);
      const finalChoice2 = normalizeMajor(item.choice2);

      if (!finalChoice1) {
        errors.push(`Pilihan 1 "${item.choice1 || '(Kosong)'}" tidak dikenal (Pilih: Layanan Kesehatan / Teknik Farmasi / Teknologi Laboratorium Medik)`);
      }
      if (!finalChoice2) {
        errors.push(`Pilihan 2 "${item.choice2 || '(Kosong)'}" tidak dikenal`);
      }

      if (finalChoice1 && finalChoice2 && finalChoice1 === finalChoice2) {
        errors.push('Pilihan 1 & 2 tidak boleh sama');
      }

      // Birthdate format simple check
      let finalBirthDate = item.birthDate;
      if (!finalBirthDate || !/^\d{4}-\d{2}-\d{2}$/.test(finalBirthDate)) {
        finalBirthDate = '2010-01-01'; // auto fallback
      }

      return {
        ...item,
        choice1: finalChoice1 || 'Layanan Kesehatan',
        choice2: finalChoice2 || 'Teknik Farmasi',
        birthDate: finalBirthDate,
        isValid: errors.length === 0,
        errors
      };
    });

    // Check duplicate NISN inside the imported list itself
    const seenNisns = new Set<string>();
    const finalValidated = validated.map(item => {
      if (item.isValid) {
        if (seenNisns.has(item.nisn)) {
          return {
            ...item,
            isValid: false,
            errors: ['NISN ganda dalam daftar yang di-import']
          };
        }
        seenNisns.add(item.nisn);
      }
      return item;
    });

    setImportResults(finalValidated);
  }, [rawPasteText, siswaProfiles]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Handle Excel files binary parsing
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const ab = event.target?.result as ArrayBuffer;
          const workbook = XLSX.read(new Uint8Array(ab), { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert sheet to 2D array of strings
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          if (rows.length === 0) {
            alert('File Excel kosong atau tidak terbaca.');
            return;
          }

          const csvLines = rows.map(row => {
            return row.map(cell => {
              let cellStr = cell !== null && cell !== undefined ? String(cell) : '';
              if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n') || cellStr.includes('\r')) {
                cellStr = `"${cellStr.replace(/"/g, '""')}"`;
              }
              return cellStr;
            }).join(',');
          });

          setRawPasteText(csvLines.join('\n'));
          setImportMethod('paste');
        } catch (err) {
          alert('Gagal membaca file Excel. Pastikan file tidak terkunci atau rusak.');
          console.error(err);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Handle JSON / CSV / Text files
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          if (fileExtension === 'json' || file.type === 'application/json') {
            try {
              const data = JSON.parse(text);
              const arrayData = Array.isArray(data) ? data : (data.siswa || data.data || []);
              if (Array.isArray(arrayData)) {
                const formattedText = arrayData.map((s: any) => {
                  return `${s.nisn || s.username || ''},${s.name || ''},${s.email || ''},${s.phone || s.telepon || ''},${s.birthDate || s.tanggal_lahir || '2010-01-01'},${s.gender || 'Laki-laki'},${s.choice1 || s.pilihan1 || ''},${s.choice2 || s.pilihan2 || ''},${s.password || ''}`;
                }).join('\n');
                const headerLine = "nisn,nama,email,phone,birthDate,gender,choice1,choice2,password";
                setRawPasteText(headerLine + "\n" + formattedText);
                setImportMethod('paste');
              } else {
                alert('JSON harus berupa Array data siswa.');
              }
            } catch (err) {
              alert('Format file JSON tidak valid.');
            }
          } else {
            // Plain Text CSV/TSV
            setRawPasteText(text);
            setImportMethod('paste');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExecuteImport = () => {
    const validRows = importResults.filter(r => r.isValid);
    if (validRows.length === 0) {
      alert('Tidak ada data calon siswa yang valid untuk diimpor.');
      return;
    }

    let successCount = 0;
    validRows.forEach(row => {
      const plainPass = row.password || defaultPassword || 'siswa123';
      const success = onAddSiswa({
        nisn: row.nisn,
        name: row.name,
        email: row.email,
        phone: row.phone,
        choice1: row.choice1,
        choice2: row.choice2,
        birthDate: row.birthDate,
        gender: row.gender,
        photoUrl: row.photoUrl || '',
      }, plainPass);

      if (success) {
        successCount++;
      }
    });

    setImportFeedback(`Berhasil mengimpor ${successCount} dari ${validRows.length} calon siswa baru ke database! Akun login siswa otomatis aktif.`);
    setIsImportSuccess(true);
    setRawPasteText('');
    setImportResults([]);

    setTimeout(() => {
      setIsImportModalOpen(false);
      setIsImportSuccess(false);
      setImportFeedback('');
    }, 3500);
  };

  // Reset Form
  const resetForm = () => {
    setNisn('');
    setName('');
    setEmail('');
    setPhone('');
    setChoice1('Layanan Kesehatan');
    setChoice2('Teknik Farmasi');
    setBirthDate('2010-01-01');
    setGender('Laki-laki');
    setPassword('siswa'); // default simple password
    setPhotoUrl('');
    setErrorMsg('');
    setEditingId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (siswa: SiswaProfile) => {
    resetForm();
    setIsEditing(true);
    setEditingId(siswa.id);
    setNisn(siswa.nisn);
    setName(siswa.name);
    setEmail(siswa.email);
    setPhone(siswa.phone);
    setChoice1(siswa.choice1);
    setChoice2(siswa.choice2);
    setBirthDate(siswa.birthDate);
    setGender(siswa.gender);
    setPhotoUrl(siswa.photoUrl || '');
    setPassword(''); // leave blank during edit unless change is needed
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (choice1 === choice2) {
      setErrorMsg('Pilihan 1 dan Pilihan 2 tidak boleh sama! Calon siswa wajib memilih 2 jurusan yang berbeda.');
      return;
    }

    if (!nisn || !name || !email || !phone) {
      setErrorMsg('Harap isi semua kolom identitas calon siswa.');
      return;
    }

    if (isEditing && editingId) {
      // Edit mode
      onEditSiswa(editingId, {
        nisn,
        name,
        email,
        phone,
        choice1,
        choice2,
        birthDate,
        gender,
        photoUrl
      });
      setSuccessMsg('Profil calon siswa berhasil diperbarui!');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
      }, 1000);
    } else {
      // Add mode
      if (!password) {
        setErrorMsg('Kata sandi wajib diisi untuk pembuatan akun.');
        return;
      }
      
      const success = onAddSiswa({
        nisn,
        name,
        email,
        phone,
        choice1,
        choice2,
        birthDate,
        gender,
        photoUrl
      }, password);

      if (success) {
        setSuccessMsg('Calon siswa berhasil terdaftar dan akun berhasil dibuat!');
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg('');
        }, 1200);
      } else {
        setErrorMsg('NISN sudah terdaftar. Harap gunakan NISN lain.');
      }
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus calon siswa "${name}"? Tindakan ini juga akan menghapus hasil tes miliknya jika ada.`)) {
      onDeleteSiswa(id);
    }
  };

  // Filter and search students
  const filteredSiswa = siswaProfiles.filter(siswa => {
    const matchesSearch = 
      siswa.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      siswa.nisn.includes(searchTerm) ||
      siswa.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || siswa.status === statusFilter;
    
    const matchesMajor = majorFilter === 'ALL' || 
      siswa.choice1 === majorFilter || 
      siswa.choice2 === majorFilter;

    return matchesSearch && matchesStatus && matchesMajor;
  });

  return (
    <div className="space-y-6" id="siswa-list-root">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Daftar Calon Siswa Baru</h1>
          <p className="text-gray-500 text-sm">Kelola data identitas calon siswa baru dan pembuatan akun TPA.</p>
        </div>
        
        {isAdmin && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setRawPasteText('');
                setImportResults([]);
                setIsImportModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-white border border-teal-600 hover:bg-teal-50 text-teal-700 font-bold px-4 py-2.5 rounded-xl shadow-sm text-sm transition"
              id="btn-import-siswa"
            >
              <Upload size={16} />
              Import Calon Siswa (CSV/Excel)
            </button>
            <button
              onClick={handleDownloadBulkCards}
              disabled={isGeneratingPdf || filteredSiswa.length === 0}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-md text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              id="btn-download-bulk-pdf"
            >
              {isGeneratingPdf ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" />
                  Memproses PDF...
                </>
              ) : (
                <>
                  <Printer size={16} />
                  Cetak Kartu Tes Masal ({filteredSiswa.length})
                </>
              )}
            </button>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2.5 rounded-xl border border-gray-250 text-sm transition"
              id="btn-add-siswa"
            >
              <UserPlus size={16} />
              Input Calon Siswa Baru
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-gray-150 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama, email, atau NISN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="ALL">Semua Status Tes</option>
            <option value="Belum Tes">Belum Tes</option>
            <option value="Sedang Tes">Sedang Tes</option>
            <option value="Selesai Tes">Selesai Tes</option>
          </select>
        </div>

        {/* Major Filter */}
        <div className="w-full md:w-56">
          <select
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="ALL">Semua Pilihan Jurusan</option>
            <option value="Layanan Kesehatan">Layanan Kesehatan</option>
            <option value="Teknik Farmasi">Teknik Farmasi</option>
            <option value="Teknologi Laboratorium Medik">Teknologi Laboratorium Medik</option>
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="rounded-xl border border-gray-150 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {filteredSiswa.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-400">
              Tidak ada data calon siswa yang cocok dengan filter pencarian.
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Siswa (NISN)</th>
                  <th className="px-6 py-4">Kontak / TTL</th>
                  <th className="px-6 py-4">Jurusan Pilihan 1</th>
                  <th className="px-6 py-4">Jurusan Pilihan 2</th>
                  <th className="px-6 py-4">Status</th>
                  {isAdmin && <th className="px-6 py-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSiswa.map((siswa) => (
                  <tr key={siswa.id} className="hover:bg-gray-50/70 transition">
                    {/* Name & NISN */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-10 w-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 hover:ring-teal-500/20 transition-all shadow-sm shrink-0"
                          onClick={() => setSelectedSiswaForDetail(siswa)}
                          title="Klik untuk melihat kartu peserta"
                        >
                          {siswa.photoUrl ? (
                            <img src={siswa.photoUrl} alt={siswa.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <User size={18} className="text-teal-500" />
                          )}
                        </div>
                        <div>
                          <div 
                            className="font-bold text-gray-900 text-sm hover:text-teal-700 cursor-pointer hover:underline transition"
                            onClick={() => setSelectedSiswaForDetail(siswa)}
                            title="Klik untuk melihat detail"
                          >
                            {siswa.name}
                          </div>
                          <div className="font-mono text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider text-gray-500">NISN: {siswa.nisn}</span>
                            <span className="text-gray-300">|</span>
                            <span>{siswa.gender}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact & Birth Details */}
                    <td className="px-6 py-4 text-xs">
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className="text-gray-400" />
                          <span>{siswa.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-gray-400" />
                          <span>{siswa.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-gray-400" />
                          <span>{siswa.birthDate}</span>
                        </div>
                      </div>
                    </td>

                    {/* Major Choice 1 */}
                    <td className="px-6 py-4 text-xs font-semibold text-gray-800">
                      <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1">
                        {siswa.choice1 === 'Layanan Kesehatan' && <HeartPulse size={12} className="text-rose-500" />}
                        {siswa.choice1 === 'Teknik Farmasi' && <Pill size={12} className="text-purple-500" />}
                        {siswa.choice1 === 'Teknologi Laboratorium Medik' && <Activity size={12} className="text-teal-500" />}
                        {siswa.choice1}
                      </span>
                    </td>

                    {/* Major Choice 2 */}
                    <td className="px-6 py-4 text-xs font-semibold text-gray-800">
                      <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1">
                        {siswa.choice2 === 'Layanan Kesehatan' && <HeartPulse size={12} className="text-rose-500" />}
                        {siswa.choice2 === 'Teknik Farmasi' && <Pill size={12} className="text-purple-500" />}
                        {siswa.choice2 === 'Teknologi Laboratorium Medik' && <Activity size={12} className="text-teal-500" />}
                        {siswa.choice2}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-xs">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        siswa.status === 'Selesai Tes' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        siswa.status === 'Sedang Tes' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          siswa.status === 'Selesai Tes' ? 'bg-emerald-500' :
                          siswa.status === 'Sedang Tes' ? 'bg-blue-500' : 'bg-amber-500'
                        }`} />
                        {siswa.status}
                      </span>
                    </td>

                    {/* Actions */}
                    {isAdmin && (
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(siswa)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-teal-600 hover:bg-teal-50 transition"
                            title="Edit Calon Siswa"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(siswa.id, siswa.name)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                            title="Hapus Calon Siswa"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="border-b border-gray-150 px-6 py-4 flex items-center justify-between bg-gray-50">
              <h3 className="text-base font-bold text-gray-900">
                {isEditing ? 'Ubah Profil Calon Siswa' : 'Input Calon Siswa Baru & Buat Akun'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm flex items-start gap-2.5">
                  <AlertTriangle className="shrink-0 mt-0.5 text-red-600" size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl text-sm flex items-start gap-2.5">
                  <Check className="shrink-0 mt-0.5 text-emerald-600" size={18} />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Foto Siswa Upload & Preview */}
                <div className="md:col-span-2 bg-gray-50 border border-gray-150 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="h-20 w-20 rounded-xl bg-teal-50 border border-gray-200 text-teal-600 flex items-center justify-center font-bold overflow-hidden shrink-0 relative shadow-inner">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Foto Pratinjau" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={32} className="text-teal-500" />
                    )}
                  </div>
                  <div className="space-y-2 flex-1 text-center sm:text-left w-full">
                    <label className="block text-xs font-bold text-gray-800">Foto Calon Siswa (Foto Formal)</label>
                    <p className="text-[10px] text-gray-500">Mendukung format PNG, JPG, atau JPEG. Ukuran ideal rasio 3:4 atau 1:1.</p>
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <label className="bg-white border border-gray-200 hover:border-teal-500 hover:text-teal-600 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-gray-700 cursor-pointer transition flex items-center gap-1.5">
                        <Upload size={12} />
                        Unggah Foto...
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  setPhotoUrl(ev.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      
                      {photoUrl && (
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="bg-white border border-rose-200 hover:border-rose-500 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Trash2 size={12} />
                          Hapus Foto
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* NISN */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">NISN (Sekaligus Username Akun)</label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    placeholder="Masukkan NISN siswa"
                    value={nisn}
                    disabled={isEditing}
                    onChange={(e) => setNisn(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  {!isEditing && <p className="text-[10px] text-gray-400 mt-1">NISN akan digunakan siswa untuk masuk ke sistem.</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isEditing ? 'Password Akun (Kosongkan jika tidak diubah)' : 'Password Akun Calon Siswa'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder={isEditing ? 'Biarkan kosong' : 'Masukkan password login'}
                      required={!isEditing}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap sesuai ijazah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Email Aktif</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">No. Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 08123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Laki-laki' | 'Perempuan')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                {/* Choices Warning Info */}
                <div className="md:col-span-2 bg-teal-50 border border-teal-100 rounded-xl p-3 text-xs text-teal-800 flex items-start gap-2">
                  <Info className="shrink-0 mt-0.5 text-teal-600" size={16} />
                  <div>
                    <span className="font-bold">Ketentuan Pemilihan Jurusan:</span> Calon siswa wajib memilih 2 pilihan jurusan yang berbeda di SMK Kesehatan Nusantara untuk kebutuhan evaluasi rekomendasi minat otomatis.
                  </div>
                </div>

                {/* Choice 1 */}
                <div>
                  <label className="block text-xs font-semibold text-teal-800 mb-1">Jurusan Pilihan Pertama (Utama)</label>
                  <select
                    value={choice1}
                    onChange={(e) => setChoice1(e.target.value as MajorType)}
                    className="w-full px-3 py-2 border border-teal-200 bg-teal-50/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Layanan Kesehatan">Layanan Kesehatan</option>
                    <option value="Teknik Farmasi">Teknik Farmasi</option>
                    <option value="Teknologi Laboratorium Medik">Teknologi Laboratorium Medik</option>
                  </select>
                </div>

                {/* Choice 2 */}
                <div>
                  <label className="block text-xs font-semibold text-teal-800 mb-1">Jurusan Pilihan Kedua (Cadangan)</label>
                  <select
                    value={choice2}
                    onChange={(e) => setChoice2(e.target.value as MajorType)}
                    className="w-full px-3 py-2 border border-teal-200 bg-teal-50/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Layanan Kesehatan">Layanan Kesehatan</option>
                    <option value="Teknik Farmasi">Teknik Farmasi</option>
                    <option value="Teknologi Laboratorium Medik">Teknologi Laboratorium Medik</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-gray-150 flex items-center justify-end gap-3 bg-white mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-150 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Daftarkan & Buat Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-150 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="border-b border-gray-150 px-6 py-4 flex items-center justify-between bg-teal-50">
              <div className="flex items-center gap-2">
                <Upload className="text-teal-600 animate-bounce" size={20} />
                <h3 className="text-base font-bold text-gray-900">
                  Import Calon Siswa Baru Secara Kolektif
                </h3>
              </div>
              <button 
                onClick={() => setIsImportModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs / Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Feedback Alert */}
              {isImportSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm flex items-start gap-3 shadow-inner">
                  <Check className="shrink-0 mt-0.5 text-emerald-600 bg-emerald-100 rounded-full p-0.5" size={20} />
                  <div>
                    <span className="font-bold block mb-0.5">Import Berhasil Selesai!</span>
                    <p className="text-xs text-emerald-700">{importFeedback}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left side: Guide & Input Panel */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 text-xs space-y-3">
                    <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <Info size={14} className="text-teal-600" />
                      Petunjuk Format Data
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      Sistem mendukung upload langsung file <strong>Microsoft Excel (.xlsx, .xls)</strong> atau file teks format <strong>CSV (koma / tab separated)</strong>, serta copy-paste baris sel spreadsheet.
                    </p>
                    
                    <div className="space-y-1.5">
                      <span className="font-semibold text-gray-800 block">Urutan kolom template:</span>
                      <code className="block bg-gray-100 border border-gray-200 p-2 rounded text-[10px] font-mono text-gray-700 overflow-x-auto whitespace-nowrap">
                        NISN,Nama,Email,No Telepon,Tanggal Lahir,Jenis Kelamin,Pilihan 1,Pilihan 2,Password
                      </code>
                    </div>

                    <div className="space-y-1 text-gray-500">
                      <p>• <strong>Tanggal Lahir:</strong> Gunakan format <code className="bg-gray-100 px-1 rounded font-mono">YYYY-MM-DD</code> (contoh: 2010-06-25).</p>
                      <p>• <strong>Jenis Kelamin:</strong> Laki-laki atau Perempuan.</p>
                      <p>• <strong>Pilihan Jurusan:</strong> Harus diisi salah satu dari: <code className="text-[10px] font-semibold">Layanan Kesehatan</code>, <code className="text-[10px] font-semibold">Teknik Farmasi</code>, atau <code className="text-[10px] font-semibold">Teknologi Laboratorium Medik</code>.</p>
                      <p>• <strong>Password:</strong> Boleh dikosongkan (akan menggunakan password default di bawah).</p>
                    </div>

                    {/* Download Sample Excel */}
                    <div className="pt-1 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const wsData = [
                            ["nisn", "nama", "email", "phone", "birthDate", "gender", "choice1", "choice2", "password"],
                            ["202611", "Budi Santoso", "budi@email.com", "08129999999", "2010-02-15", "Laki-laki", "Layanan Kesehatan", "Teknik Farmasi", "budi123"],
                            ["202612", "Siti Aminah", "siti@email.com", "08128888888", "2010-08-20", "Perempuan", "Teknik Farmasi", "Teknologi Laboratorium Medik", "siti123"]
                          ];
                          const ws = XLSX.utils.aoa_to_sheet(wsData);
                          const wb = XLSX.utils.book_new();
                          XLSX.utils.book_append_sheet(wb, ws, "Template PMB");
                          XLSX.writeFile(wb, "template_import_calon_siswa.xlsx");
                        }}
                        className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-900 font-bold hover:underline self-start text-xs"
                      >
                        <Download size={13} className="text-teal-600" />
                        Unduh Template Excel (.xlsx)
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          const csvContent = "data:text/csv;charset=utf-8,nisn,nama,email,phone,birthDate,gender,choice1,choice2,password\n202611,Budi Santoso,budi@email.com,08129999999,2010-02-15,Laki-laki,Layanan Kesehatan,Teknik Farmasi,budi123\n202612,Siti Aminah,siti@email.com,08128888888,2010-08-20,Perempuan,Teknik Farmasi,Teknologi Laboratorium Medik,siti123";
                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encodedUri);
                          link.setAttribute("download", "template_import_tpa_siswa.csv");
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-900 font-bold hover:underline self-start text-[11px]"
                      >
                        <Download size={12} />
                        Unduh Alternatif Format CSV (.csv)
                      </button>
                    </div>
                  </div>

                  {/* Fallback settings */}
                  <div className="bg-white border border-gray-150 rounded-xl p-4 space-y-3">
                    <label className="block text-xs font-semibold text-gray-700">Password Akun Default (jika dikosongkan)</label>
                    <input
                      type="text"
                      value={defaultPassword}
                      onChange={(e) => setDefaultPassword(e.target.value)}
                      placeholder="siswa123"
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                    <p className="text-[10px] text-gray-400">Digunakan sebagai password login bawaan jika kolom password di data import dikosongkan.</p>
                  </div>

                  {/* Drag and Drop/File Upload Panel */}
                  <div className="border border-dashed border-gray-200 hover:border-teal-400 bg-gray-50/50 rounded-xl p-4 flex flex-col items-center justify-center text-center transition">
                    <FileText className="text-gray-400 mb-2" size={24} />
                    <span className="text-xs font-semibold text-gray-700 block">Atau unggah file Excel / CSV / JSON</span>
                    <span className="text-[10px] text-gray-400 mb-3 block">Mendukung .xlsx, .xls, .csv, .json, .txt</span>
                    <label className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-gray-700 cursor-pointer transition">
                      Pilih File Excel...
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv,.txt,.json"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Right side: Paste Area & Realtime Live Preview Table */}
                <div className="lg:col-span-7 flex flex-col space-y-4">
                  <div className="space-y-1.5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gray-800">Area Paste Data (Salin Sel Excel / Isi CSV)</label>
                      {importResults.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setRawPasteText('')}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                        >
                          Bersihkan Teks
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={5}
                      value={rawPasteText}
                      onChange={(e) => setRawPasteText(e.target.value)}
                      placeholder="Contoh:&#10;202611,Budi Santoso,budi@email.com,08129999999,2010-02-15,Laki-laki,Layanan Kesehatan,Teknik Farmasi&#10;202612,Siti Aminah,siti@email.com,08128888888,2010-08-20,Perempuan,Teknik Farmasi,Teknologi Laboratorium Medik"
                      className="w-full p-3 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 flex-1 min-h-[140px] bg-gray-50/20"
                    />
                  </div>

                  {/* Summary Stats Badge */}
                  {importResults.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs font-semibold text-gray-700">
                      <span>Total baris terdeteksi: <strong className="text-gray-900">{importResults.length}</strong></span>
                      <span className="text-gray-300">|</span>
                      <span className="text-emerald-700">Valid & Siap: <strong>{importResults.filter(r => r.isValid).length}</strong></span>
                      <span className="text-gray-300">|</span>
                      <span className="text-rose-600">Gagal / Dilewati: <strong>{importResults.filter(r => !r.isValid).length}</strong></span>
                    </div>
                  )}

                  {/* Real-time Preview Table Panel */}
                  <div className="flex-1 flex flex-col overflow-hidden border border-gray-150 rounded-xl bg-white max-h-[250px]">
                    <div className="bg-gray-50 border-b border-gray-150 px-4 py-2 flex items-center justify-between shrink-0">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Live Preview Validasi</span>
                      <span className="text-[10px] text-gray-400">Menganalisa data secara real-time</span>
                    </div>
                    
                    <div className="overflow-y-auto flex-1">
                      {importResults.length === 0 ? (
                        <div className="p-8 text-center text-xs text-gray-400 leading-relaxed">
                          Belum ada data untuk ditampilkan. Salin baris tabel dari Excel Anda lalu tempelkan pada area teks di atas.
                        </div>
                      ) : (
                        <table className="w-full text-left text-xs text-gray-600">
                          <thead className="bg-gray-50 text-gray-500 font-bold sticky top-0 border-b border-gray-100">
                            <tr>
                              <th className="px-3 py-2">Status</th>
                              <th className="px-3 py-2">Siswa (NISN)</th>
                              <th className="px-3 py-2">Pilihan 1 & 2</th>
                              <th className="px-3 py-2">Keterangan / Kesalahan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium">
                            {importResults.map((item, index) => (
                              <tr key={index} className={`hover:bg-gray-50/50 ${item.isValid ? '' : 'bg-rose-50/20'}`}>
                                <td className="px-3 py-2">
                                  {item.isValid ? (
                                    <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 rounded px-1.5 py-0.5 text-[9px] font-bold border border-emerald-100">
                                      ✓ Valid
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-0.5 bg-rose-50 text-rose-700 rounded px-1.5 py-0.5 text-[9px] font-bold border border-rose-100">
                                      ✗ Gagal
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2">
                                  <div className="font-bold text-gray-900">{item.name || '(Nama Kosong)'}</div>
                                  <div className="text-[10px] font-mono text-gray-400">NISN: {item.nisn || '(Kosong)'} | {item.gender}</div>
                                </td>
                                <td className="px-3 py-2 text-[10px] leading-tight">
                                  <div className="text-teal-700 font-semibold">1: {item.choice1}</div>
                                  <div className="text-purple-700 font-semibold">2: {item.choice2}</div>
                                </td>
                                <td className="px-3 py-2">
                                  {item.isValid ? (
                                    <span className="text-[10px] text-gray-500">Siap di-import</span>
                                  ) : (
                                    <div className="text-[10px] text-rose-600 space-y-0.5 font-bold">
                                      {item.errors.map((err: string, eIdx: number) => (
                                        <div key={eIdx}>• {err}</div>
                                      ))}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-150 px-6 py-4 flex items-center justify-between bg-gray-50 shrink-0">
              <span className="text-[11px] text-gray-400 italic">
                *Hanya baris dengan status "Valid" yang akan ditambahkan ke database calon siswa.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-150 hover:bg-gray-200 rounded-xl transition"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleExecuteImport}
                  disabled={importResults.filter(r => r.isValid).length === 0}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/10 transition animate-pulse"
                >
                  <Check size={14} />
                  Eksekusi Import ({importResults.filter(r => r.isValid).length} Siswa)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Detail Siswa / Kartu Peserta Modal */}
      {selectedSiswaForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 print:p-0 print:static print:bg-white">
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #kartu-peserta-print, #kartu-peserta-print * {
                visibility: visible !important;
              }
              #kartu-peserta-print {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                border: 2px solid #000D !important;
                border-radius: 0 !important;
                padding: 32px !important;
                background: white !important;
                box-shadow: none !important;
              }
            }
          `}</style>
          
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-150 overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:border-none print:max-h-full print:w-full print:rounded-none">
            {/* Modal Header */}
            <div className="border-b border-gray-150 px-6 py-4 flex items-center justify-between bg-gray-50 print:hidden shrink-0">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span>Kartu Ujian & Detail Calon Siswa</span>
              </h3>
              <button 
                onClick={() => setSelectedSiswaForDetail(null)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content - Printable Area */}
            <div className="overflow-y-auto p-6 space-y-6 flex-1 print:p-0 print:overflow-visible">
              
              {/* Kartu Peserta Badge Card */}
              <div id="kartu-peserta-print" className="border-2 border-dashed border-teal-600 rounded-2xl p-6 bg-gradient-to-br from-teal-50/20 to-white relative overflow-hidden print:border-2 print:border-solid print:border-black print:rounded-none print:p-8">
                {/* School Watermark background accent */}
                <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-10 translate-y-10 print:hidden">
                  <HeartPulse size={240} className="text-teal-600" />
                </div>

                {/* Card Header */}
                <div className="flex items-center justify-between border-b-2 border-teal-600 pb-4 mb-6">
                  <div className="flex items-center gap-3 font-sans">
                    <div className="h-12 w-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md overflow-hidden">
                      {settings.schoolLogoUrl ? (
                        <img src={settings.schoolLogoUrl} alt="Logo" className="h-full w-full object-contain p-1 bg-white" referrerPolicy="no-referrer" />
                      ) : (
                        <HeartPulse size={28} />
                      )}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-teal-800 uppercase tracking-widest leading-none">Panitia Penerimaan Siswa Baru</h4>
                      <h2 className="text-base font-black text-gray-900 tracking-tight mt-1 leading-none">{settings.schoolName}</h2>
                      <p className="text-[9px] text-gray-400 mt-1">{settings.schoolAddress || 'Layanan Kesehatan • Teknik Farmasi • Teknologi Lab Medik'}</p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-gray-400 font-mono hidden sm:block print:block">
                    <div>TAHUN AJARAN</div>
                    <div className="font-bold text-teal-700 text-sm">{settings.schoolYear}</div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <span className="bg-teal-100/50 border border-teal-200 text-teal-800 text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full print:border print:border-black">
                    KARTU PESERTA TES POTENSI AKADEMIK (TPA)
                  </span>
                </div>

                {/* Card Body Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                  
                  {/* Foto Profil Area */}
                  <div className="flex flex-col items-center justify-center gap-3 md:col-span-1 mx-auto">
                    <div className="h-40 w-32 rounded-xl border border-gray-300 bg-gray-50 flex flex-col items-center justify-center font-bold overflow-hidden shadow-md print:border-black print:rounded-none relative">
                      {selectedSiswaForDetail.photoUrl ? (
                        <img 
                          src={selectedSiswaForDetail.photoUrl} 
                          alt={selectedSiswaForDetail.name} 
                          className="h-full w-full object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                      ) : (
                        <div className="text-center p-2 text-gray-400">
                          <User size={48} className="mx-auto mb-2 text-gray-300" />
                          <span className="text-[9px] font-bold">BELUM ADA FOTO</span>
                        </div>
                      )}
                      
                      {/* Photo overlay label */}
                      <div className="absolute bottom-0 left-0 right-0 bg-teal-600 text-white text-[8px] font-bold text-center py-1 uppercase tracking-wider print:hidden">
                        PAS FOTO 3X4
                      </div>
                    </div>
                  </div>

                  {/* Student Details List Table */}
                  <div className="md:col-span-3 space-y-4 w-full">
                    <table className="w-full text-xs sm:text-sm font-medium">
                      <tbody>
                        <tr className="border-b border-gray-100 py-2">
                          <td className="text-gray-400 text-xs py-2 w-32 uppercase">NISN (USERNAME)</td>
                          <td className="text-gray-900 font-bold py-2 font-mono">: {selectedSiswaForDetail.nisn}</td>
                        </tr>
                        <tr className="border-b border-gray-100 py-2">
                          <td className="text-gray-400 text-xs py-2 uppercase">NAMA LENGKAP</td>
                          <td className="text-gray-900 font-extrabold py-2 text-sm uppercase">: {selectedSiswaForDetail.name}</td>
                        </tr>
                        <tr className="border-b border-gray-100 py-2">
                          <td className="text-gray-400 text-xs py-2 uppercase">JENIS KELAMIN</td>
                          <td className="text-gray-900 py-2">: {selectedSiswaForDetail.gender}</td>
                        </tr>
                        <tr className="border-b border-gray-100 py-2">
                          <td className="text-gray-400 text-xs py-2 uppercase">TANGGAL LAHIR</td>
                          <td className="text-gray-900 py-2">: {selectedSiswaForDetail.birthDate}</td>
                        </tr>
                        <tr className="border-b border-gray-100 py-2">
                          <td className="text-gray-400 text-xs py-2 uppercase">PILIHAN JURUSAN I</td>
                          <td className="text-teal-700 font-bold py-2">: {selectedSiswaForDetail.choice1}</td>
                        </tr>
                        <tr className="border-b border-gray-100 py-2">
                          <td className="text-gray-400 text-xs py-2 uppercase">PILIHAN JURUSAN II</td>
                          <td className="text-purple-700 font-bold py-2">: {selectedSiswaForDetail.choice2}</td>
                        </tr>
                        <tr className="border-b border-gray-100 py-2">
                          <td className="text-gray-400 text-xs py-2 uppercase">STATUS UJIAN TPA</td>
                          <td className="py-2">
                            <span className="font-bold">: </span>
                            <span className={`inline-flex items-center gap-1 font-bold ${
                              selectedSiswaForDetail.status === 'Selesai Tes' ? 'text-emerald-600' :
                              selectedSiswaForDetail.status === 'Sedang Tes' ? 'text-blue-600' : 'text-amber-600'
                            }`}>
                              {selectedSiswaForDetail.status}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Footer and Signatures */}
                <div className="mt-8 pt-6 border-t border-teal-100 flex flex-col sm:flex-row justify-between items-start sm:items-end text-xs print:border-black print:flex-row print:justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-gray-800">Petunjuk Pelaksanaan Ujian:</div>
                    <ul className="list-disc pl-4 text-[10px] text-gray-500 space-y-0.5 max-w-sm">
                      <li>Ujian menggunakan sistem Tes Potensi Akademik Berbasis Komputer (CBT).</li>
                      <li>Login menggunakan NISN sebagai username dan password default dari panitia.</li>
                      <li>Tes mencakup materi kompetensi dasar dari kedua jurusan pilihan.</li>
                    </ul>
                  </div>
                  
                  <div className="text-center w-40 space-y-10 shrink-0 mt-4 sm:mt-0 print:mt-0">
                    <div>
                      <p className="text-[10px] text-gray-400 leading-none">Ketua Panitia PPDB,</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 underline leading-none">{settings.schoolPrincipalName || 'Dr. apt. Rian H., M.Si'}</p>
                      {settings.schoolPrincipalNip && (
                        <p className="text-[9px] text-gray-400 mt-1 leading-none">NIP. {settings.schoolPrincipalNip}</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Informational Warning Print Instructions */}
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3.5 text-xs flex items-start gap-2.5 print:hidden">
                <Info size={16} className="shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <span className="font-bold">Tips Mencetak:</span> Gunakan tombol cetak di bawah ini. Pastikan untuk mengaktifkan opsi "Background Graphics" pada setelan browser Anda agar warna kartu tercetak dengan sempurna.
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-150 px-6 py-4 flex items-center justify-end gap-3 bg-gray-50 print:hidden shrink-0">
              <button
                type="button"
                onClick={() => setSelectedSiswaForDetail(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-150 hover:bg-gray-200 rounded-xl transition"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/10 transition"
              >
                <Printer size={14} />
                Cetak Kartu Peserta
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
