'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    
    // محاكاة البحث في البيانات
    const mockResults = [
      {
        id: 1,
        type: 'project',
        title: 'موقع شركة التقنية المتقدمة',
        description: 'موقع شركة متخصصة في تطوير حلول التقنية المتقدمة',
        url: '/my-projects/1',
        domain: 'tech-company.fureraa.com',
        created: '2024-01-15',
        status: 'active'
      },
      {
        id: 2,
        type: 'project',
        title: 'متجر الإلكترونيات',
        description: 'متجر إلكتروني لبيع الأجهزة والإكسسوارات',
        url: '/my-projects/2',
        domain: 'electronics-store.fureraa.com',
        created: '2024-01-10',
        status: 'development'
      },
      {
        id: 3,
        type: 'template',
        title: 'قالب الأعمال الحديث',
        description: 'قالب احترافي للشركات والأعمال',
        url: '/templates/modern-business',
        category: 'أعمال',
        price: 'مجاني'
      },
      {
        id: 4,
        type: 'user',
        title: 'أحمد محمد علي',
        description: 'مدير المشاريع في شركة التقنية المتقدمة',
        url: '/users/1',
        role: 'عميل',
        joinDate: '2023-06-15'
      },
      {
        id: 5,
        type: 'page',
        title: 'إعدادات النظام',
        description: 'إدارة إعدادات المنصة والتكاملات',
        url: '/settings',
        section: 'إدارة'
      },
      {
        id: 6,
        type: 'notification',
        title: 'تم إنشاء موقع جديد',
        description: 'إشعار بإنجاز إنشاء موقع شركة التقنية المتقدمة',
        url: '/notifications',
        time: '2024-01-15 10:30:00',
        read: false
      }
    ];

    // تصفية النتائج بناءً على البحث
    const filteredResults = mockResults.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setTimeout(() => {
      setResults(filteredResults);
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'project': return 'ri-global-line';
      case 'template': return 'ri-layout-line';
      case 'user': return 'ri-user-line';
      case 'page': return 'ri-pages-line';
      case 'notification': return 'ri-notification-line';
      default: return 'ri-search-line';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'project': return 'مشروع';
      case 'template': return 'قالب';
      case 'user': return 'مستخدم';
      case 'page': return 'صفحة';
      case 'notification': return 'إشعار';
      default: return 'أخرى';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'project': return 'text-blue-400 bg-blue-500/20';
      case 'template': return 'text-green-400 bg-green-500/20';
      case 'user': return 'text-purple-400 bg-purple-500/20';
      case 'page': return 'text-orange-400 bg-orange-500/20';
      case 'notification': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const filteredResults = results.filter(result => {
    if (filter === 'all') return true;
    return result.type === filter;
  });

  const resultCounts = {
    all: results.length,
    project: results.filter(r => r.type === 'project').length,
    template: results.filter(r => r.type === 'template').length,
    user: results.filter(r => r.type === 'user').length,
    page: results.filter(r => r.type === 'page').length,
    notification: results.filter(r => r.type === 'notification').length,
  };

  return (
    <DashboardLayout title="البحث" currentPath="/search">
      <div className="space-y-6">
        {/* Search Header */}
        <div className="bg-slate-800 rounded-xl p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                البحث في النظام
              </label>
              <div className="relative">
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <i className="ri-search-line"></i>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-12 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ابحث عن المشاريع، القوالب، المستخدمين..."
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'بحث'
                  )}
                </button>
              </div>
            </div>

            {/* Search Suggestions */}
            <div className="flex flex-wrap gap-2">
              <span className="text-slate-400 text-sm">اقتراحات:</span>
              {['مشروع', 'قالب', 'إعدادات', 'إشعارات'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Search Results */}
        {query && (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  نتائج البحث عن: "<span className="text-purple-400">{query}</span>"
                </h2>
                <p className="text-slate-400">
                  تم العثور على {results.length} نتيجة
                </p>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">ترتيب حسب:</label>
                <select className="bg-slate-700 text-white px-3 py-2 rounded text-sm pr-8">
                  <option value="relevance">الأكثر صلة</option>
                  <option value="date">الأحدث</option>
                  <option value="name">الاسم</option>
                </select>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-slate-800 rounded-xl">
              <div className="border-b border-slate-700">
                <div className="flex overflow-x-auto">
                  {[
                    { id: 'all', label: 'الكل', count: resultCounts.all },
                    { id: 'project', label: 'المشاريع', count: resultCounts.project },
                    { id: 'template', label: 'القوالب', count: resultCounts.template },
                    { id: 'user', label: 'المستخدمين', count: resultCounts.user },
                    { id: 'page', label: 'الصفحات', count: resultCounts.page },
                    { id: 'notification', label: 'الإشعارات', count: resultCounts.notification }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                        filter === tab.id
                          ? 'text-purple-400 border-b-2 border-purple-400'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          filter === tab.id ? 'bg-purple-500/20' : 'bg-slate-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results List */}
              <div className="divide-y divide-slate-700">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">جاري البحث...</p>
                  </div>
                ) : filteredResults.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-search-line text-2xl text-slate-400"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">لا توجد نتائج</h3>
                    <p className="text-slate-400">
                      {query ? `لم يتم العثور على نتائج تحتوي على "${query}"` : 'ابدأ بكتابة ما تبحث عنه'}
                    </p>
                  </div>
                ) : (
                  filteredResults.map((result) => (
                    <Link key={result.id} href={result.url}>
                      <div className="p-6 hover:bg-slate-700/50 transition-colors cursor-pointer">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(result.type)}`}>
                            <i className={getTypeIcon(result.type)}></i>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-white hover:text-purple-400 transition-colors">
                                {result.title}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(result.type)}`}>
                                {getTypeLabel(result.type)}
                              </span>
                            </div>
                            
                            <p className="text-slate-400 text-sm mb-2">
                              {result.description}
                            </p>

                            {/* Additional Info */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                              {result.domain && (
                                <div className="flex items-center gap-1">
                                  <i className="ri-global-line"></i>
                                  <span>{result.domain}</span>
                                </div>
                              )}
                              {result.created && (
                                <div className="flex items-center gap-1">
                                  <i className="ri-calendar-line"></i>
                                  <span>تاريخ الإنشاء: {result.created}</span>
                                </div>
                              )}
                              {result.category && (
                                <div className="flex items-center gap-1">
                                  <i className="ri-price-tag-line"></i>
                                  <span>{result.category}</span>
                                </div>
                              )}
                              {result.role && (
                                <div className="flex items-center gap-1">
                                  <i className="ri-user-line"></i>
                                  <span>{result.role}</span>
                                </div>
                              )}
                              {result.status && (
                                <div className="flex items-center gap-1">
                                  <i className="ri-information-line"></i>
                                  <span>{result.status === 'active' ? 'نشط' : 'قيد التطوير'}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action */}
                          <div className="flex items-center text-slate-400">
                            <i className="ri-arrow-left-line"></i>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* Load More */}
              {filteredResults.length > 0 && (
                <div className="p-6 text-center border-t border-slate-700">
                  <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                    تحميل المزيد من النتائج
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Access */}
        {!query && (
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">الوصول السريع</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'مشاريعي', description: 'عرض جميع مشاريعك', url: '/my-projects', icon: 'ri-folder-line' },
                { title: 'القوالب', description: 'تصفح القوالب المتاحة', url: '/templates', icon: 'ri-layout-line' },
                { title: 'الإعدادات', description: 'إدارة إعدادات الحساب', url: '/settings', icon: 'ri-settings-line' },
                { title: 'الإشعارات', description: 'رسائل وتنبيهات النظام', url: '/notifications', icon: 'ri-notification-line' },
                { title: 'المساعدة', description: 'الدعم والأسئلة الشائعة', url: '/help', icon: 'ri-question-line' },
                { title: 'إنشاء موقع', description: 'بدء مشروع جديد', url: '/website-generator', icon: 'ri-add-circle-line' }
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                      <i className={`${item.icon} text-white`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                    <i className="ri-arrow-left-line text-slate-400 group-hover:text-white transition-colors"></i>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <DashboardLayout title="البحث" currentPath="/search">
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">جاري تحميل صفحة البحث...</p>
        </div>
      </DashboardLayout>
    }>
      <SearchResults />
    </Suspense>
  );
}