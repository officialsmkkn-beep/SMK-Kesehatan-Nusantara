/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Role, Question, MajorType } from '../types';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  AlertTriangle,
  HeartPulse,
  Pill,
  Activity,
  FileText
} from 'lucide-react';

interface BankSoalViewProps {
  role: Role;
  questions: Question[];
  onAddQuestion: (newQuestion: Omit<Question, 'id'>) => void;
  onEditQuestion: (id: string, updatedQuestion: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
}

export default function BankSoalView({
  role,
  questions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}: BankSoalViewProps) {
  const isAdmin = role === 'ADMIN';

  // Active Major Category Tab
  const [activeTab, setActiveTab] = useState<MajorType>('Layanan Kesehatan');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');

  // Feedback Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetForm = () => {
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer('A');
    setErrorMsg('');
    setEditingId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q: Question) => {
    resetForm();
    setIsEditing(true);
    setEditingId(q.id);
    setQuestionText(q.questionText);
    setOptionA(q.optionA);
    setOptionB(q.optionB);
    setOptionC(q.optionC);
    setOptionD(q.optionD);
    setCorrectAnswer(q.correctAnswer);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!questionText || !optionA || !optionB || !optionC || !optionD) {
      setErrorMsg('Harap isi pertanyaan dan semua pilihan jawaban (A, B, C, D).');
      return;
    }

