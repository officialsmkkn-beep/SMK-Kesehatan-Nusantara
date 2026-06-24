/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Role, 
  User, 
  SiswaProfile, 
  Question, 
  TestResult, 
  AppSettings, 
  MajorType 
} from './types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_USERS, 
  INITIAL_SISWA_PROFILES, 
  INITIAL_QUESTIONS, 
  INITIAL_TEST_RESULTS 
} from './data';

import DashboardView from './components/DashboardView';
import SiswaListView from './components/SiswaListView';
import BankSoalView from './components/BankSoalView';
import HasilTesView from './components/HasilTesView';
import PhpMysqlGuideView from './components/PhpMysqlGuideView';
import SettingsView from './components/SettingsView';

import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  Settings, 
  Server, 
  LogOut, 
  Building, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Compass,
  UserCheck
} from 'lucide-react';

export default function App() {
  // === STATE STORAGE & INITIAL SEEDING ===
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('tpa_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('tpa_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [siswaProfiles, setSiswaProfiles] = useState<SiswaProfile[]>(() => {
    const saved = localStorage.getItem('tpa_siswa_profiles');
    return saved ? JSON.parse(saved) : INITIAL_SISWA_PROFILES;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('tpa_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [testResults, setTestResults] = useState<TestResult[]>(() => {
    const saved = localStorage.getItem('tpa_test_results');
    return saved ? JSON.parse(saved) : INITIAL_TEST_RESULTS;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('tpa_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('tpa_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('tpa_siswa_profiles', JSON.stringify(siswaProfiles));
  }, [siswaProfiles]);

  useEffect(() => {
    localStorage.setItem('tpa_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('tpa_test_results', JSON.stringify(testResults));
  }, [testResults]);


  // === AUTHENTICATION STATE ===
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Default to admin for fast demo evaluation out-of-the-box
    return INITIAL_USERS[0];
  });
  
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Current logged in student profile helper
  const [currentSiswa, setCurrentSiswa] = useState<SiswaProfile | null>(null);

  useEffect(() => {
    if (currentUser && currentUser.role === 'SISWA') {
      const profile = siswaProfiles.find(s => s.nisn === currentUser.username);
      setCurrentSiswa(profile || null);
    } else {
      setCurrentSiswa(null);
    }
  }, [currentUser, siswaProfiles]);


  // === APP VIEW STATE ===
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SISWA' | 'SOAL' | 'HASIL' | 'PHP_MYSQL' | 'SETTINGS'>('DASHBOARD');


  // === ACTIVE EXAM STATE ===
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [testSecondsRemaining, setTestSecondsRemaining] = useState(0);

  // Countdown timer for active test
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTakingTest && testSecondsRemaining > 0) {
      timer = setInterval(() => {
        setTestSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTakingTest, testSecondsRemaining]);


  // === CORE HANDLERS ===

  // Reset database back to default initial seed data
  const handleResetData = () => {
    localStorage.removeItem('tpa_settings');
    localStorage.removeItem('tpa_users');
    localStorage.removeItem('tpa_siswa_profiles');
    localStorage.removeItem('tpa_questions');
    localStorage.removeItem('tpa_test_results');
    setSettings(INITIAL_SETTINGS);
    setUsers(INITIAL_USERS);
    setSiswaProfiles(INITIAL_SISWA_PROFILES);
    setQuestions(INITIAL_QUESTIONS);
    setTestResults(INITIAL_TEST_RESULTS);
    setCurrentUser(INITIAL_USERS[0]); // fallback to admin
    setActiveTab('DASHBOARD');
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const matchedUser = users.find(
      u => u.username === loginUsername && u.password === loginPassword
    );

    if (matchedUser) {
      setCurrentUser(matchedUser);
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setLoginError('Kredensial salah! Harap periksa kembali Username/NISN dan Password.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setIsTakingTest(false);
    setActiveTab('DASHBOARD');
  };

  // Adding Student (Admin function)
  const handleAddSiswa = (
    siswaData: Omit<SiswaProfile, 'id' | 'userId' | 'status'>,
    passwordPlain: string
  ): boolean => {
    // Check duplication
    const duplicate = siswaProfiles.some(s => s.nisn === siswaData.nisn);
    if (duplicate) return false;

    const newUserId = `u-siswa-${Date.now()}`;
    const newSiswaId = `s-${Date.now()}`;

    // Create User account
    const newUser: User = {
      id: newUserId,
      username: siswaData.nisn,
      name: siswaData.name,
      email: siswaData.email,
      role: 'SISWA',
      password: passwordPlain,
    };

    // Create Profile
    const newProfile: SiswaProfile = {
      ...siswaData,
      id: newSiswaId,
      userId: newUserId,
      status: 'Belum Tes',
    };

    setUsers(prev => [...prev, newUser]);
    setSiswaProfiles(prev => [...prev, newProfile]);
    return true;
  };

  // Edit Student (Admin function)
  const handleEditSiswa = (id: string, updatedData: Partial<SiswaProfile>) => {
    setSiswaProfiles(prev =>
      prev.map(s => {
        if (s.id === id) {
          // Update corresponding user record name & email too
          setUsers(prevUsers =>
            prevUsers.map(u => {
              if (u.id === s.userId) {
                return {
                  ...u,
                  name: updatedData.name ?? u.name,
                  email: updatedData.email ?? u.email,
                  username: updatedData.nisn ?? u.username,
                };
              }
              return u;
            })
          );
          return { ...s, ...updatedData };
        }
        return s;
      })
    );
  };

  // Delete Student (Admin function)
  const handleDeleteSiswa = (id: string) => {
    const profile = siswaProfiles.find(s => s.id === id);
    if (profile) {
      // Remove User
      setUsers(prev => prev.filter(u => u.id !== profile.userId));
      // Remove Profile
      setSiswaProfiles(prev => prev.filter(s => s.id !== id));
      // Remove corresponding test result
      setTestResults(prev => prev.filter(r => r.siswaId !== id));
    }
  };

  // Adding Questions (Admin function)
  const handleAddQuestion = (newQ: Omit<Question, 'id'>) => {
    const newId = `q-${newQ.major.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    setQuestions(prev => [...prev, { ...newQ, id: newId }]);
  };

  // Editing Questions (Admin/Panitia function)
  const handleEditQuestion = (id: string, updatedQ: Partial<Question>) => {
    setQuestions(prev => prev.map(q => (q.id === id ? { ...q, ...updatedQ } : q)));
  };

  // Deleting Questions (Admin function)
  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Updates School Configurations
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };


  // === EXAM PLAYGROUND ENGINE ===

  // Start test
  const handleStartTest = () => {
    if (!currentSiswa) return;

    // Fetch questions for Choice 1 and Choice 2
    const questionsChoice1 = questions.filter(q => q.major === currentSiswa.choice1);
    const questionsChoice2 = questions.filter(q => q.major === currentSiswa.choice2);

    if (questionsChoice1.length === 0 || questionsChoice2.length === 0) {
      alert(`Bank soal belum lengkap! Pastikan Admin sudah mengisi bank soal minimal masing-masing satu pertanyaan untuk jurusan "${currentSiswa.choice1}" dan "${currentSiswa.choice2}" sebelum memulai tes.`);
      return;
    }

    // Concatenate packages
    const combinedQuestions = [...questionsChoice1, ...questionsChoice2];
    setTestQuestions(combinedQuestions);
    setStudentAnswers({});
    setCurrentQuestionIndex(0);
    setTestSecondsRemaining(settings.testDurationMinutes * 60);

    // Update Student Status to 'Sedang Tes'
    setSiswaProfiles(prev =>
      prev.map(s => (s.id === currentSiswa.id ? { ...s, status: 'Sedang Tes' } : s))
    );

    setIsTakingTest(true);
  };

  // Option select handler
  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    const activeQ = testQuestions[currentQuestionIndex];
    setStudentAnswers(prev => ({
      ...prev,
      [activeQ.id]: option,
    }));
  };

  // Next/Prev nav
  const handleNextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Final grading & result insertion logic
  const handleCalculateAndSubmit = () => {
    if (!currentSiswa) return;

    // Check if any question is left unanswered
    const unansweredCount = testQuestions.length - Object.keys(studentAnswers).length;
    if (unansweredCount > 0) {
      if (!confirm(`Terdapat ${unansweredCount} soal yang belum Anda jawab. Apakah Anda yakin ingin mengirimkan lembar jawaban sekarang?`)) {
        return;
      }
    }

    // Process submission
    submitExamResults();
  };

  const handleAutoSubmit = () => {
    // Triggered by timer completion
    alert('Waktu ujian Anda telah habis! Lembar jawaban akan dikirimkan otomatis.');
    submitExamResults();
  };

  const submitExamResults = () => {
    if (!currentSiswa) return;

    const questionsChoice1 = testQuestions.filter(q => q.major === currentSiswa.choice1);
    const questionsChoice2 = testQuestions.filter(q => q.major === currentSiswa.choice2);

    let choice1Correct = 0;
    let choice2Correct = 0;

    // Grade Choice 1
    questionsChoice1.forEach(q => {
      if (studentAnswers[q.id] === q.correctAnswer) {
        choice1Correct++;
      }
    });

    // Grade Choice 2
    questionsChoice2.forEach(q => {
      if (studentAnswers[q.id] === q.correctAnswer) {
        choice2Correct++;
      }
    });

    const choice1Score = questionsChoice1.length > 0 ? Math.round((choice1Correct / questionsChoice1.length) * 100) : 0;
    const choice2Score = questionsChoice2.length > 0 ? Math.round((choice2Correct / questionsChoice2.length) * 100) : 0;

    // Automatic Recommendation rule: Highest score determines major. On tie, choice 1 wins.
    let recommendation: MajorType = currentSiswa.choice1;
    if (choice2Score > choice1Score) {
      recommendation = currentSiswa.choice2;
    }

    // Determine status (Lulus vs Cadangan vs Dipertimbangkan based on settings passing grade)
    const avgScore = (choice1Score + choice2Score) / 2;
    let finalStatus: 'Lulus Seleksi' | 'Cadangan' | 'Dipertimbangkan' = 'Lulus Seleksi';
    if (avgScore < settings.passingGrade - 15) {
      finalStatus = 'Dipertimbangkan';
    } else if (avgScore < settings.passingGrade) {
      finalStatus = 'Cadangan';
    }

    const newResult: TestResult = {
      id: `r-${Date.now()}`,
      siswaId: currentSiswa.id,
      nisn: currentSiswa.nisn,
      name: currentSiswa.name,
      choice1: currentSiswa.choice1,
      choice1Correct,
      choice1Total: questionsChoice1.length,
      choice1Score,
      choice2: currentSiswa.choice2,
      choice2Correct,
      choice2Total: questionsChoice2.length,
      choice2Score,
      recommendedMajor: recommendation,
      dateCompleted: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: finalStatus,
    };

    // Save Result
    setTestResults(prev => [newResult, ...prev]);

    // Update student status to Selesai Tes
    setSiswaProfiles(prev =>
      prev.map(s => (s.id === currentSiswa.id ? { ...s, status: 'Selesai Tes' } : s))
    );

    setIsTakingTest(false);
    setActiveTab('HASIL');
  };

  // Helper formatting seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  // === SIDEBAR/HEADER INTERACTION ===
  const navigationItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'SISWA', label: 'Calon Siswa', icon: Users, hideForSiswa: true },
    { id: 'SOAL', label: 'Bank Soal', icon: BookOpen, hideForSiswa: true },
    { id: 'HASIL', label: 'Hasil Tes & Rekomendasi', icon: FileText },
    { id: 'PHP_MYSQL', label: 'Draf PHP & MySQL', icon: Server, hideForSiswa: true },
    { id: 'SETTINGS', label: 'Pengaturan', icon: Settings, hideForSiswa: true },
  ];

  const filteredNavigation = navigationItems.filter(
    item => !currentUser || currentUser.role !== 'SISWA' || !item.hideForSiswa
  );


  // === RENDER ACTIVE CONTROLLER ===
  const renderActiveView = () => {
    if (isTakingTest) {
      const activeQuestion = testQuestions[currentQuestionIndex];
      const selectedAns = studentAnswers[activeQuestion.id];

      return (
        <div className="max-w-3xl mx-auto space-y-6" id="active-test-container">
          {/* Header Progress / Timer */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ujian Potensi Akademik PMB</span>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">
                  Pertanyaan {currentQuestionIndex + 1} dari {testQuestions.length}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeQuestion.major === currentSiswa?.choice1 ? 'bg-teal-50 text-teal-700' : 'bg-indigo-50 text-indigo-700'
                }`}>
                  Materi: {activeQuestion.major}
                </span>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl text-rose-700 font-mono font-bold self-start sm:self-center">
              <Clock size={16} className="animate-pulse" />
              <span>Sisa Waktu: {formatTime(testSecondsRemaining)}</span>
            </div>
          </div>

          {/* Question Text Card */}
          <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 leading-relaxed">
              {activeQuestion.questionText}
            </h3>

            {/* Option Options */}
            <div className="space-y-3">
              {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                const optText = activeQuestion[`option${optKey}`];
                const isSelected = selectedAns === optKey;

                return (
                  <button
                    key={optKey}
                    onClick={() => handleSelectOption(optKey)}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-semibold flex items-center gap-3.5 transition duration-150 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/30 text-teal-900 ring-2 ring-teal-500/10'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className={`h-7 w-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold transition ${
                      isSelected ? 'bg-teal-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {optKey}
                    </span>
                    <span>{optText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 font-bold text-xs hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
            >
              <ArrowLeft size={14} />
              Sebelumnya
            </button>

            {/* Questions Tracker Dots */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
              {testQuestions.map((q, idx) => (
                <div 
                  key={q.id}
                  className={`h-2.5 w-2.5 rounded-full ${
                    idx === currentQuestionIndex ? 'bg-teal-600 scale-110' :
                    studentAnswers[q.id] ? 'bg-teal-300' : 'bg-gray-200'
                  }`}
                  title={`Soal ${idx + 1}`}
                />
              ))}
            </div>

            {currentQuestionIndex === testQuestions.length - 1 ? (
              <button
                onClick={handleCalculateAndSubmit}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs hover:from-teal-700 hover:to-emerald-700 shadow-md shadow-teal-600/10 transition transform active:translate-y-0 hover:-translate-y-0.5"
              >
                <CheckCircle2 size={14} />
                Kirim Lembar Jawaban
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition"
              >
                Selanjutnya
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'DASHBOARD':
        return (
          <DashboardView
            role={currentUser?.role || 'ADMIN'}
            siswaProfiles={siswaProfiles}
            testResults={testResults}
            questions={questions}
            currentSiswa={currentSiswa}
            onStartTest={handleStartTest}
            settings={settings}
          />
        );
      case 'SISWA':
        return (
          <SiswaListView
            role={currentUser?.role || 'ADMIN'}
            siswaProfiles={siswaProfiles}
            onAddSiswa={handleAddSiswa}
            onEditSiswa={handleEditSiswa}
            onDeleteSiswa={handleDeleteSiswa}
            settings={settings}
          />
        );
      case 'SOAL':
        return (
          <BankSoalView
            role={currentUser?.role || 'ADMIN'}
            questions={questions}
            onAddQuestion={handleAddQuestion}
            onEditQuestion={handleEditQuestion}
            onDeleteQuestion={handleDeleteQuestion}
          />
        );
      case 'HASIL':
        return (
          <HasilTesView
            role={currentUser?.role || 'ADMIN'}
            testResults={testResults}
            siswaProfiles={siswaProfiles}
            currentSiswa={currentSiswa}
          />
        );
      case 'PHP_MYSQL':
        return <PhpMysqlGuideView />;
      case 'SETTINGS':
        return (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetData={handleResetData}
          />
        );
      default:
        return null;
    }
  };


  // === RENDER GENERAL LAYOUT ===
  return (
    <div className="min-h-screen bg-gray-50/65 text-gray-900 flex flex-col font-sans" id="app-root">
      
      {/* 1. Quick Role Swapper Header Bar (Pre-authentication helper for demo purposes) */}
      <div className="bg-teal-900 text-white text-xs px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 font-semibold border-b border-teal-800 print:hidden shadow-sm">
        <div className="flex items-center gap-2">
          <Compass size={14} className="text-teal-400" />
          <span>Demo Role Swapper (Ganti Akun Instan untuk Simulasi Alur):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Admin Switcher */}
          <button 
            onClick={() => {
              setCurrentUser(users.find(u => u.role === 'ADMIN') || null);
              setIsTakingTest(false);
              setActiveTab('DASHBOARD');
            }}
            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition ${
              currentUser?.role === 'ADMIN' ? 'bg-white text-teal-950 font-extrabold shadow-sm' : 'bg-teal-800 text-teal-100 hover:bg-teal-700'
            }`}
          >
            ADMIN PORTAL
          </button>

          {/* Panitia Switcher */}
          <button 
            onClick={() => {
              setCurrentUser(users.find(u => u.role === 'PANITIA') || null);
              setIsTakingTest(false);
              setActiveTab('DASHBOARD');
            }}
            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition ${
              currentUser?.role === 'PANITIA' ? 'bg-white text-teal-950 font-extrabold shadow-sm' : 'bg-teal-800 text-teal-100 hover:bg-teal-700'
            }`}
          >
            PANITIA PORTAL
          </button>

          {/* Student 1 (Ahmad - Selesai) */}
          <button 
            onClick={() => {
              setCurrentUser(users.find(u => u.username === '202601') || null);
              setIsTakingTest(false);
              setActiveTab('DASHBOARD');
            }}
            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition ${
              currentUser?.username === '202601' ? 'bg-white text-teal-950 font-extrabold shadow-sm' : 'bg-teal-800 text-teal-100 hover:bg-teal-700'
            }`}
          >
            SISWA-1 (AHMAD - SELESAI)
          </button>

          {/* Student 2 (Dewi - Belum) */}
          <button 
            onClick={() => {
              setCurrentUser(users.find(u => u.username === '202604') || null);
              setIsTakingTest(false);
              setActiveTab('DASHBOARD');
            }}
            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition ${
              currentUser?.username === '202604' ? 'bg-white text-teal-950 font-extrabold shadow-sm' : 'bg-teal-800 text-teal-100 hover:bg-teal-700'
            }`}
          >
            SISWA-2 (DEWI - BELUM TES)
          </button>
        </div>
      </div>

      {!currentUser ? (
        /* ================= AUTHENTICATION FORM SCREEN ================= */
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-gray-150 p-8 rounded-2xl shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
                <Building size={24} />
              </div>
              <h2 className="text-xl font-black text-teal-950 tracking-tight">SMK Kesehatan Nusantara</h2>
              <p className="text-xs text-gray-500">Portal Tes Potensi Akademik Seleksi Siswa Baru</p>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs flex items-start gap-2">
                <AlertTriangle className="shrink-0 mt-0.5" size={15} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Username / NISN</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan username atau NISN Anda"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kata Sandi</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/10 transition text-sm flex items-center justify-center gap-1.5"
              >
                <Lock size={15} />
                Masuk ke Portal
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100 text-center space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">Gunakan Swapper Di Atas Untuk Pengujian Cepat</span>
              <p className="text-[10px] text-gray-400 max-w-xs mx-auto">
                Anda juga dapat mengetik manual password akun bawaan. Klik tombol role swapper berwarna putih/teal di paling atas untuk memilih profil uji coba.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ================= APPMANAGER MAIN PANEL LAYOUT ================= */
        <div className="flex-1 flex flex-col md:flex-row print:bg-white">
          {/* A. Sidebar Navigation (Hidden in Print Mode) */}
          <aside className="w-full md:w-64 bg-teal-950 text-teal-100 border-r border-teal-900 shrink-0 flex flex-col justify-between print:hidden">
            <div className="p-5 space-y-6">
              {/* Logo Header */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-teal-800 text-teal-200 flex items-center justify-center shadow-inner font-extrabold">
                  <Building size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white tracking-wide leading-none">{settings.schoolName}</h2>
                  <span className="text-[9px] text-teal-400 font-mono tracking-wider uppercase">Portal TPA PMB 2026</span>
                </div>
              </div>

              {/* User info box */}
              <div className="bg-teal-900/60 rounded-xl p-3 border border-teal-800/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-teal-400">
                  <UserCheck size={12} />
                  <span className="font-bold tracking-wider uppercase text-[9px]">Sesi Aktif ({currentUser.role})</span>
                </div>
                <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                {currentSiswa && (
                  <p className="text-[9px] text-teal-300 font-mono">NISN: {currentSiswa.nisn}</p>
                )}
              </div>

              {/* Nav menu links */}
              <nav className="space-y-1">
                {filteredNavigation.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      disabled={isTakingTest}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition text-left ${
                        isActive
                          ? 'bg-teal-700 text-white shadow-inner font-extrabold'
                          : 'text-teal-200 hover:bg-teal-900/50 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent'
                      }`}
                    >
                      <IconComponent size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Logout actions bottom footer */}
            <div className="p-5 border-t border-teal-900">
              <button
                onClick={handleLogout}
                disabled={isTakingTest}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-teal-300 hover:text-white hover:bg-teal-900/40 rounded-lg transition text-left disabled:opacity-30"
              >
                <LogOut size={16} />
                Keluar Sesi
              </button>
            </div>
          </aside>

          {/* B. Main Area Viewport */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 print:p-0 print:overflow-visible">
            {renderActiveView()}
          </main>
        </div>
      )}
    </div>
  );
}
