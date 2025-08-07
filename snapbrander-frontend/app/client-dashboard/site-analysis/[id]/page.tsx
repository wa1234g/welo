
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function SiteAnalysisPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('speed');

  const project = {
    id: params.id,
    name: 'موقع شركتي',
    domain: 'mycompany.fureraa.com',
    url: 'https://mycompany.fureraa.com'
  };

  // محاكاة تحليل الموقع
  const analysisData = {
    speed: {
      score: 85,
      loadTime: '2.3s',
      firstContentfulPaint: '1.2s',
      largestContentfulPaint: '2.1s',
      cumulativeLayoutShift: 0.05,
      recommendations: [
        { type: 'warning', message: 'تحسين ضغط الصور يمكن أن يوفر 0.5 ثانية' },
        { type: 'success', message: 'كود CSS محسّن بشكل جيد' },
        { type: 'error', message: 'JavaScript غير محسّن - يؤثر على السرعة' },
        { type: 'info', message: 'استخدم CDN لتحسين الأداء' }
      ]
    },
    plugins: [
      { name: 'Elementor', version: '3.18.3', status: 'active', security: 'safe', lastUpdate: '2024-01-20' },
      { name: 'Yoast SEO', version: '21.8', status: 'active', security: 'safe', lastUpdate: '2024-01-18' },
      { name: 'Contact Form 7', version: '5.8.4', status: 'active', security: 'safe', lastUpdate: '2024-01-15' },
      { name: 'WooCommerce', version: '8.4.0', status: 'active', security: 'safe', lastUpdate: '2024-01-22' },
      { name: 'Akismet', version: '5.3.1', status: 'inactive', security: 'safe', lastUpdate: '2024-01-10' },
      { name: 'WP Super Cache', version: '1.9.4', status: 'active', security: 'warning', lastUpdate: '2023-12-15' }
    ],
    theme: {
      name: 'Astra',
      version: '4.6.4',
      author: 'Brainstorm Force',
      status: 'active',
      security: 'safe',
      lastUpdate: '2024-01-19',
      childTheme: true,
      responsive: true,
      seoFriendly: true
    },
    pages: [
      { id: 1, title: 'الصفحة الرئيسية', slug: '/', status: 'published', lastModified: '2024-01-20', views: 1250 },
      { id: 2, title: 'من نحن', slug: '/about', status: 'published', lastModified: '2024-01-18', views: 890 },
      { id: 3, title: 'خدماتنا', slug: '/services', status: 'published', lastModified: '2024-01-19', views: 1100 },
      { id: 4, title: 'المنتجات', slug: '/products', status: 'published', lastModified: '2024-01-17', views: 760 },
      { id: 5, title: 'المدونة', slug: '/blog', status: 'published', lastModified: '2024-01-21', views: 450 },
      { id: 6, title: 'اتصل بنا', slug: '/contact', status: 'published', lastModified: '2024-01-16', views: 340 },
      { id: 7, title: 'سياسة الخصوصية', slug: '/privacy', status: 'draft', lastModified: '2024-01-15', views: 0 },
      { id: 8, title: 'شروط الاستخدام', slug: '/terms', status: 'draft', lastModified: '2024-01-14', views: 0 }
    ],
    security: {
      score: 78,
      ssl: true,
      firewall: true,
      malware: false,
      vulnerabilities: 2,
      backups: true,
      lastScan: '2024-01-23',
      issues: [
        { type: 'medium', message: 'بعض الإضافات تحتاج تحديث' },
        { type: 'low', message: 'كلمة مرور المدير يُنصح بتقويتها' }
      ]
    }
  };

  useEffect(() => {
    // محاكاة تحميل البيانات
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400 bg-green-500/20';
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-red-500/20 text-red-400';
      case 'published': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'safe': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'danger': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const tabs = [
    { id: 'speed', label: 'سرعة الموقع', icon: 'ri-speed-line' },
    { id: 'plugins', label: 'الإضافات', icon: 'ri-plug-line' },
    { id: 'theme', label: 'القالب', icon: 'ri-palette-line' },
    { id: 'pages', label: 'الصفحات', icon: 'ri-file-list-line' },
    { id: 'security', label: 'الأمان', icon: 'ri-shield-line' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 font-cairo flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">جاري فحص الموقع...</h2>
          <p className="text-slate-400">يتم تحليل جميع جوانب موقعك</p>
          <div className="mt-6 space-y-2">
            <div className="text-purple-400 text-sm">🔍 فحص السرعة والأداء...</div>
            <div className="text-purple-400 text-sm">⚙️ تحليل الإضافات والقالب...</div>
            <div className="text-purple-400 text-sm">🛡️ فحص الأمان والثغرات...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-cairo">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/client-dashboard">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center cursor-pointer">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-white">فحص الموقع</h1>
                <p className="text-sm text-slate-400">{project.domain}</p>
              </div>
            </div>
            <Link
              href="/client-dashboard"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <i className="ri-arrow-right-line text-xl"></i>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="ri-speed-line text-white text-xl"></i>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getScoreColor(analysisData.speed.score)}`}>
                  {analysisData.speed.score}
                </div>
                <div className="text-slate-400 text-sm mt-1">نقاط السرعة</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <i className="ri-plug-line text-white text-xl"></i>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{analysisData.plugins.length}</div>
                <div className="text-slate-400 text-sm">إضافة مثبتة</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <i className="ri-file-list-line text-white text-xl"></i>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{analysisData.pages.length}</div>
                <div className="text-slate-400 text-sm">صفحة</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <i className="ri-shield-line text-white text-xl"></i>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getScoreColor(analysisData.security.score)}`}>
                  {analysisData.security.score}
                </div>
                <div className="text-slate-400 text-sm mt-1">نقاط الأمان</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-slate-800 rounded-xl">
          <div className="border-b border-slate-700">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Speed Analysis */}
            {activeTab === 'speed' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">تحليل سرعة الموقع</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-700 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-3">مؤشرات الأداء</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">وقت التحميل:</span>
                          <span className="text-white font-mono">{analysisData.speed.loadTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">أول محتوى مرئي:</span>
                          <span className="text-white font-mono">{analysisData.speed.firstContentfulPaint}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">أكبر محتوى:</span>
                          <span className="text-white font-mono">{analysisData.speed.largestContentfulPaint}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">تغيير التخطيط:</span>
                          <span className="text-white font-mono">{analysisData.speed.cumulativeLayoutShift}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">النتيجة الإجمالية</h4>
                        <div className={`px-3 py-1 rounded-lg font-bold ${getScoreColor(analysisData.speed.score)}`}>
                          {analysisData.speed.score}/100
                        </div>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all"
                          style={{ width: `${analysisData.speed.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-slate-700 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-4">توصيات التحسين</h4>
                      <div className="space-y-3">
                        {analysisData.speed.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-slate-600 rounded-lg">
                            <i className={`ri-${
                              rec.type === 'error' ? 'error-warning' : 
                              rec.type === 'warning' ? 'alert' : 
                              rec.type === 'success' ? 'check-line' : 'information'
                            }-line text-${
                              rec.type === 'error' ? 'red' : 
                              rec.type === 'warning' ? 'yellow' : 
                              rec.type === 'success' ? 'green' : 'blue'
                            }-400 mt-0.5`}></i>
                            <span className="text-slate-300 text-sm">{rec.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Plugins Analysis */}
            {activeTab === 'plugins' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white">الإضافات المثبتة</h3>
                  <div className="text-sm text-slate-400">
                    {analysisData.plugins.filter(p => p.status === 'active').length} نشطة من {analysisData.plugins.length}
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-600">
                      <tr>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">الإضافة</th>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">الإصدار</th>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">الحالة</th>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">الأمان</th>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">آخر تحديث</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisData.plugins.map((plugin, index) => (
                        <tr key={index} className="border-t border-slate-600">
                          <td className="py-3 px-4 text-white font-medium">{plugin.name}</td>
                          <td className="py-3 px-4 text-slate-300 font-mono text-sm">{plugin.version}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plugin.status)}`}>
                              {plugin.status === 'active' ? 'نشطة' : 'غير نشطة'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plugin.security)}`}>
                              {plugin.security === 'safe' ? 'آمنة' : plugin.security === 'warning' ? 'تحذير' : 'خطر'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-sm">{plugin.lastUpdate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Theme Analysis */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">تحليل القالب</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-700 rounded-lg p-6">
                    <h4 className="font-medium text-white mb-4">معلومات القالب</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">اسم القالب:</span>
                        <span className="text-white font-medium">{analysisData.theme.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">الإصدار:</span>
                        <span className="text-white font-mono">{analysisData.theme.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">المطور:</span>
                        <span className="text-white">{analysisData.theme.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">الحالة:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analysisData.theme.status)}`}>
                          نشط
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">آخر تحديث:</span>
                        <span className="text-white">{analysisData.theme.lastUpdate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-6">
                    <h4 className="font-medium text-white mb-4">مميزات القالب</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <i className={`ri-${analysisData.theme.childTheme ? 'check' : 'close'}-line text-${analysisData.theme.childTheme ? 'green' : 'red'}-400`}></i>
                        <span className="text-slate-300">قالب فرعي</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <i className={`ri-${analysisData.theme.responsive ? 'check' : 'close'}-line text-${analysisData.theme.responsive ? 'green' : 'red'}-400`}></i>
                        <span className="text-slate-300">متجاوب</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <i className={`ri-${analysisData.theme.seoFriendly ? 'check' : 'close'}-line text-${analysisData.theme.seoFriendly ? 'green' : 'red'}-400`}></i>
                        <span className="text-slate-300">محسّن لمحركات البحث</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <i className={`ri-${analysisData.theme.security === 'safe' ? 'check' : 'close'}-line text-${analysisData.theme.security === 'safe' ? 'green' : 'red'}-400`}></i>
                        <span className="text-slate-300">آمن</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pages Analysis */}
            {activeTab === 'pages' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white">صفحات الموقع</h3>
                  <div className="text-sm text-slate-400">
                    {analysisData.pages.filter(p => p.status === 'published').length} منشورة من {analysisData.pages.length}
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-600">
                      <tr>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">عنوان الصفحة</th>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">الرابط</th>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">الحالة</th>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">المشاهدات</th>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">آخر تعديل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisData.pages.map((page) => (
                        <tr key={page.id} className="border-t border-slate-600">
                          <td className="py-3 px-4 text-white font-medium">{page.title}</td>
                          <td className="py-3 px-4 text-slate-300 font-mono text-sm">{page.slug}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                              {page.status === 'published' ? 'منشورة' : 'مسودة'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white">{page.views.toLocaleString()}</td>
                          <td className="py-3 px-4 text-slate-400 text-sm">{page.lastModified}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Security Analysis */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">تحليل الأمان</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">نقاط الأمان</h4>
                        <div className={`px-3 py-1 rounded-lg font-bold ${getScoreColor(analysisData.security.score)}`}>
                          {analysisData.security.score}/100
                        </div>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-3 mb-3">
                        <div 
                          className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all"
                          style={{ width: `${analysisData.security.score}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-3">حالة الأمان</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <i className={`ri-${analysisData.security.ssl ? 'check' : 'close'}-line text-${analysisData.security.ssl ? 'green' : 'red'}-400`}></i>
                          <span className="text-slate-300">شهادة SSL</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <i className={`ri-${analysisData.security.firewall ? 'check' : 'close'}-line text-${analysisData.security.firewall ? 'green' : 'red'}-400`}></i>
                          <span className="text-slate-300">جدار الحماية</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <i className={`ri-${!analysisData.security.malware ? 'check' : 'close'}-line text-${!analysisData.security.malware ? 'green' : 'red'}-400`}></i>
                          <span className="text-slate-300">خالي من البرامج الضارة</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <i className={`ri-${analysisData.security.backups ? 'check' : 'close'}-line text-${analysisData.security.backups ? 'green' : 'red'}-400`}></i>
                          <span className="text-slate-300">النسخ الاحتياطية</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-slate-700 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-white mb-3">إحصائيات الأمان</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">الثغرات المكتشفة:</span>
                          <span className="text-yellow-400 font-medium">{analysisData.security.vulnerabilities}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">آخر فحص:</span>
                          <span className="text-white">{analysisData.security.lastScan}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-4">مشاكل الأمان</h4>
                      <div className="space-y-3">
                        {analysisData.security.issues.map((issue, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-slate-600 rounded-lg">
                            <i className={`ri-${
                              issue.type === 'high' ? 'error-warning' : 
                              issue.type === 'medium' ? 'alert' : 'information'
                            }-line text-${
                              issue.type === 'high' ? 'red' : 
                              issue.type === 'medium' ? 'yellow' : 'blue'
                            }-400 mt-0.5`}></i>
                            <span className="text-slate-300 text-sm">{issue.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
            <i className="ri-refresh-line"></i>
            <span>إعادة الفحص</span>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
            <i className="ri-download-line"></i>
            <span>تحميل التقرير</span>
          </button>
          <Link
            href="/client-dashboard"
            className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <i className="ri-arrow-right-line"></i>
            <span>العودة للوحة التحكم</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
