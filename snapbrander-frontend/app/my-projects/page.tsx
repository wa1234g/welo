
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/utils/api';
import { toast } from 'react-hot-toast';

export default function MyProjects() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetchApi('/api/projects/');
      
      if (response.success) {
        setProjects(response.data.projects);
      } else {
        setError('فشل في جلب المشاريع');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'creating': return 'bg-blue-500/20 text-blue-400';
      case 'development': return 'bg-yellow-500/20 text-yellow-400';
      case 'paused': return 'bg-red-500/20 text-red-400';
      case 'error': return 'bg-red-600/20 text-red-500';
      case 'maintenance': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'creating': return 'قيد الإنشاء';
      case 'development': return 'قيد التطوير';
      case 'paused': return 'متوقف';
      case 'error': return 'خطأ';
      case 'maintenance': return 'صيانة';
      default: return 'غير معروف';
    }
  };

  const filteredProjects = projects.filter((project: any) => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.domain && project.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (project.subdomain && project.subdomain.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout title="مشاريعي" currentPath="/my-projects">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">مشاريعي</h2>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
              {filteredProjects.length} مشروع
            </span>
          </div>
          <Link
            href="/create-project"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
          >
            <i className="ri-add-line"></i>
            <span>مشروع جديد</span>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'active', label: 'نشط' },
                { id: 'creating', label: 'قيد الإنشاء' },
                { id: 'development', label: 'قيد التطوير' },
                { id: 'paused', label: 'متوقف' }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                    filter === filterOption.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  placeholder="البحث في المشاريع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400">جاري تحميل المشاريع...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <i className="ri-error-warning-line text-2xl text-red-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">حدث خطأ</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any) => (
              <div key={project.id} className="bg-slate-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                    <div className="text-center">
                      <i className="ri-global-line text-4xl text-purple-400 mb-2"></i>
                      <p className="text-sm text-slate-300">معاينة الموقع</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <i className="ri-global-line"></i>
                      {project.domain || project.subdomain || 'لم يتم تحديد النطاق'}
                    </p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">نوع العمل:</span>
                      <span className="text-white">{project.business_type || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">الزوار:</span>
                      <span className="text-white">{project.visitors_count?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">تاريخ الإنشاء:</span>
                      <span className="text-white">{new Date(project.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/my-projects/${project.id}`}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm text-center transition-colors whitespace-nowrap"
                    >
                      إدارة
                    </Link>
                    <button className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                      <i className="ri-eye-line"></i>
                    </button>
                    <button className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                      <i className="ri-more-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
              <i className="ri-folder-line text-3xl text-slate-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">لا توجد مشاريع</h3>
            <p className="text-slate-400 mb-4">ابدأ بإنشاء مشروعك الأول الآن</p>
            <Link
              href="/create-project"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg whitespace-nowrap"
            >
              <i className="ri-add-line"></i>
              <span>إنشاء مشروع جديد</span>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