    if (isEditing && editingId) {
      onEditQuestion(editingId, {
        major: activeTab,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer
      });
      setSuccessMsg('Pertanyaan berhasil diperbarui!');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
      }, 1000);
    } else {
      onAddQuestion({
        major: activeTab,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer
      });
      setSuccessMsg('Pertanyaan baru berhasil ditambahkan ke bank soal!');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
      }, 1000);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pertanyaan ini dari bank soal?')) {
      onDeleteQuestion(id);
    }
  };

  // Filter questions based on current active major tab
  const filteredQuestions = questions.filter(q => q.major === activeTab);

  return (
    <div className="space-y-6" id="bank-soal-root">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bank Soal Ujian TPA</h1>
          <p className="text-gray-500 text-sm">Kelola materi soal uji kompetensi dasar per jurusan medis.</p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-sm text-sm transition"
            id="btn-add-soal"
          >
            <Plus size={16} />
            Tambah Soal Baru
          </button>
        )}
      </div>

      {/* Major Selection Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 border-b border-gray-150 pb-px">
        <button
          onClick={() => setActiveTab('Layanan Kesehatan')}
          className={`flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'Layanan Kesehatan'
              ? 'border-rose-500 text-rose-600 font-bold bg-rose-50/10'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'
          }`}
        >
          <HeartPulse size={16} className={activeTab === 'Layanan Kesehatan' ? 'text-rose-500' : 'text-gray-400'} />
          Layanan Kesehatan ({questions.filter(q => q.major === 'Layanan Kesehatan').length})
        </button>

        <button
          onClick={() => setActiveTab('Teknik Farmasi')}
          className={`flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'Teknik Farmasi'
              ? 'border-purple-500 text-purple-600 font-bold bg-purple-50/10'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'
          }`}
        >
          <Pill size={16} className={activeTab === 'Teknik Farmasi' ? 'text-purple-500' : 'text-gray-400'} />
          Teknik Farmasi ({questions.filter(q => q.major === 'Teknik Farmasi').length})
        </button>

        <button
          onClick={() => setActiveTab('Teknologi Laboratorium Medik')}
          className={`flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'Teknologi Laboratorium Medik'
              ? 'border-teal-500 text-teal-600 font-bold bg-teal-50/10'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'
          }`}
        >
          <Activity size={16} className={activeTab === 'Teknologi Laboratorium Medik' ? 'text-teal-500' : 'text-gray-400'} />
          Teknologi Laboratorium Medik ({questions.filter(q => q.major === 'Teknologi Laboratorium Medik').length})
        </button>
      </div>

      {/* Description Banner */}
      <div className={`rounded-xl border p-4 text-xs flex gap-3 ${
        activeTab === 'Layanan Kesehatan' ? 'bg-rose-50/40 border-rose-100 text-rose-900' :
        activeTab === 'Teknik Farmasi' ? 'bg-purple-50/40 border-purple-100 text-purple-900' :
        'bg-teal-50/40 border-teal-100 text-teal-900'
      }`}>
        <FileText size={18} className="shrink-0" />
        <div>
          <span className="font-bold">Materi Jurusan {activeTab}:</span> 
          {activeTab === 'Layanan Kesehatan' && ' Fokus pada konsep asuhan keperawatan dasar, sanitasi, anatomi tubuh manusia dasar, tanda-tanda vital (suhu, tensi, nadi), komunikasi terapeutik, dan pertolongan pertama (P3K).'}
          {activeTab === 'Teknik Farmasi' && ' Fokus pada terminologi resep medis latin, pengenalan golongan obat bebas/keras/terbatas, fungsi obat, takaran dosis dasar, jenis sediaan farmasi (puyer, salep, tablet), dan etika pelayanan kefarmasian.'}
          {activeTab === 'Teknologi Laboratorium Medik' && ' Fokus pada analisis spesimen mikroskopis dasar, pengenalan instrumen lab (mikroskop, sentrifus), reagen kimia dasar biologis, teknik flebotomi (pengambilan darah), dan standar K3 Lab Medik.'}
        </div>
      </div>

      {/* Questions Listing */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="rounded-xl border border-gray-150 bg-white p-12 text-center text-sm text-gray-400">
            Belum ada soal terdaftar untuk jurusan {activeTab}. Silakan klik &quot;Tambah Soal Baru&quot; di atas.
          </div>
        ) : (
          filteredQuestions.map((q, index) => (
            <div 
              key={q.id} 
              className="rounded-xl border border-gray-150 bg-white p-5 shadow-sm hover:border-gray-300 transition-all flex flex-col md:flex-row gap-4 justify-between"
            >
              {/* Question content */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                    activeTab === 'Layanan Kesehatan' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                    activeTab === 'Teknik Farmasi' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                    'bg-teal-50 text-teal-700 border border-teal-100'
                  }`}>
                    Soal {index + 1}
                  </span>
                </div>
                
                <h4 className="text-sm font-semibold text-gray-900 leading-relaxed">
                  {q.questionText}
                </h4>

                {/* Multiple choices options display */}
                <div className="grid gap-2 sm:grid-cols-2 mt-2">
                  {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                    const optText = q[`option${optKey}`];
                    const isCorrect = q.correctAnswer === optKey;
                    return (
                      <div 
                        key={optKey} 
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                          isCorrect 
                            ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800 font-semibold' 
                            : 'border-gray-100 bg-gray-50/30 text-gray-600'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {optKey}
                          </span>
                          <span>{optText}</span>
                        </span>
                        {isCorrect && <Check size={14} className="text-emerald-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons (Only for ADMIN) */}
              {isAdmin && (
                <div className="md:self-start flex md:flex-col gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 justify-end">
                  <button
                    onClick={() => handleOpenEditModal(q)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-teal-700 hover:bg-teal-50 border border-teal-100 rounded-lg font-semibold transition"
                    title="Ubah Pertanyaan"
                  >
                    <Edit3 size={13} />
                    <span>Ubah</span>
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 border border-red-100 rounded-lg font-semibold transition"
                    title="Hapus Pertanyaan"
                  >
                    <Trash2 size={13} />
                    <span>Hapus</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="border-b border-gray-150 px-6 py-4 flex items-center justify-between bg-gray-50">
              <h3 className="text-base font-bold text-gray-900">
                {isEditing ? 'Ubah Pertanyaan Bank Soal' : 'Tambah Pertanyaan Bank Soal'} ({activeTab})
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>
            </div>

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

              {/* Question Text */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Pertanyaan / Soal</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ketik draf soal ujian teoritis..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Options */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Opsi Pilihan Jawaban</h4>
                
                {/* Option A */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-600">A</span>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan teks opsi A"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                {/* Option B */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-600">B</span>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan teks opsi B"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                {/* Option C */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-600">C</span>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan teks opsi C"
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                {/* Option D */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-600">D</span>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan teks opsi D"
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Correct Answer Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kunci Jawaban yang Benar</label>
                <div className="flex gap-4">
                  {(['A', 'B', 'C', 'D'] as const).map((key) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={key}
                        checked={correctAnswer === key}
                        onChange={() => setCorrectAnswer(key)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className={`h-8 w-8 inline-flex items-center justify-center rounded-lg border font-bold ${
                        correctAnswer === key ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>
                        {key}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Footer */}
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
                  {isEditing ? 'Simpan Perubahan' : 'Simpan ke Bank Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
