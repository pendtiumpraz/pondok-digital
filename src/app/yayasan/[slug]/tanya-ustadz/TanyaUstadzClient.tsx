'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MessageCircleQuestion,
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MessageSquare,
  UserCheck,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuestionCategory, QuestionWithAnswer, QUESTION_CATEGORIES, PaginatedResponse } from '@/types';
import QuestionForm from '@/components/tanya-ustadz/QuestionForm';
import QuestionCard from '@/components/tanya-ustadz/QuestionCard';

interface TanyaUstadzStats {
  totalQuestions: number;
  answeredQuestions: number;
  pendingQuestions: number;
}

export default function TanyaUstadzClient() {
  const [activeTab, setActiveTab] = useState<'form' | 'answered' | 'pending'>('form');
  const [stats, setStats] = useState({ 
    totalQuestions: 0, 
    answeredQuestions: 0, 
    pendingQuestions: 0,
    averageResponseTime: 24
  });
  const [answeredQuestions, setAnsweredQuestions] = useState<QuestionWithAnswer[]>([]);
  const [pendingQuestions, setPendingQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [answeredPagination, setAnsweredPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [pendingPagination, setPendingPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch stats and initial data
  useEffect(() => {
    fetchStats();
    fetchAnsweredQuestions();
    fetchPendingQuestions();
  }, []);

  // Reset pagination when category or tab changes
  useEffect(() => {
    setAnsweredPagination(prev => ({ ...prev, page: 1 }));
    setPendingPagination(prev => ({ ...prev, page: 1 }));
  }, [selectedCategory, activeTab]);

  // Fetch questions when filters change
  useEffect(() => {
    if (activeTab === 'answered') {
      fetchAnsweredQuestions();
    } else if (activeTab === 'pending') {
      fetchPendingQuestions();
    }
  }, [activeTab, selectedCategory, searchTerm, answeredPagination.page, pendingPagination.page]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/questions/stats');
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setStats({
            totalQuestions: result.data.totalQuestions,
            answeredQuestions: result.data.answeredQuestions,
            pendingQuestions: result.data.pendingQuestions,
            averageResponseTime: result.data.averageResponseTimeHours || 24
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAnsweredQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: answeredPagination.page.toString(),
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/questions/public?${params}`);
      if (response.ok) {
        const data: PaginatedResponse<QuestionWithAnswer> = await response.json();
        console.log('Answered questions response:', data);
        setAnsweredQuestions(data.data || []);
        setAnsweredPagination(data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        });
      } else {
        console.error('Failed to fetch answered questions:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching answered questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pendingPagination.page.toString(),
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await fetch(`/api/questions/pending-public?${params}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Pending questions response:', data);
        setPendingQuestions(data.data || []);
        setPendingPagination(data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        });
      } else {
        console.error('Failed to fetch pending questions:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching pending questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmitted = () => {
    // Refresh stats after question submission
    fetchStats();
    // Refresh the questions list
    fetchAnsweredQuestions();
    fetchPendingQuestions();
    // Stay on the same tab to see the success message
  };

  const handlePageChange = (newPage: number) => {
    if (activeTab === 'answered') {
      setAnsweredPagination(prev => ({ ...prev, page: newPage }));
    } else {
      setPendingPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
              <MessageCircleQuestion className="w-4 h-4 mr-2" />
              Tanya Jawab Agama
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Tanya <span className="text-emerald-600">Ustadz</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bertanyalah tentang agama Islam kepada para ustadz kami. 
              Dapatkan jawaban yang tepat berdasarkan Al-Quran dan As-Sunnah.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="p-6 text-center border-emerald-200 bg-emerald-50">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-emerald-900 mb-2">{stats.totalQuestions}</div>
              <div className="text-emerald-700">Total Pertanyaan</div>
            </Card>
            <Card className="p-6 text-center border-blue-200 bg-blue-50">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-2">{stats.answeredQuestions}</div>
              <div className="text-blue-700">Sudah Dijawab</div>
            </Card>
            <Card className="p-6 text-center border-orange-200 bg-orange-50">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-lg mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-orange-900 mb-2">{stats.pendingQuestions}</div>
              <div className="text-orange-700">Menunggu Jawaban</div>
            </Card>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <Button
              variant={activeTab === 'form' ? 'default' : 'outline'}
              onClick={() => setActiveTab('form')}
              className="flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Ajukan Pertanyaan
            </Button>
            <Button
              variant={activeTab === 'answered' ? 'default' : 'outline'}
              onClick={() => setActiveTab('answered')}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Pertanyaan Terjawab
            </Button>
            <Button
              variant={activeTab === 'pending' ? 'default' : 'outline'}
              onClick={() => setActiveTab('pending')}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Belum Dijawab
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Question Form Tab */}
          {activeTab === 'form' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="p-8">
                <div className="text-center mb-8">
                  <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Ajukan Pertanyaan Anda
                  </h2>
                  <p className="text-gray-600">
                    Silakan ajukan pertanyaan seputar agama Islam. Pertanyaan Anda akan dijawab oleh ustadz kami.
                  </p>
                </div>

                <QuestionForm onSuccess={handleQuestionSubmitted} />

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Panduan Bertanya:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ajukan pertanyaan yang jelas dan spesifik</li>
                    <li>• Pilih kategori yang sesuai dengan pertanyaan Anda</li>
                    <li>• Gunakan bahasa yang sopan dan santun</li>
                    <li>• Pertanyaan akan dijawab dalam 1-3 hari kerja</li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Answered Questions Tab */}
          {activeTab === 'answered' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari pertanyaan atau jawaban..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as QuestionCategory | '')}
                  >
                    <option value="">Semua Kategori</option>
                    {QUESTION_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Memuat pertanyaan...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {answeredQuestions.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircleQuestion className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Belum ada pertanyaan yang dijawab</p>
                    </div>
                  ) : (
                    answeredQuestions.map((question) => (
                      <QuestionCard key={question.id} question={question} />
                    ))
                  )}

                  {/* Pagination */}
                  {answeredPagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(answeredPagination.page - 1)}
                        disabled={!answeredPagination.hasPrev}
                      >
                        Sebelumnya
                      </Button>
                      <span className="px-4 py-2 text-sm text-gray-600">
                        Halaman {answeredPagination.page} dari {answeredPagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(answeredPagination.page + 1)}
                        disabled={!answeredPagination.hasNext}
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Pending Questions Tab */}
          {activeTab === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Pertanyaan Menunggu Jawaban
                </h2>
                <p className="text-gray-600">
                  Berikut adalah pertanyaan-pertanyaan yang sedang menunggu jawaban dari para ustadz kami.
                </p>
              </div>

              {/* Category Filter */}
              <div className="mb-6 flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('')}
                  size="sm"
                >
                  Semua Kategori
                </Button>
                {QUESTION_CATEGORIES.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.value)}
                    size="sm"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>

              {/* Questions List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  <p className="mt-2 text-gray-600">Memuat pertanyaan...</p>
                </div>
              ) : pendingQuestions.length > 0 ? (
                <div className="space-y-4">
                  {pendingQuestions.map((question: any) => (
                    <QuestionCard key={question.id} question={question} />
                  ))}
                  
                  {/* Pagination */}
                  {pendingPagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pendingPagination.page - 1)}
                        disabled={!pendingPagination.hasPrev}
                      >
                        Sebelumnya
                      </Button>
                      <span className="px-4 py-2">
                        Halaman {pendingPagination.page} dari {pendingPagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pendingPagination.page + 1)}
                        disabled={!pendingPagination.hasNext}
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Belum ada pertanyaan yang menunggu jawaban</p>
                  <Button
                    onClick={() => setActiveTab('form')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Ajukan Pertanyaan Pertama
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kategori Pertanyaan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pilih kategori yang sesuai dengan pertanyaan Anda untuk mendapatkan jawaban yang tepat
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUESTION_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${category.color}`}>
                    <Tag className="w-4 h-4 inline-block mr-1" />
                    {category.label}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Masih Ada Pertanyaan?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Jangan ragu untuk bertanya! Para ustadz kami siap membantu Anda memahami ajaran Islam dengan benar.
          </p>
          <Button
            onClick={() => setActiveTab('form')}
            size="lg"
            className="bg-white text-emerald-600 hover:bg-gray-50"
          >
            <MessageCircleQuestion className="w-5 h-5 mr-2" />
            Ajukan Pertanyaan Sekarang
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}